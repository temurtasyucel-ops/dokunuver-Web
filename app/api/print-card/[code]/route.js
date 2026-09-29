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

const TEMPLATE_CONFIG = {
  google: {
    fileName: "google.png",
    qrLeft: 914,
    qrTop: 646,
    qrSize: 180,
    fileLabel: "GOOGLE",
  },

  instagram: {
    fileName: "instagram.png",
    qrLeft: 920,
    qrTop: 653,
    qrSize: 165,
    fileLabel: "INSTAGRAM",
  },

  whatsapp: {
    fileName: "whatsapp.png",
    qrLeft: 921,
    qrTop: 650,
    qrSize: 165,
    fileLabel: "WHATSAPP",
  },
};

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

    // Next.js 15
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

    // 2) Smart Link bilgisini al
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

    // 3) Ürün şablonunu seç
    const template =
      TEMPLATE_CONFIG[
        smartLink.product_type
      ];

    if (!template) {
      return Response.json(
        {
          error:
            "Bu ürün tipi için baskı şablonu henüz tanımlı değil.",
        },
        {
          status: 400,
        }
      );
    }

    // 4) QR'da kullanılacak sabit DOKUNUVER adresi
    const publicUrl =
      `https://dokunuver.com.tr/x/${code}`;

    const qrBuffer =
      await QRCode.toBuffer(
        publicUrl,
        {
          type: "png",
          width: template.qrSize,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        }
      );

    // 5) Ürün şablonunu yükle
    const templateUrl =
      new URL(
        `/templates/${template.fileName}`,
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
        "Print template not found:",
        templateUrl.toString()
      );

      return Response.json(
        {
          error:
            "Baskı şablonu bulunamadı.",
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

    // 6) Gerçek QR'ı tasarıma yerleştir
    const clearPadding =
  ["instagram", "whatsapp"].includes(
    smartLink.product_type
  )
    ? 4
    : 0;

const clearSize =
  template.qrSize +
  clearPadding * 2;

const clearBuffer =
  await sharp({
    create: {
      width: clearSize,
      height: clearSize,
      channels: 4,
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1,
      },
    },
  })
    .png()
    .toBuffer();

const printBuffer =
  await sharp(templateBuffer)
    .composite([
      {
        input: clearBuffer,
        left:
          template.qrLeft -
          clearPadding,
        top:
          template.qrTop -
          clearPadding,
      },
      {
        input: qrBuffer,
        left: template.qrLeft,
        top: template.qrTop,
      },
    ])
    .withMetadata({
      density: 300,
    })
    .png()
    .toBuffer();

    // 7) PNG indir
    return new Response(
      printBuffer,
      {
        status: 200,
        headers: {
          "Content-Type":
            "image/png",

          "Content-Disposition":
            `attachment; filename="DOKUNUVER-${template.fileLabel}-${code}.png"`,

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
