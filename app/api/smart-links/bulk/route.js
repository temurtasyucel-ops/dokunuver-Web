export const dynamic = "force-dynamic";

async function verifyAdmin(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

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

function generateCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
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

    const productType = body.product_type?.trim();
    const quantity = Number(body.quantity);

    const allowedProductTypes = [
      "google",
      "instagram",
      "whatsapp",
      "ilan",
      "diger",
    ];

    if (!allowedProductTypes.includes(productType)) {
      return Response.json(
        { error: "Geçersiz ürün tipi." },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 100
    ) {
      return Response.json(
        { error: "Adet 1 ile 100 arasında olmalıdır." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    const createdLinks = [];

    for (let i = 0; i < quantity; i++) {
      let created = false;

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
              code,
              product_type: productType,
              business_name: null,
              target_url: null,
              status: "stock",
              active: true,
            }),
            cache: "no-store",
          }
        );

        if (response.ok) {
          const data = await response.json();

          createdLinks.push(data[0]);
          created = true;
          break;
        }

        const errorText = await response.text();

        if (errorText.includes("23505")) {
          continue;
        }

        console.error(
          "Bulk Smart Link Supabase error:",
          errorText
        );

        return Response.json(
          {
            error: "Stok Smart Linkleri oluşturulamadı.",
          },
          { status: 500 }
        );
      }

      if (!created) {
        return Response.json(
          {
            error:
              "Benzersiz Smart Link kodu oluşturulamadı.",
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      {
        success: true,
        count: createdLinks.length,
        links: createdLinks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Bulk Smart Link POST error:", error);

    return Response.json(
      { error: "Sunucu hatası." },
      { status: 500 }
    );
  }
}
