import QRCode from "qrcode";
import sharp from "sharp";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function verifyAdmin(request) {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const authorization =
    request.headers.get("authorization");

  if (
    !supabaseUrl ||
    !publishableKey ||
    !authorization?.startsWith("Bearer ")
  ) {
    return false;
  }

  const accessToken =
    authorization.slice(7).trim();

  if (!accessToken) {
    return false;
  }

  try {
    const response = await fetch(
      `${supabaseUrl}/auth/v1/user`,
      {
        method: "GET",
        headers: {
          apikey: publishableKey,
          Authorization:
            `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );

    return response.ok;
  } catch (error) {
    console.error(
      "Print IBAN admin verification error:",
      error
    );

    return false;
  }
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

    // 2) IBAN kart kodunu al
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

    if (
      !supabaseUrl ||
      !secretKey
    ) {
      return Response.json(
        {
          error:
            "Sunucu yapılandırması eksik.",
        },
        {
          status: 500,
        }
      );
    }

    // 3) IBAN kartının gerçekten
    // sistemde olduğunu kontrol et
    const cardResponse =
      await fetch(
        `${supabaseUrl}/rest/v1/iban_cards?code=eq.${encodeURIComponent(
          code
        )}&select=code,status&limit=1`,
        {
          headers: {
            apikey: secretKey,
            Authorization:
              `Bearer ${secretKey}`,
          },
          cache: "no-store",
        }
      );

    if (!cardResponse.ok) {
      const errorText =
        await cardResponse.text();

      console.error(
        "Print IBAN card check error:",
        errorText
      );

      return Response.json(
        {
          error:
            "IBAN kart bilgisi alınamadı.",
        },
        {
          status: 500,
        }
      );
    }

    const cards =
      await cardResponse.json();

    const card =
      cards?.[0];

    if (!card) {
      return Response.json(
        {
          error:
            "IBAN kartı bulunamadı.",
        },
        {
          status: 404,
        }
      );
    }

    // 4) Fiziksel karta yazılacak
    // sabit DOKUNUVER adresi
    const publicUrl =
      `https://dokunuver.com.tr/i/${code}`;

    // 5) Gerçek QR oluştur
    const qrBuffer =
      await QRCode.toBuffer(
        publicUrl,
        {
          type: "png",
          width: 164,
          margin: 0,
          errorCorrectionLevel: "H",
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
        }
      );

    // 6) IBAN baskı şablonunu yükle
    const templateUrl =
      new URL(
        "/templates/iban.png",
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
        "IBAN template not found:",
        templateUrl.toString()
      );

      return Response.json(
        {
          error:
            "IBAN baskı şablonu bulunamadı.",
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

    // 7) Eski QR alanını temizle
    const clearPadding = 4;

    const clearSize =
      164 +
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

    // 8) Gerçek QR'ı şablona yerleştir
    const printBuffer =
      await sharp(templateBuffer)
        .composite([
          {
            input: clearBuffer,
            left: 917,
            top: 648,
          },
          {
            input: qrBuffer,
            left: 921,
            top: 652,
          },
        ])
        .withMetadata({
          density: 300,
        })
        .png()
        .toBuffer();

    // 9) PNG olarak indir
    return new Response(
      printBuffer,
      {
        status: 200,
        headers: {
          "Content-Type":
            "image/png",

          "Content-Disposition":
            `attachment; filename="DOKUNUVER-IBAN-${code}.png"`,

          "Cache-Control":
            "no-store",

          "X-Content-Type-Options":
            "nosniff",
        },
      }
    );
  } catch (error) {
    console.error(
      "Print IBAN GET error:",
      error
    );

    return Response.json(
      {
        error:
          "IBAN baskı görseli oluşturulurken sunucu hatası oluştu.",
      },
      {
        status: 500,
      }
    );
  }
}
