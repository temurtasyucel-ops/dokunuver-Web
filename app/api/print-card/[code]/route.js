import QRCode from "qrcode";
import sharp from "sharp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function verifyAdmin(request) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const authHeader =
    request.headers.get("authorization");

  if (
    !authHeader ||
    !authHeader.startsWith("Bearer ")
  ) {
    return false;
  }

  const token =
    authHeader.replace("Bearer ", "");

  const response = await fetch(
    `${supabaseUrl}/auth/v1/user`,
    {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  return response.ok;
}

export async function GET(
  request,
  { params }
) {
  try {
    // 1) Admin kontrolü
    const isAdmin =
      await verifyAdmin(request);

    if (!isAdmin) {
      return Response.json(
        {
          error: "Yetkisiz erişim.",
        },
        {
          status: 401,
        }
      );
    }

    // Next.js 15 dynamic params
    const resolvedParams =
      await params;

    const code =
      resolvedParams?.code
        ?.trim()
        .toUpperCase();

    if (!code) {
      return Response.json(
        {
          error: "Kart kodu bulunamadı.",
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

    // 2) Smart Link'i kontrol et
    const smartLinkResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/smart_links?code=eq.${encodeURIComponent(
          code
        )}&select=code,product_type,status&limit=1`,
        {
          headers: {
            apikey: secretKey,
            Authorization:
              `Bearer ${secretKey}`,
          },
          cache: "no-store",
        }
      );

    if (!smartLinkResponse.ok) {
      const errorText =
        await smartLinkResponse.text();

      console.error(
        "Print Card Smart Link error:",
        errorText
      );

      return Response.json(
        {
          error:
            "Smart Link bilgisi alınamadı.",
        },
        {
          status: 500,
        }
      );
    }

    const smartLinks =
      await smartLinkResponse.json();

    const smartLink =
      smartLinks?.[0];

    if (!smartLink) {
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

    if (
      smartLink.status === "cancelled"
    ) {
      return Response.json(
        {
          error:
            "İptal edilmiş kart için baskı oluşturulamaz.",
        },
        {
          status: 409,
        }
      );
    }

    // İlk sürüm sadece Google
    if (
      smartLink.product_type !==
      "google"
    ) {
      return Response.json(
        {
          error:
            "Bu baskı şablonu şu anda yalnızca Google kartları için kullanılabilir.",
        },
        {
          status: 400,
        }
      );
    }

    // 3) NFC ve QR'da kullanılacak sabit DOKUNUVER adresi
    const publicUrl =
      `https://dokunuver.com.tr/x/${code}`;

    // 4) Gerçek QR oluştur
    const qrBuffer =
      await QRCode.toBuffer(
        publicUrl,
        {
          type: "png",
          width: 180,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        }
      );

    // 5) Google ana şablonunu yükle
    const templateUrl =
      new URL(
        "/templates/google.png",
        request.url
      );

    const templateResponse =
      await fetch(
        templateUrl,
        {
          cache: "no-store",
        }
      );

    if (!templateResponse.ok) {
      console.error(
        "Google template not found:",
        templateUrl.toString()
      );

      return Response.json(
        {
          error:
            "Google baskı şablonu bulunamadı.",
        },
        {
          status: 500,
        }
      );
    }

    const templateArrayBuffer =
      await templateResponse.arrayBuffer();

    const templateBuffer =
      Buffer.from(
        templateArrayBuffer
      );

    // 6) QR'ı tasarımdaki mevcut QR alanına yerleştir
    //
    // Ana tasarım: 1181 × 1181 px
    // QR alanı: 180 × 180 px
    // Sol: 914 px
    // Üst: 646 px
    const printBuffer =
  await sharp(templateBuffer)
    .composite([
      {
        input: qrBuffer,
        left: 914,
        top: 646,
      },
    ])
    .withMetadata({
      density: 300,
    })
    .png()
    .toBuffer();

    // 7) Baskı dosyasını indir
    return new Response(
      printBuffer,
      {
        status: 200,
        headers: {
          "Content-Type":
            "image/png",

          "Content-Disposition":
            `attachment; filename="DOKUNUVER-GOOGLE-${code}.png"`,

          "Cache-Control":
            "no-store",

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    console.error(
      "Print Card GET error:",
      error
    );

    return Response.json(
      {
        error:
          "Baskı görseli oluşturulurken sunucu hatası oluştu.",
      },
      {
        status: 500,
      }
    );
  }
}
