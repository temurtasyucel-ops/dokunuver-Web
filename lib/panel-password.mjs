export function validatePasswordChange(body) {
  if (!body || typeof body.currentPassword !== 'string' || !body.currentPassword || body.currentPassword.length > 1024) return 'Mevcut şifrenizi girin.';
  if (typeof body.newPassword !== 'string' || body.newPassword.length < 16 || body.newPassword.length > 64 || new TextEncoder().encode(body.newPassword).length > 72) return 'Yeni şifre 16–64 karakter ve en fazla 72 bayt olmalıdır.';
  if (body.newPassword !== body.confirmPassword) return 'Yeni şifreler eşleşmiyor.';
  if (body.newPassword === body.currentPassword) return 'Yeni şifre mevcut şifreden farklı olmalıdır.';
  return '';
}

// Reauthenticate the verified account. No caller-supplied email or user ID is used.
export async function changePanelPassword({ user, body, url, key, fetchImpl = fetch }) {
  const invalid = validatePasswordChange(body);
  if (invalid) return { status: 400, error: invalid };
  if (!user?.id || !user.email || !url || !key) return { status: 503, error: 'Şifre servisi şu anda kullanılamıyor.' };
  const base = url.trim().replace(/\/+$/, '');
  let session;
  let changed = false;
  let sessionsClosed = false;
  let result;
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  try {
    const login = await fetchImpl(`${base}/auth/v1/token?grant_type=password`, { method: 'POST', headers, cache: 'no-store', body: JSON.stringify({ email: user.email, password: body.currentPassword }) });
    if (!login.ok) return login.status === 429 ? { status: 429, error: 'Çok fazla deneme yapıldı. Biraz bekleyip tekrar deneyin.' } : login.status >= 500 ? { status: 503, error: 'Şifre servisine ulaşılamadı. Tekrar deneyin.' } : { status: 400, error: 'Mevcut şifre doğrulanamadı.' };
    session = await login.json();
    if (!session?.access_token || session.user?.id !== user.id) return { status: 503, error: 'Hesap doğrulanamadı. Şifre değiştirilmedi.' };
    const response = await fetchImpl(`${base}/auth/v1/user`, { method: 'PUT', headers: { ...headers, Authorization: `Bearer ${session.access_token}` }, cache: 'no-store', body: JSON.stringify({ password: body.newPassword }) });
    if (response.ok) { changed = true; result = { status: 200, ok: true }; }
    else {
      const data = await response.json().catch(() => ({}));
      const message = data.code === 'same_password' || data.error_code === 'same_password' ? 'Yeni şifre mevcut şifreden farklı olmalıdır.' : data.code === 'weak_password' || data.error_code === 'weak_password' ? 'Yeni şifre güvenlik koşullarını karşılamıyor. Daha güçlü bir şifre seçin.' : 'Şifre güncellenemedi. Tekrar deneyin.';
      result = { status: response.status === 429 ? 429 : response.status >= 500 ? 503 : 400, error: message };
    }
  } catch { result = { status: 503, error: 'Şifre servisine ulaşılamadı. İşlemin sonucunu yeni şifrenizle giriş yaparak kontrol edin.' }; }
  finally {
    if (session?.access_token) {
      try {
        const logout = await fetchImpl(`${base}/auth/v1/logout?scope=${changed ? 'global' : 'local'}`, { method: 'POST', headers: { apikey: key, Authorization: `Bearer ${session.access_token}` }, cache: 'no-store' });
        sessionsClosed = logout.ok;
      } catch { /* Password outcome is independent of session cleanup. */ }
    }
  }
  if (changed) result.sessionsClosed = sessionsClosed;
  return result;
}
