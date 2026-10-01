# DOKUNUVER site yönetimi kurulumu

## 1. Supabase tabloları ve görsel deposu

Supabase → SQL Editor → New query bölümünde `supabase/migrations/20261001_site_management.sql` dosyasının tamamını çalıştırın. Mevcut IBAN ve Smart Links tablolarına değişiklik yapılmaz.

## 2. Panel yöneticisine site yönetimi yetkisi

Aşağıdaki sorguda `PANEL_GIRIS_EPOSTANIZ` alanını mevcut panel hesabınızın e-posta adresiyle değiştirip çalıştırın:

```sql
insert into public.site_admins (user_id)
select id from auth.users where lower(email) = lower('PANEL_GIRIS_EPOSTANIZ')
on conflict (user_id) do nothing;
```

`INSERT 0 1` veya daha önce tanımlıysa `INSERT 0 0` beklenir. Kullanıcının gerçekten tanımlandığını şu sorguyla doğrulayın:

```sql
select u.email from public.site_admins a
join auth.users u on u.id = a.user_id;
```

## 3. Mevcut ortam değişkenleri

Mevcut `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ve sunucuda tutulan `SUPABASE_SECRET_KEY` kullanılır. Secret key hiçbir istemci bileşenine gönderilmez. Yeni paket veya yeni ortam değişkeni gerekmez.

## 4. Yayınlama ve kullanım

SQL kurulumu tamamlandıktan sonra geliştirme dalındaki değişiklikleri ana dala alın. Vercel deploy'u tamamlanınca `/panel` → **Site Yönetimi** bölümünü açın.

- Ürünler ve Fiyatlar: beş kartın fiyatı, başlığı, açıklaması, gerçek ürün görseli; toplu fiyat uygulama.
- Kampanyalar: ürün bazında kampanya fiyatı ve etiketi, Türkiye saatinde başlangıç/bitiş; site geneli duyuru ve duyuru görseli.
- Genel Ayarlar: stand ek ücreti, kargo açıklaması, ana sayfa NFC görseli.
- **Kaydet ve Yayınla**: bütün değişiklikleri birlikte yayınlar. Siteyi yenileyince güncel içerik gelir; yeniden deploy gerekmez.
- **Değişiklikleri Geri Al**: yayınlanmamış form değişikliklerini son kayda döndürür.

Görseller PNG/JPEG/WebP ve en fazla 3 MB olmalıdır. Yüklenen görsel, Kaydet ve Yayınla yapılana kadar sitede kullanılmaz. Eski görseller silinmez. Baskı şablonları bu panelin kapsamına girmez; sitedeki ürün görselleri değiştiğinde üretim şablonları değişmez.

Kampanya bitiş saati geldiğinde sonraki sayfa isteği normal fiyatı gösterir. Önceden açık bir sayfa yenilenmelidir. Tarihler boşsa kampanya etkinleştirildiği andan kapatılana kadar sürer. Kampanya fiyatı normal fiyattan düşük olmalıdır.

İki oturum aynı ayarları düzenlerse eski sürümün yeni kaydı ezmesine izin verilmez; ikinci oturumdaki kullanıcı bilgilendirilir.

Kurulum eksik veya ayarlar okunamıyorsa herkese açık sayfalar standart 250 TL / 50 TL içeriği gösterir. Yönetim paneli hatayı açıkça gösterir; kaydedilmiş gibi davranmaz.

## 5. Canlı kontrol

Önce küçük bir fiyat değişikliği yapıp ana sayfa, ürün detay sayfası ve iletişim sayfasında aynı bilgilerin göründüğünü kontrol edin; sonra fiyatı istediğiniz tutara getirin. Bir görsel yükleyip kaydedin. Yakın bir bitiş saatli kampanyayı ve yönetici olmayan hesabın erişememesini doğrulayın.

## Yapılan kontroller

- `npm run build`: Next.js 15.5.24 üretim derlemesi başarılı.
- `node --test tests/site-content.test.mjs`: beş test başarılı; kampanya saat sınırları, fiyat/tarih doğrulama, ürün listesi ve görsel adresleri.
- Yerel Supabase taklidiyle HTTP kontrolleri: yönetici ve sıradan kullanıcı ayrımı, kaydetme, eşzamanlı kayıt çakışması, ana sayfa/ürün/iletişim fiyat tutarlılığı, aktif ve bitmiş kampanya, görsel tipi/boyutu, yükleme ve kurulum hataları.
- Canlı Supabase üzerinde SQL çalıştırılmadı. Masaüstü/mobil tarayıcı kontrolü, tarayıcı kurulumu bu ortamda tamamlanamadığı için henüz yapılmadı.
