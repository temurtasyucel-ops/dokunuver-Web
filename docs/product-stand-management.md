# Ürün ve stand yönetimi

Site Yönetimi → Ürünler ve Fiyatlar bölümünde yeni ürün adı, açıklaması, fiyatı ve adres kodunu girip **Taslak Ürün Ekle** seçilir. Adres kodu benzersiz olmalıdır; küçük harf, rakam ve tire kullanılır (`menu-karti` gibi). Ürün adresi kaydedildikten sonra sabit kalır.

Taslak ürüne görsel yüklenir, uygun standlar seçilir ve **Ürünü satışa aç** işaretlenir. **Kaydet ve Yayınla** tüm değişiklikleri birlikte kaydeder. Görseli olmayan bir ürün satışa açılamaz. Yukarı/Aşağı düğmeleri koleksiyondaki sıralamayı değiştirir. Satış durumu kapatılan ürün koleksiyonda, önerilerde ve sitemap'te görünmez; doğrudan ürün adresi 404 döndürür. Kaydı panelde düzenlenmeye devam edebilir.

Stand Seçenekleri bölümünde örneğin `ahsap` koduyla **Ahşap stand** eklenebilir. Fiyat, kart fiyatına eklenecek tutardır. Stand önce kapalı eklenir. Adı, ek ücreti, isteğe bağlı görseli ve satış durumu düzenlenir. Ürünler bölümünde hangi kartlarda sunulacağı seçilir. Kapalı veya ürüne atanmayan stand müşteriye sunulmaz. Standsız kullanım her zaman ek ücretsizdir.

Müşteri ürün sayfasında standı seçer; toplam tutar kartın geçerli kampanya fiyatı ile standın ek ücretinden oluşur. WhatsApp mesajı ürün adını, stand tercihini ve kargo hariç tutarı içerir. Bu bir ödeme veya sipariş kayıt sistemi değildir.

## Uygulama ve dağıtım

- Mevcut `site_content.content` JSON kaydı kullanılır. Ek SQL, tablo, ortam değişkeni veya paket gerekmez.
- Eski kayıtlar okuma sırasında katalog sürüm 2'ye çevrilir; mevcut ürünler, sıralama, fiyatlar, kampanyalar ve `stand_price` korunur. Eski stand fiyatı `masaustu` seçeneğine aktarılır. Veritabanına yazma yalnızca kullanıcı Kaydet ve Yayınla seçtiğinde gerçekleşir.
- En fazla 100 ürün ve 20 stand vardır. `duo` adresi geliştirmedeki mevcut sayfa için ayrılmıştır.
- Yeni ürünün satış sayfası otomatik oluşur. Yeni NFC işlevi, müşteri kartı türü veya baskı şablonu otomatik oluşturulmaz.
- Vercel Preview, mevcut Production veritabanını kullanabildiği için site-content PUT çağrıları Preview ortamında 403 döndürür. Düzenleme inceleme için yapılabilir; yayınlama canlı panelde açılır. Bu koruma yeni JSON biçiminin eski canlı kodla birlikte yazılmasını önler.
- Yeni katalog kaydı kaydedildikten sonra eski, yalnızca beş ürünü kabul eden sürüme doğrudan geri dönülmemelidir; o sürüm katalog verisini reddeder. Geri alma gerekiyorsa yeni biçimi okuyabilen sürüm kullanılmalıdır.
- Ürün/stand kaldırmak için satış durumu kapatılır; panel fiziksel silme sunmaz. Mevcut IBAN ve Smart Links müşteri kartları değiştirilmez.

## Doğrulama

`node --test tests/*.test.mjs` eski katalog uyumluluğunu, taslak/satış durumunu, görsel zorunluluğunu, stand ücretlerini, ürün-stand eşleştirmesini ve geçersiz verilerin reddini kontrol eder. Ayrıca uygulama üretim derlemesi ve yerel taklit Supabase ile panelden kaydetme, sıralama, ürün sayfası, toplam tutar, WhatsApp mesajı, gizli ürün/sitemap, mobil genişlik ve Preview yazma koruması test edilir.
