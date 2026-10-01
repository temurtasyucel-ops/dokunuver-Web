import "server-only";
import { DEFAULT_CONTENT, validateContent } from "./site-content.mjs";

export function serviceHeaders() {
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!key || !process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Site yönetimi sunucu ayarları eksik.");
  return { apikey: key, Authorization: `Bearer ${key}` };
}

export async function verifySiteAdmin(request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return false;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const userResponse = await fetch(`${url}/auth/v1/user`, { headers: {
    apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, Authorization: authorization }, cache: "no-store" });
  if (!userResponse.ok) return false;
  const user = await userResponse.json();
  if (!user.id) return false;
  const response = await fetch(`${url}/rest/v1/site_admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`,
    { headers: serviceHeaders(), cache: "no-store" });
  if (!response.ok) throw new Error("Site yöneticisi tanımı eksik. Kurulum SQL'ini kontrol edin.");
  return (await response.json()).length === 1;
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
  catch { console.error("DOKUNUVER site ayarları okunamadı; standart içerik gösteriliyor."); return structuredClone(DEFAULT_CONTENT); }
}
