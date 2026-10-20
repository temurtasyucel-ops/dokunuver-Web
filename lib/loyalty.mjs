export const CONSENT_TEXT = 'Bu işletmeden WhatsApp üzerinden kampanya ve duyuru mesajları almak istiyorum.';
export const CONSENT_VERSION = 'whatsapp-v1';
export function normalizePhone(value) {
 const digits=String(value||'').replace(/[\s()+-]/g,'');
 const national=digits.startsWith('90')?digits.slice(2):digits.startsWith('0')?digits.slice(1):digits;
 if(!/^5\d{9}$/.test(national)) throw new Error('Geçerli bir Türkiye cep telefonu numarası yazın.');
 return `+90${national}`;
}
export function segmentCustomers(customers,balances,rewards,segment,now=Date.now()) {
 return customers.filter(c=>{
  if(segment==='consented')return c.marketing_opt_in===true;
  if(segment==='inactive')return now-new Date(c.last_visit_at||c.created_at).getTime()>=30*86400000;
  if(segment==='reward')return rewards.some(r=>r.customer_id===c.id&&!r.redeemed_at);
  if(segment==='near')return balances.some(b=>b.customer_id===c.id&&b.target&&b.stamps===b.target-1);
  return true;
 });
}
const messages={AUTH_REQUIRED:'Lütfen giriş yapın.',PHONE_VERIFICATION_REQUIRED:'Telefon numaranızı SMS koduyla doğrulayın.',
 STAFF_REQUIRED:'Bu işletmede personel yetkiniz yok.',OWNER_REQUIRED:'Bu işlem için işletme sahibi yetkisi gerekir.',
 INVALID_CAMPAIGN:'Kampanya alanlarını kontrol edin.',CAMPAIGN_TERMS_LOCKED:'Bu kampanyada damga kazanılmış. Ödül ve hedef değiştirilemez.',
 REVISION_CONFLICT:'Kampanya başka bir oturumda değişti. Listeyi yenileyip tekrar düzenleyin.',
 INVALID_STAFF:'Personel adı ve e-posta adresini kontrol edin.',STAFF_ACCOUNT_REQUIRED:'Bu e-postayla doğrulanmış bir personel hesabı bulunamadı. Önce hesap kurulumu tamamlanmalı.',
 OWNER_MEMBERSHIP_PROTECTED:'İşletme sahibinin erişimi bu alandan değiştirilemez.',INVALID_PAGE:'Arama veya sayfa bilgisi geçersiz.',
 DAILY_LIMIT:'Bu müşteri kampanyanın günlük damga sınırına ulaştı.',REQUEST_EXPIRED:'Talebin süresi doldu. Müşteri yeni talep oluşturmalı.',
 REQUEST_UNAVAILABLE:'Talep işlenmiş veya bu işletmeye ait değil. Listeyi yenileyin.',CUSTOMER_REQUIRED:'Önce sadakat kaydınızı tamamlayın.',
 CAMPAIGN_UNAVAILABLE:'Kampanya kullanılamıyor.',BUSINESS_UNAVAILABLE:'İşletme şu anda kullanılamıyor.',REWARD_UNAVAILABLE:'Ödül bulunamadı.',INVALID_NAME:'Adınızı yazın.'};
export function loyaltyError(data) {
 const key=String(data?.message||'');
 if(messages[key])return messages[key];
 if(['42P01','PGRST202','PGRST205'].includes(data?.code))return 'Sadakat kurulumu henüz tamamlanmadı.';
 if(/sms_provider|sms.*disabled|phone.*disabled/i.test(key))return 'SMS doğrulama servisi henüz etkin değil. İşletmeyle iletişime geçin.';
 if(/expired|invalid.*token|otp.*invalid/i.test(key))return 'Kod geçersiz veya süresi dolmuş. Tekrar deneyin.';
 if(data?.code==='over_sms_send_rate_limit'||data?.code==='over_request_rate_limit')return 'Çok fazla deneme yapıldı. Biraz sonra tekrar deneyin.';
 return 'İşlem tamamlanamadı. Bağlantınızı kontrol edip tekrar deneyin.';
}
