import { randomUUID } from "node:crypto";
import { serviceHeaders, verifySiteAdmin } from "../../../lib/site-content-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request) {
  try {
    if (!await verifySiteAdmin(request)) return Response.json({ error: "Site yönetimi yetkiniz yok." }, { status: 403 });
    const contentLength = Number(request.headers.get("content-length"));
    if (contentLength > 3 * 1024 * 1024 + 16384) return Response.json({ error: "Görsel en fazla 3 MB olabilir." }, { status: 413 });
    const form = await request.formData(), file = form.get("file");
    if (!(file instanceof File) || !file.size) return Response.json({ error: "PNG, JPEG veya WebP görsel seçin." }, { status: 400 });
    if (file.size > 3 * 1024 * 1024) return Response.json({ error: "Görsel en fazla 3 MB olabilir." }, { status: 413 });
    const buffer = Buffer.from(await file.arrayBuffer());
    let type, ext;
    if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) { type = "image/png"; ext = "png"; }
    else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) { type = "image/jpeg"; ext = "jpg"; }
    else if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") { type = "image/webp"; ext = "webp"; }
    else return Response.json({ error: "PNG, JPEG veya WebP görsel yükleyin." }, { status: 400 });
    const path = `${randomUUID()}.${ext}`, base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const response = await fetch(`${base}/storage/v1/object/site-media/${path}`, { method: "POST",
      headers: { ...serviceHeaders(), "Content-Type": type, "Cache-Control": "max-age=31536000", "x-upsert": "false" }, body: buffer });
    if (!response.ok) return Response.json({ error: "Görsel yüklenemedi. site-media depolama kurulumunu kontrol edin." }, { status: 503 });
    return Response.json({ url: `${base}/storage/v1/object/public/site-media/${path}` }, { status: 201 });
  } catch { return Response.json({ error: "Görsel yüklenemedi." }, { status: 503 }); }
}
