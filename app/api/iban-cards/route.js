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

/* =========================================================
   GET - IBAN KARTLARINI GETİR
========================================================= */

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

/* =========================================================
   POST - NORMAL IBAN KARTI VEYA STOK KARTI OLUŞTUR
========================================================= */

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

    const mode = body.mode;
    const quantity = Number(body.quantity);

    const businessName = body.business_name?.trim();
    const bankName = body.bank_name?.trim();
    const accountHolder = body.account_holder?.trim();
    const iban = body.iban?.replace(/\s/g, "").toUpperCase();
    const active = body.active !== false;

    /*
      Normal kart oluşturuluyorsa alanlar zorunlu.
      Stok kartında müşteri bilgileri henüz bulunmaz.
    */
    if (
  mode !== "stock" &&
  mode !== "stock_bulk" &&
  (!businessName || !bankName || !accountHolder || !iban)
) {
      return NextResponse.json(
        { error: "Lütfen tüm alanları doldurun." },
        { status: 400 }
      );
    }

    /*
      Normal kart için Türkiye IBAN kontrolü.
      Stok kartında henüz IBAN olmadığı için uygulanmaz.
    */
    if (
      mode !== "stock" &&
      (!iban.startsWith("TR") || iban.length !== 26)
    ) {
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
    /* =====================================================
   TOPLU STOK IBAN KARTI
===================================================== */

if (mode === "stock_bulk") {
  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > 100
  ) {
    return NextResponse.json(
      {
        error:
          "Toplu stok adedi 1 ile 100 arasında olmalıdır.",
      },
      { status: 400 }
    );
  }

  const createdCards = [];

  for (let i = 0; i < quantity; i++) {
    let created = false;

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
            business_name: null,
            bank_name: null,
            account_holder: null,
            iban: null,
            active: false,
            status: "stock",
            locked: false,
            locked_at: null,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        createdCards.push(data[0]);
        created = true;
        break;
      }

      if (response.status === 409) {
        continue;
      }

      console.error(
        "Supabase bulk stock insert error:",
        data
      );

      return NextResponse.json(
        {
          error: `${createdCards.length} kart oluşturuldu ancak toplu işlem tamamlanamadı.`,
          cards: createdCards,
        },
        { status: 500 }
      );
    }

    if (!created) {
      return NextResponse.json(
        {
          error: `${createdCards.length} kart oluşturuldu ancak benzersiz kart kodu üretilemedi.`,
          cards: createdCards,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    {
      success: true,
      count: createdCards.length,
      cards: createdCards,
      message: `${createdCards.length} adet stok IBAN kartı oluşturuldu.`,
    },
    { status: 201 }
  );
}

    /* =====================================================
       STOK IBAN KARTI
    ===================================================== */

    if (mode === "stock") {
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
              business_name: null,
              bank_name: null,
              account_holder: null,
              iban: null,
              active: false,
              status: "stock",
              locked: false,
              locked_at: null,
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

        // Kod çakışırsa yeni kod üret.
        if (response.status === 409) {
          continue;
        }

        console.error("Supabase stock insert error:", data);

        return NextResponse.json(
          { error: "Stok IBAN kartı oluşturulamadı." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: "Benzersiz stok kartı kodu oluşturulamadı." },
        { status: 500 }
      );
    }

    /* =====================================================
       NORMAL IBAN KARTI
    ===================================================== */

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
            status: "assigned",
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

/* =========================================================
   PATCH - IBAN KARTI BİLGİLERİNİ GÜNCELLE
========================================================= */

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

    // Önce mevcut kartı kontrol et.
    const checkResponse = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
        code
      )}&select=code,locked,status`,
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

    const existingCard = existingCards[0];

    if (existingCard.locked === true) {
      return NextResponse.json(
        {
          error:
            "Bu IBAN kartı doğrulanmış ve kilitlenmiştir. Finansal bilgiler artık değiştirilemez.",
        },
        { status: 423 }
      );
    }

    /*
      Eğer kart stoktaysa, müşteri bilgileri ilk kez girildiğinde
      otomatik olarak assigned durumuna geçer.
    */
    const nextStatus =
      existingCard.status === "stock"
        ? "assigned"
        : existingCard.status || "assigned";

    const response = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
        code
      )}`,
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
          status: nextStatus,
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

/* =========================================================
   PUT - KARTI AKTİF / PASİF YAP
========================================================= */

export async function PUT(request) {
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
    const active = body.active;

    if (!code || typeof active !== "boolean") {
      return NextResponse.json(
        { error: "Kart kodu veya durum bilgisi geçersiz." },
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

    /*
      Stok kartlarının yanlışlıkla aktif edilmesini engelle.
    */
    if (active === true) {
      const checkResponse = await fetch(
        `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
          code
        )}&select=code,status`,
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
        return NextResponse.json(
          { error: "Kart durumu kontrol edilemedi." },
          { status: 500 }
        );
      }

      if (!existingCards || existingCards.length === 0) {
        return NextResponse.json(
          { error: "Kart bulunamadı." },
          { status: 404 }
        );
      }

      if (existingCards[0].status === "stock") {
        return NextResponse.json(
          {
            error:
              "Stok kartı müşteriye atanmadan aktif hale getirilemez.",
          },
          { status: 409 }
        );
      }
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
        code
      )}`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          active,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Supabase status update error:", data);

      return NextResponse.json(
        { error: "Kart durumu değiştirilemedi." },
        { status: response.status }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Kart bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      card: data[0],
    });
  } catch (error) {
    console.error("PUT /api/iban-cards error:", error);

    return NextResponse.json(
      { error: "Sunucuda beklenmeyen bir hata oluştu." },
      { status: 500 }
    );
  }
}
