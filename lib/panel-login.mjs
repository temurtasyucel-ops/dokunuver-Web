export async function loginToPanel({ url, key, email, password, fetchImpl = fetch }) {
  let base;
  try {
    base = new URL(url);
    if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password) throw new Error();
  } catch {
    throw new Error('Panel bağlantı ayarları eksik veya geçersiz. Vercel ortamındaki NEXT_PUBLIC_SUPABASE_URL ayarını kontrol edin ve yeniden dağıtın.');
  }
  if (typeof key !== 'string' || !key.trim()) {
    throw new Error('Panel bağlantı anahtarı eksik. Vercel ortamındaki NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ayarını kontrol edin ve yeniden dağıtın.');
  }
  let response;
  try {
    response = await fetchImpl(`${base.href.replace(/\/$/, '')}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password }),
    });
  } catch {
    throw new Error('Giriş servisine ulaşılamadı. Bağlantınızı kontrol edip tekrar deneyin.');
  }
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error('Giriş servisi geçersiz yanıt verdi. Panel bağlantı adresini ve dağıtım ayarlarını kontrol edin.');
  }
  if (!response.ok) {
    if (data?.error_code === 'invalid_credentials') throw new Error('E-posta veya şifre hatalı.');
    if (data?.error_code === 'email_not_confirmed') throw new Error('Giriş yapmadan önce e-posta adresinizi doğrulayın.');
    if (response.status === 429) throw new Error('Çok fazla giriş denemesi yapıldı. Biraz bekleyip tekrar deneyin.');
    throw new Error('Giriş servisi isteği kabul etmedi. Panel bağlantı ayarlarını kontrol edin veya daha sonra tekrar deneyin.');
  }
  if (typeof data?.access_token !== 'string' || !data.access_token || typeof data?.refresh_token !== 'string' || !data.refresh_token) {
    throw new Error('Giriş servisi geçerli bir oturum oluşturmadı. Tekrar deneyin.');
  }
  return data;
}
