import { NextResponse } from "next/server";

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
      )}&select=code,locked`,
      {
        method: "GET",
        headers: {
          apikey: secretKey,
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

    if (existingCards[0].locked === true) {
      return NextResponse.json(
        { error: "Bu IBAN kartı zaten kilitlenmiş." },
        { status: 409 }
      );
    }

    // Kartı kalıcı olarak kilitle
    const lockResponse = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
        code
      )}&locked=eq.false`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          locked: true,
          locked_at: new Date().toISOString(),
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
        { error: "Kart kilitlenemedi veya zaten kilitli." },
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
      { error: "Sunucuda beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
