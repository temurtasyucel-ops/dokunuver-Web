// Server-side only: shared authorization for every management endpoint.
export async function requirePanelAdmin(request) {
  const token = request.headers.get("authorization");
  if (!token?.startsWith("Bearer ") || !token.slice(7).trim()) {
    return { ok: false, status: 401, error: "Oturum bulunamadı. Lütfen giriş yapın." };
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !publishableKey || !secretKey) return unavailable();
  try {
    const response = await fetch(`${url}/auth/v1/user`, { headers: { apikey: publishableKey, Authorization: token }, cache: "no-store" });
    if (response.status === 401 || response.status === 403) {
      return { ok: false, status: 401, error: "Oturum geçersiz veya süresi dolmuş. Lütfen yeniden giriş yapın." };
    }
    if (!response.ok) return unavailable();
    const user = await response.json();
    if (!user?.id) return { ok: false, status: 401, error: "Oturum doğrulanamadı." };
    const admins = await fetch(`${url}/rest/v1/site_admins?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`, {
      headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` }, cache: "no-store" });
    if (!admins.ok) return unavailable();
    const rows = await admins.json();
    if (!Array.isArray(rows)) return unavailable();
    if (!rows.some(row => row.user_id === user.id)) return { ok: false, status: 403, error: "Bu hesabın yönetim paneli yetkisi yok." };
    return { ok: true, user };
  } catch { return unavailable(); }
}
function unavailable() {
  return { ok: false, status: 503, error: "Yönetici yetkisi şu anda doğrulanamıyor. Lütfen tekrar deneyin." };
}
