import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import QRCode from "qrcode";
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const TEMPLATE_CONFIG = {
  google: {
    fileName: "google.png",
    qrLeft: 914,
    qrTop: 624,
    qrSize: 162,
  },
  instagram: {
    fileName: "instagram.png",
    qrLeft: 914,
    qrTop: 624,
    qrSize: 162,
  },
};

export async function GET(request, { params }) {
  try {
    const code = params?.code;

    if (!code) {
      return NextResponse.json(
        { error: "Kart kodu gerekli." },
        { status: 400 }
      );
    }

    const { data: link, error } = await supabase
      .from("smart_links")
      .select("code, active, product_type")
      .eq("code", code)
      .single();

    if (error || !link) {
      return NextResponse.json(
        { error: "Kart bulunamadı." },
        { status: 404 }
      );
    }

    if (!link.active) {
      return NextResponse.json(
        { error: "Kart aktif değil." },
        { status: 400 }
      );
    }

    const template = TEMPLATE_CONFIG[link.product_type];

    if (!template) {
      return NextResponse.json(
        { error: "Bu ürün tipi için baskı şablonu tanımlı değil." },
        { status: 400 }
      );
    }

    const printUrl = `https://dokunuver.com.tr/x/${link.code}`;

    const qrBuffer = await QRCode.toBuffer(printUrl, {
      errorCorrectionLevel: "H",
      margin: 0,
      width: template.qrSize,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      template.fileName
    );

    const templateBuffer = await fs.readFile(templatePath);

    const finalImageBuffer = await sharp(templateBuffer)
      .composite([
        {
          input: qrBuffer,
          left: template.qrLeft,
          top: template.qrTop,
        },
      ])
      .png()
      .toBuffer();

    return new NextResponse(finalImageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `attachment; filename="${link.product_type}-${link.code}.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("print-card route hatası:", err);

    return NextResponse.json(
      { error: "Görsel oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
