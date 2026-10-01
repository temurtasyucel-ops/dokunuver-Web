import "server-only";
import { DEFAULT_CONTENT, validateContent } from "./site-content.mjs";

export function serviceHeaders() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key || !process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Site yönetimi sunucu ayarları eksik.");
  return { apikey: key, Authorization: `Bearer ${key}` };
}



export async function readSiteContent() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/site_content?id=eq.1&select=content,revision,updated_at`,
    { headers: serviceHeaders(), cache: "no-store" });
  if (!response.ok) throw new Error("Site ayarları okunamadı. Kurulum SQL'ini kontrol edin.");
  const row = (await response.json())[0];
  if (!row) throw new Error("Site ayarları kaydı bulunamadı.");
  return { ...row, content: validateContent(row.content, process.env.NEXT_PUBLIC_SUPABASE_URL) };
}

export async function getSiteContent() {
  try { return (await readSiteContent()).content; }
  catch { console.error("DOKUNUVER site ayarları okunamadı; standart içerik gösteriliyor."); return validateContent(structuredClone(DEFAULT_CONTENT), process.env.NEXT_PUBLIC_SUPABASE_URL); }
}
