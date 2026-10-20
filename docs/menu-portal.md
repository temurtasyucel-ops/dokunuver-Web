# DOKUNUVER gelişmiş menü portalı

Sadakat ürününden bağımsız menü ürünü. Mevcut ana siteyle aynı Next.js/Supabase altyapısını kullanır. Bu dal sadakat koduna veya tablolarına bağımlı değildir.

## Bağlantılar
- NFC/QR hedefi ve işletme giriş sayfası: `/m/<slug>`
- Müşterinin menüsü: `/m/<slug>/menu`
- İşletme hesabı: `/menu-panel`
- DOKUNUVER yöneticisi: `/panel/menu`
- Müşteri demosu: `/m/demo`; menü demosu: `/m/demo/menu`
- İşletme paneli demosu: `/menu-panel/demo`

İlk sayfada “Menüye git”, altında işletmenin Google ve Instagram bağlantıları bulunur. Boş bırakılan bağlantı görünmez. İşletme adı, logo, kapak, slogan, tanıtım, renk, adres, telefon ve saatler panelde düzenlenebilir.

## Kurulum
1. Supabase SQL Editor'da `supabase/migrations/20261020_menu_portal.sql` dosyasının tamamını tek seferde çalıştırın. Sadakat migration'larını yeniden çalıştırmayın. Temel mevcut `site_admins` ve Supabase Auth kullanılır. Tablo isimleri menüye özeldir.
2. Vercel'in mevcut `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` ayarları kullanılır; yeni gizli anahtar gerekmez.
3. Supabase Auth'ta işletme sahibi için ayrı e-posta/parola hesabı oluşturun ve e-postasını doğrulayın. İşletmeye yönetici hesabınızı vermeyin. Bu sürüm e-posta daveti veya mesaj göndermez.
4. DOKUNUVER yöneticisi `/panel/menu` içinde işletme adı, benzersiz slug ve bu doğrulanmış e-postayla portal açar. Slug küçük harf/rakam/tire, 3–60 karakter; `demo` ve `menu` ayrılmıştır. Bu sürüm bağlantı adı sonradan değiştirilemez; NFC/QR hedefi sabit kalır.
5. İşletme sahibi `/menu-panel` üzerinden kendi hesabıyla giriş yapar. Önce kategorilerini, sonra ürünlerini ekler. Taslağı kaydeder; önizlemede kontrol edip “Menüyü yayınla”ya basar.
6. NFC ve QR'a `/m/<slug>` yazılır. Panel düzenlemeleri aynı hedef üzerinden yayınlanır; yeniden fiziksel kart basmak gerekmez.

## İşletme düzenlemeleri
En fazla 30 kategori ve 200 ürün. Kategori/ürün sıralaması oklarla değiştirilir. Kategori gizlenince içindeki ürünler de yayından çıkar. İçinde ürün bulunan kategori silinemez; önce ürünleri taşıyın veya kaldırın. Ürün adı, açıklama, TL fiyatı (kuruş hassasiyeti), görsel, alerjen, görünürlük, tükendi ve öne çıkan ayarlanabilir. Tükendi ürün menüde bu etiketle görünür. Sipariş/sepet/ödeme bu ürünün kapsamı değildir.

Taslak kaydı canlı menüyü değiştirmez. Yayınla mevcut formdaki değişiklikleri tek işlemde kaydedip yayınlar. Gizli kategori ve ürünler yayın dokümanından çıkarılır; genel API taslak/üye/e-posta verisi döndürmez. Eş zamanlı düzenleme eski sürümle kayıt yapamaz; panel hata gösterir, formu korur. Yayın için en az bir görünür kategoride bir görünür ürün gerekir.

## Görseller
PNG/JPEG/WebP, en fazla 3 MB. API oturum + işletme üyeliği kontrolü yapar, dosya imzasını kontrol eder ve rastgele adla `menu-media/<business-id>/` altına yükler. Başka işletmenin görsel URL'si kaydedilemez. SQL hosted Supabase'de `menu-media` public bucket'ını oluşturur; yükleme server secret ile yapılır. İstemcinin storage yazma yetkisi yoktur. Görseller menüde yayınlanacak ticari içerik olarak herkese açık URL alır; gizli dosya yüklemeyin. Kaldırılan/eski görseller otomatik silinmez; başka yayın veya taslağın kullandığı dosyayı yanlışlıkla silmeyi önlemek için temizlik ayrı bakım işlemidir.

## Erişim
İşletme Auth oturumu `menu_` önekli ayrı depoda tutulur; DOKUNUVER yönetici ve sadakat oturumundan ayrıdır. Yönetim ve kayıt RPC'leri yalnız service_role tarafından çağrılır; doğrulanmış actor sunucuda belirlenir ve SQL'de işletme üyeliği/merkez yönetici rolü tekrar kontrol edilir. İstemcinin doğrudan tablo okuma/yazma yetkisi yoktur. DOKUNUVER işletmeyi duraklatabilir; public sayfa kapanır ve işletme kayıt/yükleme işlemleri durur; menü ve ürünler korunur. Yeniden açılınca son yayın görünür.

## Demo ve doğrulama
Demo işletme hayalidir. Görsel yükleme kapalıdır; dosya olmayan yerlerde açıkça görsel alanı gösterilir. Panel demo taslağı ve yayını yalnız bu tarayıcının localStorage'ında saklanır. Taslağı kaydetmek müşteri demosunu değiştirmez; yayınla değiştirir. Demo gerçek hesap/SQL/depolama/SMS işlemi yapmaz. “Demo verilerini sıfırla” örnek içeriği geri getirir.

`node --test tests/menu.test.mjs` doğrulama, para, URL, görsel tenant bağı ve API actor bağlamasını test eder. `PGLITE_MODULE=... node tests/menu-sql.mjs` gerçek PostgreSQL uyumlu motorda yetki, tenant, yayın ve sürüm kontrollerini çalıştırır. `PLAYWRIGHT_MODULE=... CHROMIUM_BIN=... node tests/menu-browser.mjs` derleme sonrası 320/390/768/1440 görünümleri ve demo düzenleme/yayın akışlarını test eder. Gerçek Supabase Auth ve görsel yükleme bağlantısı, SQL kurulup işletme hesabı atandıktan sonra ayrıca doğrulanmalıdır.
