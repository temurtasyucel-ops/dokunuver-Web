export const dynamic = "force-dynamic";

async function verifyAdmin(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.replace("Bearer ", "");

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return response.ok;
}

export async function GET(request) {
  try {
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return Response.json(
        { error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?select=id,code,product_type,business_name,target_url,status,active,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Smart Links Supabase error:", errorText);

      return Response.json(
        { error: "Smart Link kayıtları alınamadı." },
        { status: 500 }
      );
    }

    const data = await response.json();

    return Response.json(data);
  } catch (error) {
    console.error("Smart Links GET error:", error);

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
function generateCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}

export async function POST(request) {
  try {
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return Response.json(
        { error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const businessName = body.business_name?.trim();
    const productType = body.product_type?.trim();
    const targetUrl = body.target_url?.trim();

    if (!businessName || !productType || !targetUrl) {
      return Response.json(
        { error: "Tüm alanları doldurun." },
        { status: 400 }
      );
    }

    const allowedProductTypes = [
      "google",
      "instagram",
      "whatsapp",
      "ilan",
      "konum",
      "diger",
    ];

    if (!allowedProductTypes.includes(productType)) {
      return Response.json(
        { error: "Geçersiz ürün tipi." },
        { status: 400 }
      );
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return Response.json(
        { error: "Geçerli bir hedef bağlantı girin." },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return Response.json(
        { error: "Hedef bağlantı http veya https olmalıdır." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    for (let attempt = 0; attempt < 5; attempt++) {
      const code = generateCode();

      const response = await fetch(
        `${supabaseUrl}/rest/v1/smart_links`,
        {
          method: "POST",
          headers: {
            apikey: secretKey,
            Authorization: `Bearer ${secretKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
  business_name: businessName,
  product_type: productType,
  target_url: parsedUrl.toString(),
  status: "assigned",
  updated_at: new Date().toISOString(),
}),
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();

        return Response.json(data[0], { status: 201 });
      }

      const errorText = await response.text();

      // 23505 = PostgreSQL unique violation.
      // Çok düşük ihtimalle aynı kod üretilirse tekrar dener.
      if (errorText.includes("23505")) {
        continue;
      }

      console.error("Smart Link POST Supabase error:", errorText);

      return Response.json(
        { error: "Smart Link oluşturulamadı." },
        { status: 500 }
      );
    }

    return Response.json(
      { error: "Benzersiz Smart Link kodu oluşturulamadı." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Smart Link POST error:", error);

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
export async function PATCH(request) {
  try {
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return Response.json(
        { error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const code = body.code?.trim().toUpperCase();
    const businessName = body.business_name?.trim();
    const productType = body.product_type?.trim();
    const targetUrl = body.target_url?.trim();

    if (!code || !businessName || !productType || !targetUrl) {
      return Response.json(
        { error: "Tüm alanları doldurun." },
        { status: 400 }
      );
    }

    const allowedProductTypes = [
      "google",
      "instagram",
      "whatsapp",
      "ilan",
      "konum",
      "diger",
    ];

    if (!allowedProductTypes.includes(productType)) {
      return Response.json(
        { error: "Geçersiz ürün tipi." },
        { status: 400 }
      );
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(targetUrl);
    } catch {
      return Response.json(
        { error: "Geçerli bir hedef bağlantı girin." },
        { status: 400 }
      );
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return Response.json(
        { error: "Hedef bağlantı http veya https olmalıdır." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(code)}`,
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
  product_type: productType,
  target_url: parsedUrl.toString(),
  status: "assigned",
  updated_at: new Date().toISOString(),
}),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Smart Link PATCH Supabase error:", errorText);

      return Response.json(
        { error: "Smart Link güncellenemedi." },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return Response.json(
        { error: "Smart Link bulunamadı." },
        { status: 404 }
      );
    }

    return Response.json(data[0]);
  } catch (error) {
    console.error("Smart Link PATCH error:", error);

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
export async function PUT(request) {
  try {
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return Response.json(
        { error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const code = body.code?.trim().toUpperCase();
    const active = body.active;

    if (!code || typeof active !== "boolean") {
      return Response.json(
        { error: "Geçersiz istek." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(code)}`,
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
          updated_at: new Date().toISOString(),
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Smart Link status update error:", errorText);

      return Response.json(
        { error: "Smart Link durumu değiştirilemedi." },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return Response.json(
        { error: "Smart Link bulunamadı." },
        { status: 404 }
      );
    }

    return Response.json(data[0]);
  } catch (error) {
    console.error("Smart Link PUT error:", error);

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
export async function DELETE(request) {
  try {
    const isAdmin = await verifyAdmin(request);

    if (!isAdmin) {
      return Response.json(
        { error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const code = body.code?.trim().toUpperCase();

    if (!code) {
      return Response.json(
        { error: "Geçersiz istek." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const secretKey = process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
        code
      )}&status=eq.stock`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({
          status: "cancelled",
          active: false,
          updated_at: new Date().toISOString(),
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Smart Link cancel error:", errorText);

      return Response.json(
        { error: "Stok kartı iptal edilemedi." },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return Response.json(
        { error: "İptal edilebilir stok kartı bulunamadı." },
        { status: 404 }
      );
    }

    return Response.json(data[0]);
  } catch (error) {
    console.error("Smart Link DELETE error:", error);

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
