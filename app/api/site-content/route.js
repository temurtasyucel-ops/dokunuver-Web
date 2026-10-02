import { requirePanelAdmin } from "../../../lib/admin-auth.mjs";
import { readSiteContent, serviceHeaders } from "../../../lib/site-content-server";
import { validateContent } from "../../../lib/site-content.mjs";

export const dynamic = "force-dynamic";
const reply = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function GET(request) {
  try {
    const auth = await requirePanelAdmin(request);
    if (!auth.ok) return reply({ error: auth.error }, auth.status);
    return reply({ ...await readSiteContent(), can_publish: process.env.VERCEL_ENV !== "preview" });
  } catch { return reply({ error: "Site yönetimi kurulumunu kontrol edin: tablo ve yönetici tanımı gereklidir." }, 503); }
}

export async function PUT(request) {
  try {
    const auth = await requirePanelAdmin(request);
    if (!auth.ok) return reply({ error: auth.error }, auth.status);
    if (process.env.VERCEL_ENV === "preview") return reply({ error: "Önizlemede yayınlama kapalıdır. Değişiklikleri canlı panelden yayınlayabilirsiniz." }, 403);
    let body, content;
    try {
      body = await request.json();
      if (!Number.isSafeInteger(body.revision) || body.revision < 1) throw new Error("Kayıt sürümü geçersiz.");
      content = validateContent(body.content, process.env.NEXT_PUBLIC_SUPABASE_URL);
    } catch (e) { return reply({ error: e.message || "Geçersiz veri." }, 400); }
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_content?id=eq.1&revision=eq.${body.revision}`, {
      method: "PATCH", headers: { ...serviceHeaders(), "x-panel-actor": auth.user.id, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ content, revision: body.revision + 1, updated_at: new Date().toISOString() }), cache: "no-store" });
    if (!response.ok) return reply({ error: "Değişiklikler kaydedilemedi." }, 500);
    const rows = await response.json();
    if (!rows.length) return reply({ error: "Ayarlar başka bir oturumda değiştirildi. Sayfayı yenileyip yeniden düzenleyin." }, 409);
    return reply(rows[0]);
  } catch { return reply({ error: "Site yönetimi sunucusuna ulaşılamadı." }, 503); }
}
