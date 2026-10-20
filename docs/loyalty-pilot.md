# DOKUNUVER Dijital Sadakat: ilk pilot

Bu modül ayrı bir üründür. Mevcut IBAN/Smart Link kayıtları kullanılmaz veya değiştirilmez.
İlk pilot DOKUNUVER uygulamasında `/sadakat` altında yaşar. İşletme sınırı veritabanındaki RLS ve yetkili RPC işlemleriyle uygulanır.

## Önizleme

- `/sadakat/demo`: örnek Pink Rose müşteri kartı, yerel damga talebi ve iletişim tercihi.
- `/sadakat/isletme/demo`: yerel kasa onayı, ödül oluşumu/kullanımı, müşteri grupları ve işlem listesi.
- `/sadakat/demo/yonetim`: DOKUNUVER işletme listesi, paket ve planlanan SMS limiti; örnek verilerle yerel düzenleme.
- Demo ekranları bağımsız örneklerdir; birbirine veri aktarmıyor, gerçek istek/kayıt/mesaj oluşturmuyor.
- Bu iki ekran SQL veya SMS servisi olmadan incelenebilir.

## Canlı pilotu açma

1. Değişikliği ve önizlemeyi inceleyin. Bu PR kendi başına veritabanında kurulum yapmaz.
2. Supabase SQL Editor'da önce `supabase/migrations/20261020_loyalty.sql`, ardından `supabase/migrations/20261020_loyalty_management.sql` ve `supabase/migrations/20261020_loyalty_platform.sql` dosyalarını sırayla birer kez çalıştırın. Her dosya transaction içindedir. İlk iki dosya uygulandıysa yalnız `20261020_loyalty_platform.sql` güncellemesini çalıştırın; uygulanmış migration'ı tekrar çalıştırmayın. Sıfırdan kurulum için `node scripts/export-loyalty-setup.mjs` komutu üç dosyayı tek transaction altında birleştirir.
3. Supabase Auth'ta Phone sağlayıcısını ve gerçek SMS sağlayıcısını yapılandırın. SMS doğrulaması zorunludur; canlı OTP'nin alınması ve süresinin dolması gerçek cihazla test edilmelidir. Sağlayıcı yoksa müşteri kaydı ilerlemez. OTP gönderim hız sınırı/CAPTCHA ayarları Supabase projesinde yönetilir; deneme numaralarını üretimde kullanmayın.
4. Mevcut DOKUNUVER yönetici hesabıyla `/panel/sadakat` sayfasından işletmeyi ve ilk kampanyayı oluşturun. Pilot sahibi bu işlemi yapan yöneticidir. Slug benzersizdir, kampanya hedefi 2–30 damgadır; varsayılan günlük sınır 1 damgadır.
5. İşletme sahibi `/sadakat/isletme` adresinden aynı Supabase e-posta hesabıyla giriş yapar. Sadakat oturumu mevcut yönetim paneli oturumundan ayrı saklanır.
6. Müşteri NFC/QR adresi `/sadakat/{slug}` olur. Etiket yalnız bu sayfayı açar; okuma kendi başına damga vermez.
7. Müşteri telefonunu SMS koduyla doğrular, adını yazar, isteğe bağlı WhatsApp iletişim tercihini belirler. İşaretlemeden sadakat kullanımı mümkündür.
8. Müşteri alışveriş için damga talep eder. Personel müşteri/alışveriş eşleşmesini kontrol edip 5 dakika içinde kasada onaylar. Hedef tamamlanınca ayrı ödül oluşur; damga sayacı yeni tura geçer. Ödülü yalnız owner rolü kullandırabilir.

### Personel yönetimi

İşletme sahibi `/sadakat/isletme` içindeki **Kampanya & personel** sekmesinde personelin adı ve doğrulanmış Auth hesabının e-posta adresiyle erişim açabilir. Mevcut personelin erişimini kapatıp yeniden açabilir. Bu işlem yeni hesap oluşturmaz, davet/e-posta göndermez veya şifre belirlemez. Yeni personel hesabının Supabase Auth'ta kurulması ayrı adımdır.

`staff` damga onaylayıp reddedebilir; `owner` ödül kullandırabilir ve ayarları değiştirebilir. İşletme sahibinin üyeliği bu formdan değiştirilemez. Erişimi kapatılan personelin sonraki istekleri veritabanında reddedilir. Aynı kullanıcı birden çok işletmeye üye olabilir; işletme seçici yalnız kendi üyeliklerini listeler. İlk pilotu yöneticiden farklı hesaba devretmeden önce owner üyeliği o mevcut hesaba ayrıca atanmalıdır.

### Kampanya yönetimi

Aynı sekmeden yeni kampanya açılır, adı/günlük sınırı/aktifliği düzenlenir. İlk damgadan sonra hedef ve ödül açıklaması veritabanında kilitlenir. Pasif kampanyalar yeni damga kabul etmez; önceden kazanılmış ödüller kullanılabilir. Eş zamanlı düzenlemeler revision kontrolüyle korunur. Yönetim işlemleri aktör, zaman ve değişiklik özetiyle kaydedilir.

## DOKUNUVER işletme, paket ve SMS limiti yönetimi

`/panel/sadakat` bölümünde platform yöneticisi tüm işletmeleri sayfalı listeleyebilir, ad/slug ile arayabilir, aktif/duraklatılmış durumuna göre filtreleyebilir. Paket adı (`pilot`, `standard`, `advanced`), planlanan aylık doğrulama SMS limiti (0–1.000.000) ve işletmenin aktifliğini değiştirir. Her kayıt revision kontrolü ve yönetim günlüğüyle korunur. Bu pakette fiyat/tahsilat veya otomatik abonelik yoktur.

Ayarlar yalnız mevcut `site_admins` yetkisine sahip DOKUNUVER yöneticisinin doğrulanmış API isteğiyle değişir. İşletme sahibi ve personel bu RPC'leri doğrudan çağıramaz. İşletme sahibi kendi paket kaydını okuyabilir; tabloya doğrudan yazamaz. Yönetim listesini ve ayar yazmasını servis rolüne açık RPC'ler yürütür; bunlar aktörün platform yöneticisi olduğunu ayrıca doğrular.

Yeni ve mevcut işletmelere varsayılan Pilot / 0 SMS konfigürasyonu atanır. **SMS sağlayıcısı bağlı değildir. Limit şu aşamada yalnız hazırlık konfigürasyonudur; gönderim, sayaç, kota rezervasyonu veya otomatik ücretlendirme uygulanmaz.** Arayüz gerçek kullanım varmış gibi sıfır göstermez; “bağlantı bekleniyor” yazar. Canlı SMS'i açmadan önce doğrulanmış gönderim köprüsü, merkezi/işletme bazlı tüketim kaydı, kötüye kullanım sınırları ve kota uygulaması tamamlanmalıdır. Kampanya mesajları ayrı tutulacaktır.

İşletmeyi duraklatmak açık müşteri sayfasını ve yeni personel/müşteri işlemlerini kapatır, mevcut kayıtları silmez. Yeniden aktif etmek önceki damga/ödül kayıtlarını korur. Kampanya pasifleştirmesi farklıdır: önceden kazanılmış ödüller kullanılabilir.

## İşlem ve izin kuralları

- Ham telefonla müşteri sorgulama yoktur; müşteri kendi doğrulanmış Auth kimliğiyle kendi kartını okur.
- Anonim sorgu sadece açık işletme adı, slug ve kampanya bilgilerini döndürür; telefon veya müşteri verisi içermez.
- İşletme verileri RLS ile sınırlıdır; tarayıcıdan doğrudan insert/update/delete yetkisi yoktur.
- Damga sadece `loyalty_action` üzerinden mevcut personel üyeliği doğrulanarak verilir. Yetki kontrolü arayüzü gizlemekle sınırlı değildir.
- Talep oluşturma müşteri satırını, damga onayı aynı müşteri/talep satırlarını kilitler. Aynı talep tekrar onaylandığında ikinci damga oluşmaz. Süre/günlük sınır sunucuda kontrol edilir. Gün sınırı Europe/Istanbul'dur.
- Ödül kullandırma satır kilidiyle atomiktir. Tekrar kullanma aynı sonucu döndürür; ikinci bir teslim kaydı oluşmaz.
- İletişim tercihi: kanal WhatsApp, metin `whatsapp-v1`, tam metin, karar, kullanıcı ve tarih olay kaydı olarak saklanır. Tekrar kayıt işlemi önceden geri alınmış izni yeniden açmaz. Tercih değiştirme kendi müşteri kimliğiyle sınırlıdır.
- Bu kayıt bir gönderim entegrasyonu veya İYS kaydı değildir. Bu sürümde WhatsApp/SMS kampanya gönderimi yoktur. Gönderim/izin eşleştirmeleri iletişim modülü devreye alınırken ayrıca tamamlanmalıdır.
- Ziyaret bilgisi, onaylanan damga zamanıdır; POS fişi, ödeme veya kendiliğinden konum tespiti değildir.

## Bu sürümün kapsamı ve sıradaki işler

Çalışan çekirdek: işletme/üyelik, çoklu kampanya yönetimi, mevcut doğrulanmış personel hesabını yetkilendirme/erişim kapatma, doğrulanmış müşteri kaydı, tercih geçmişi, damga talep/onay/ret, ödül oluşturma/kullanma, sunucu tarafında tüm müşterilerde arama/segmentasyon/sayfalama, toplam istatistikler ve mobil ekranlar.

Pilot sınırları:

- Müşteri listesi sayfa başına 25 kayıt gösterir; arama, gruplar ve toplamlar işletmenin tüm verileri üzerinde hesaplanır. Kasa ilk 100 bekleyen talebi/hazır ödülü, geçmiş son 100 işlemi gösterir. Yönetim geçmişi son 50 işlemdir. Yoğun kasalar için kuyruk/geçmiş sayfalaması sıradadır.
- İşletme/personel hesabı daveti, otomatik abonelik/faturalama, WhatsApp gönderimi, Excel aktarımı, damga iptali/telafi işlemi, veri silme/retention akışı sonraki geliştirme dilimleridir.
- Damga/ödül kayıtlarında kullanıcı UUID'si saklanır; işlem listesinde mevcut personel adı gösterilir. Kampanya/personel değişikliklerinin ayrı yönetim günlüğü vardır.
- Müşteri bilgilendirme/aydınlatma bağlantıları, gerçek işletmenin veri işleme metinleri ve iletişim altyapısı canlı müşteri kullanımından önce tamamlanmalıdır.

## Kontroller

`node --test tests/*.test.mjs`

PostgreSQL uyumlu gerçek SQL/RLS testi (PGlite test bağımlılığı çalışma alanında ayrı kurulur):

`PGLITE_MODULE=/absolute/path/to/@electric-sql/pglite/dist/index.js node tests/loyalty-sql.mjs`

Build sonrası Chromium arayüz testi:

`PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs CHROMIUM_BIN=/absolute/path/to/chromium node tests/loyalty-browser.mjs`

SQL testi işletme izolasyonu, anonim engeli, doğrudan tablo yazma engeli, telefon doğrulaması, izin geçmişi/geri alma, personel/sahip ayrımı, tekrar onay, ödül devri, süre/gün sınırı, iptal edilen personel erişimi, kampanya şartları/revision kilidi, sahip koruması, 131 müşteriyle tam sayfalama/arama/segmentasyon ve istatistikleri; platform yöneticisi yetkisi, varsayılan paketler, kota doğrulaması, revision çakışması ve kayıtları koruyarak işletme duraklatma/yeniden açmayı doğrular. Canlı Supabase SMS, gerçek NFC cihazı ve SMS sağlayıcısı testi ayrıca yapılmalıdır.
