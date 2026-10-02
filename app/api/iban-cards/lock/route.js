import { requirePanelAdmin as verifyAdmin } from "../../../../lib/admin-auth.mjs";
import { NextResponse } from "next/server";



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
    const code = body.code?.trim();

    if (!code) {
      return NextResponse.json(
        { error: "Kart kodu bulunamadı." },
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

    // Önce kartı kontrol et
    const checkResponse = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
        code
      )}&select=code,locked,status`,
      {
        method: "GET",
        headers: {
          apikey: secretKey,
          "x-panel-actor": auth.user.id,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    const existingCards = await checkResponse.json();

    if (!checkResponse.ok) {
      console.error("IBAN lock check error:", existingCards);

      return NextResponse.json(
        { error: "Kart bilgileri kontrol edilemedi." },
        { status: 500 }
      );
    }

    if (!existingCards || existingCards.length === 0) {
      return NextResponse.json(
        { error: "Kart bulunamadı." },
        { status: 404 }
      );
    }

    const existingCard = existingCards[0];

    if (existingCard.locked === true) {
      return NextResponse.json(
        { error: "Bu IBAN kartı zaten kilitlenmiş." },
        { status: 409 }
      );
    }

    // Stok kartı doğrudan kilitlenemez
    if (existingCard.status === "stock") {
      return NextResponse.json(
        {
          error:
            "Stok kartı müşteriye atanmadan kilitlenemez.",
        },
        { status: 409 }
      );
    }

    // Kartı doğrula ve kalıcı olarak kilitle.
    // locked, locked_at ve status aynı işlemde güncellenir.
    const lockResponse = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
        code
      )}&locked=eq.false`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          "x-panel-actor": auth.user.id,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          locked: true,
          locked_at: new Date().toISOString(),
          status: "locked",
        }),
      }
    );

    const data = await lockResponse.json();

    if (!lockResponse.ok) {
      console.error("IBAN lock error:", data);

      return NextResponse.json(
        { error: "IBAN kartı kilitlenemedi." },
        { status: lockResponse.status }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          error:
            "Kart kilitlenemedi veya zaten kilitli.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      card: data[0],
      message:
        "IBAN bilgileri doğrulandı ve kart kalıcı olarak kilitlendi.",
    });
  } catch (error) {
    console.error("POST /api/iban-cards/lock error:", error);

    return NextResponse.json(
      {
        error:
          "Sunucuda beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}

