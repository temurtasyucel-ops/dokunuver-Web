import { NextResponse } from "next/server";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const businessName = body.business_name?.trim();
    const bankName = body.bank_name?.trim();
    const accountHolder = body.account_holder?.trim();
    const iban = body.iban?.replace(/\s/g, "").toUpperCase();
    const active = body.active !== false;

    if (!businessName || !bankName || !accountHolder || !iban) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    if (!iban.startsWith("TR") || iban.length !== 26) {
      return NextResponse.json(
        { error: "Geçerli bir Türkiye IBAN'ı girin." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      console.error("Supabase environment variables missing.");

      return NextResponse.json(
        { error: "Sunucu yapılandırması eksik." },
        { status: 500 }
      );
    }

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();

      const response = await fetch(
        `${supabaseUrl}/rest/v1/iban_cards`,
        {
          method: "POST",
          headers: {
            apikey: secretKey,
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            code,
            business_name: businessName,
            bank_name: bankName,
            account_holder: accountHolder,
            iban,
            active,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        return NextResponse.json(
          {
            success: true,
            card: data[0],
          },
          { status: 201 }
        );
      }

      // code UNIQUE çakışması olursa yeni kod üretip tekrar dener.
      if (response.status === 409) {
        continue;
      }

      console.error("Supabase insert error:", data);

      return NextResponse.json(
        { error: "Kart veritabanına kaydedilemedi." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Benzersiz kart kodu oluşturulamadı." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Create IBAN card error:", error);

    return NextResponse.json(
      { error: "Beklenmeyen bir sunucu hatası oluştu." },
      { status: 500 }
    );
  }
}
