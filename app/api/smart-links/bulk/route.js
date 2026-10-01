import { requirePanelAdmin as verifyAdmin } from "../../../../lib/admin-auth.mjs";
export const dynamic = "force-dynamic";



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
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return Response.json(
        { error: auth.error },
        { status: auth.status }
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

    // Bu toplu üretim için tek bir kalıcı parti kodu oluştur.
    const batchResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/next_smart_link_batch_code`,
      {
        method: "POST",
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        cache: "no-store",
      }
    );

    if (!batchResponse.ok) {
      const errorText = await batchResponse.text();

      console.error(
        "Smart Link batch code error:",
        errorText
      );

      return Response.json(
        { error: "Üretim parti kodu oluşturulamadı." },
        { status: 500 }
      );
    }

    const batchCode = await batchResponse.json();

    if (
      typeof batchCode !== "string" ||
      !batchCode.startsWith("SMART-")
    ) {
      console.error(
        "Geçersiz Smart Link parti kodu:",
        batchCode
      );

      return Response.json(
        { error: "Geçerli üretim parti kodu alınamadı." },
        { status: 500 }
      );
    }

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
  active: false,
  batch_code: batchCode,
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
            batch_code: batchCode,
            created_count: createdLinks.length,
          },
          { status: 500 }
        );
      }

      if (!created) {
        return Response.json(
          {
            error:
              "Benzersiz Smart Link kodu oluşturulamadı.",
            batch_code: batchCode,
            created_count: createdLinks.length,
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      {
        success: true,
        count: createdLinks.length,
        batch_code: batchCode,
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

