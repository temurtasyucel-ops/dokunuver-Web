import { NextResponse } from "next/server";

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

async function verifyAdmin(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return {
      ok: false,
      status: 500,
      error: "Sunucu yapılandırması eksik.",
    };
  }

  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      ok: false,
      status: 401,
      error: "Yetkisiz erişim.",
    };
  }

  const accessToken = authorization.slice(7).trim();

  if (!accessToken) {
    return {
      ok: false,
      status: 401,
      error: "Yetkisiz erişim.",
    };
  }

  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: "GET",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        status: 401,
        error: "Oturum geçersiz veya süresi dolmuş.",
      };
    }

    const user = await response.json();

    if (!user?.id) {
      return {
        ok: false,
        status: 401,
        error: "Yetkisiz erişim.",
      };
    }

    return {
      ok: true,
      user,
    };
  } catch (error) {
    console.error("Admin verification error:", error);

    return {
      ok: false,
      status: 500,
      error: "Oturum doğrulanamadı.",
    };
  }
}
export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !secretKey) {
      return NextResponse.json(
        { error: "Sunucu yapılandırması eksik." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?select=*&order=id.desc`,
      {
        method: "GET",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Supabase GET error:", data);

      return NextResponse.json(
        { error: "Kartlar getirilemedi." },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      cards: data,
    });
  } catch (error) {
    console.error("GET /api/iban-cards error:", error);

    return NextResponse.json(
      { error: "Sunucuda beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

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

export async function PATCH(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    const body = await request.json();

    const code = body.code?.trim();
    const businessName = body.business_name?.trim();
    const bankName = body.bank_name?.trim();
    const accountHolder = body.account_holder?.trim();
    const iban = body.iban?.replace(/\s/g, "").toUpperCase();
    const active = body.active !== false;

    if (!code) {
      return NextResponse.json(
        { error: "Kart kodu bulunamadı." },
        { status: 400 }
      );
    }

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
      return NextResponse.json(
        { error: "Sunucu yapılandırması eksik." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(code)}`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          business_name: businessName,
          bank_name: bankName,
          account_holder: accountHolder,
          iban,
          active,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Supabase PATCH error:", data);

      return NextResponse.json(
        { error: "Kart güncellenemedi." },
        { status: response.status }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Güncellenecek kart bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      card: data[0],
    });
  } catch (error) {
    console.error("PATCH /api/iban-cards error:", error);

    return NextResponse.json(
      { error: "Sunucuda beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
