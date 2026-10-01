import { requirePanelAdmin as verifyAdmin } from "../../../lib/admin-auth.mjs";
export const dynamic = "force-dynamic";




export async function GET(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return Response.json(
        {
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?select=id,code,product_type,business_name,target_url,status,active,batch_code,created_at&order=created_at.desc`,
      {
        headers: {
          apikey: secretKey,
          Authorization: `Bearer ${secretKey}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Smart Links Supabase error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Smart Link kayıtları alınamadı.",
        },
        {
          status: 500,
        }
      );
    }

    const data =
      await response.json();

    return Response.json(data);
  } catch (error) {
    console.error(
      "Smart Links GET error:",
      error
    );

    return Response.json(
      {
        error: "Sunucu hatası.",
      },
      {
        status: 500,
      }
    );
  }
}


function generateCode(length = 6) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (
    let i = 0;
    i < length;
    i++
  ) {
    code += chars.charAt(
      Math.floor(
        Math.random() * chars.length
      )
    );
  }

  return code;
}


export async function POST(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return Response.json(
        {
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    const body =
      await request.json();

    const businessName =
      body.business_name?.trim();

    const productType =
      body.product_type?.trim();

    const targetUrl =
      body.target_url?.trim();

    if (
      !businessName ||
      !productType ||
      !targetUrl
    ) {
      return Response.json(
        {
          error:
            "Tüm alanları doldurun.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedProductTypes = [
      "google",
      "instagram",
      "whatsapp",
      "ilan",
      "diger",
    ];

    if (
      !allowedProductTypes.includes(
        productType
      )
    ) {
      return Response.json(
        {
          error:
            "Geçersiz ürün tipi.",
        },
        {
          status: 400,
        }
      );
    }

    let parsedUrl;

    try {
      parsedUrl =
        new URL(targetUrl);
    } catch {
      return Response.json(
        {
          error:
            "Geçerli bir hedef bağlantı girin.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !["http:", "https:"].includes(
        parsedUrl.protocol
      )
    ) {
      return Response.json(
        {
          error:
            "Hedef bağlantı http veya https olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    for (
      let attempt = 0;
      attempt < 5;
      attempt++
    ) {
      const code =
        generateCode();

      const response = await fetch(
        `${supabaseUrl}/rest/v1/smart_links`,
        {
          method: "POST",
          headers: {
            apikey: secretKey,
            Authorization:
              `Bearer ${secretKey}`,
            "Content-Type":
              "application/json",
            Prefer:
              "return=representation",
          },
          body: JSON.stringify({
            business_name:
              businessName,
            product_type:
              productType,
            target_url:
              parsedUrl.toString(),
            status: "assigned",
            updated_at:
              new Date().toISOString(),
          }),
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data =
          await response.json();

        return Response.json(
          data[0],
          {
            status: 201,
          }
        );
      }

      const errorText =
        await response.text();

      if (
        errorText.includes("23505")
      ) {
        continue;
      }

      console.error(
        "Smart Link POST Supabase error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Smart Link oluşturulamadı.",
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        error:
          "Benzersiz Smart Link kodu oluşturulamadı.",
      },
      {
        status: 500,
      }
    );
  } catch (error) {
    console.error(
      "Smart Link POST error:",
      error
    );

    return Response.json(
      {
        error: "Sunucu hatası.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function PATCH(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return Response.json(
        {
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    const body =
      await request.json();

    const code =
      body.code
        ?.trim()
        .toUpperCase();

    const businessName =
      body.business_name?.trim();

    const productType =
      body.product_type?.trim();

    const targetUrl =
      body.target_url?.trim();

    if (
      !code ||
      !businessName ||
      !productType ||
      !targetUrl
    ) {
      return Response.json(
        {
          error:
            "Tüm alanları doldurun.",
        },
        {
          status: 400,
        }
      );
    }

    const allowedProductTypes = [
      "google",
      "instagram",
      "whatsapp",
      "ilan",
      "diger",
    ];

    if (
      !allowedProductTypes.includes(
        productType
      )
    ) {
      return Response.json(
        {
          error:
            "Geçersiz ürün tipi.",
        },
        {
          status: 400,
        }
      );
    }

    let parsedUrl;

    try {
      parsedUrl =
        new URL(targetUrl);
    } catch {
      return Response.json(
        {
          error:
            "Geçerli bir hedef bağlantı girin.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !["http:", "https:"].includes(
        parsedUrl.protocol
      )
    ) {
      return Response.json(
        {
          error:
            "Hedef bağlantı http veya https olmalıdır.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    // Mevcut kart durumunu kontrol et
    const checkResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
          code
        )}&select=code,status`,
        {
          headers: {
            apikey: secretKey,
            Authorization:
              `Bearer ${secretKey}`,
          },
          cache: "no-store",
        }
      );

    if (!checkResponse.ok) {
      const errorText =
        await checkResponse.text();

      console.error(
        "Smart Link PATCH status check error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Smart Link durumu kontrol edilemedi.",
        },
        {
          status: 500,
        }
      );
    }

    const existingLinks =
      await checkResponse.json();

    const existingLink =
      existingLinks?.[0];

    if (!existingLink) {
      return Response.json(
        {
          error:
            "Smart Link bulunamadı.",
        },
        {
          status: 404,
        }
      );
    }

    // İptal edilmiş kart yeniden atanamaz
    if (
      existingLink.status ===
      "cancelled"
    ) {
      return Response.json(
        {
          error:
            "İptal edilmiş Smart Link yeniden müşteriye atanamaz.",
        },
        {
          status: 409,
        }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
        code
      )}&status=neq.cancelled`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization:
            `Bearer ${secretKey}`,
          "Content-Type":
            "application/json",
          Prefer:
            "return=representation",
        },
        body: JSON.stringify({
          business_name:
            businessName,
          product_type:
            productType,
          target_url:
            parsedUrl.toString(),
          status: "assigned",
          updated_at:
            new Date().toISOString(),
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Smart Link PATCH Supabase error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Smart Link güncellenemedi.",
        },
        {
          status: 500,
        }
      );
    }

    const data =
      await response.json();

    if (
      !data ||
      data.length === 0
    ) {
      return Response.json(
        {
          error:
            "Smart Link artık düzenlenebilir durumda değil.",
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      data[0]
    );
  } catch (error) {
    console.error(
      "Smart Link PATCH error:",
      error
    );

    return Response.json(
      {
        error: "Sunucu hatası.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function PUT(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return Response.json(
        {
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    const body =
      await request.json();

    const code =
      body.code
        ?.trim()
        .toUpperCase();

    const active =
      body.active;

    if (
      !code ||
      typeof active !== "boolean"
    ) {
      return Response.json(
        {
          error:
            "Geçersiz istek.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    // Mevcut kart durumunu kontrol et
    const checkResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
          code
        )}&select=code,status,active`,
        {
          headers: {
            apikey: secretKey,
            Authorization:
              `Bearer ${secretKey}`,
          },
          cache: "no-store",
        }
      );

    if (!checkResponse.ok) {
      const errorText =
        await checkResponse.text();

      console.error(
        "Smart Link status check error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Smart Link durumu kontrol edilemedi.",
        },
        {
          status: 500,
        }
      );
    }

    const existingLinks =
      await checkResponse.json();

    const existingLink =
      existingLinks?.[0];

    if (!existingLink) {
      return Response.json(
        {
          error:
            "Smart Link bulunamadı.",
        },
        {
          status: 404,
        }
      );
    }

    // Yalnızca assigned kartlar
    // aktif/pasif yapılabilir
    if (
      existingLink.status !==
      "assigned"
    ) {
      return Response.json(
        {
          error:
            existingLink.status ===
            "stock"
              ? "Stok kartları müşteriye atanmadan aktifleştirilemez."
              : "İptal edilmiş Smart Linklerin durumu değiştirilemez.",
        },
        {
          status: 409,
        }
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
        code
      )}&status=eq.assigned`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization:
            `Bearer ${secretKey}`,
          "Content-Type":
            "application/json",
          Prefer:
            "return=representation",
        },
        body: JSON.stringify({
          active,
          updated_at:
            new Date().toISOString(),
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Smart Link status update error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Smart Link durumu değiştirilemedi.",
        },
        {
          status: 500,
        }
      );
    }

    const data =
      await response.json();

    if (
      !data ||
      data.length === 0
    ) {
      return Response.json(
        {
          error:
            "Smart Link artık aktif/pasif değiştirilebilir durumda değil.",
        },
        {
          status: 409,
        }
      );
    }

    return Response.json(
      data[0]
    );
  } catch (error) {
    console.error(
      "Smart Link PUT error:",
      error
    );

    return Response.json(
      {
        error: "Sunucu hatası.",
      },
      {
        status: 500,
      }
    );
  }
}


export async function DELETE(request) {
  try {
    const auth = await verifyAdmin(request);

    if (!auth.ok) {
      return Response.json(
        {
          error: auth.error,
        },
        {
          status: auth.status,
        }
      );
    }

    const body =
      await request.json();

    const code =
      body.code
        ?.trim()
        .toUpperCase();

    if (!code) {
      return Response.json(
        {
          error:
            "Geçersiz istek.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const secretKey =
      process.env.SUPABASE_SECRET_KEY;

    const response = await fetch(
      `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
        code
      )}&status=eq.stock`,
      {
        method: "PATCH",
        headers: {
          apikey: secretKey,
          Authorization:
            `Bearer ${secretKey}`,
          "Content-Type":
            "application/json",
          Prefer:
            "return=representation",
        },
        body: JSON.stringify({
          status: "cancelled",
          active: false,
          updated_at:
            new Date().toISOString(),
        }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "Smart Link cancel error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Stok kartı iptal edilemedi.",
        },
        {
          status: 500,
        }
      );
    }

    const data =
      await response.json();

    if (
      !data ||
      data.length === 0
    ) {
      return Response.json(
        {
          error:
            "İptal edilebilir stok kartı bulunamadı.",
        },
        {
          status: 404,
        }
      );
    }

    return Response.json(
      data[0]
    );
  } catch (error) {
    console.error(
      "Smart Link DELETE error:",
      error
    );

    return Response.json(
      {
        error: "Sunucu hatası.",
      },
      {
        status: 500,
      }
    );
  }
}

