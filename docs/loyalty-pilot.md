# DOKUNUVER Dijital Sadakat: ilk pilot

Bu modül ayrı bir üründür. Mevcut IBAN/Smart Link kayıtları kullanılmaz veya değiştirilmez.
İlk pilot DOKUNUVER uygulamasında `/sadakat` altında yaşar. İşletme sınırı veritabanındaki RLS ve yetkili RPC işlemleriyle uygulanır.

## Önizleme

- `/sadakat/demo`: örnek Pink Rose müşteri kartı, yerel damga talebi ve iletişim tercihi.
- `/sadakat/isletme/demo`: yerel kasa onayı, ödül oluşumu/kullanımı, müşteri grupları ve işlem listesi.
- Demo ekranları bağımsız örneklerdir; birbirine veri aktarmıyor, gerçek istek/kayıt/mesaj oluşturmuyor.
- Bu iki ekran SQL veya SMS servisi olmadan incelenebilir.

## Canlı pilotu açma

1. Değişikliği ve önizlemeyi inceleyin. Bu PR kendi başına veritabanında kurulum yapmaz.
2. Supabase SQL Editor'da `supabase/migrations/20261020_loyalty.sql` dosyasının tamamını bir kez çalıştırın. İşlem transaction içindedir; başarısızsa tüm değişiklikler geri alınır. Bu ilk kurulum migration'ını tekrar çalıştırmayın.
3. Supabase Auth'ta Phone sağlayıcısını ve gerçek SMS sağlayıcısını yapılandırın. SMS doğrulaması zorunludur; canlı OTP'nin alınması ve süresinin dolması gerçek cihazla test edilmelidir. Sağlayıcı yoksa müşteri kaydı ilerlemez. OTP gönderim hız sınırı/CAPTCHA ayarları Supabase projesinde yönetilir; deneme numaralarını üretimde kullanmayın.
4. Mevcut DOKUNUVER yönetici hesabıyla `/panel/sadakat` sayfasından işletmeyi ve ilk kampanyayı oluşturun. Pilot sahibi bu işlemi yapan yöneticidir. Slug benzersizdir, kampanya hedefi 2–30 damgadır; varsayılan günlük sınır 1 damgadır.
5. İşletme sahibi `/sadakat/isletme` adresinden aynı Supabase e-posta hesabıyla giriş yapar. Sadakat oturumu mevcut yönetim paneli oturumundan ayrı saklanır.
6. Müşteri NFC/QR adresi `/sadakat/{slug}` olur. Etiket yalnız bu sayfayı açar; okuma kendi başına damga vermez.
7. Müşteri telefonunu SMS koduyla doğrular, adını yazar, isteğe bağlı WhatsApp iletişim tercihini belirler. İşaretlemeden sadakat kullanımı mümkündür.
8. Müşteri alışveriş için damga talep eder. Personel müşteri/alışveriş eşleşmesini kontrol edip 5 dakika içinde kasada onaylar. Hedef tamamlanınca ayrı ödül oluşur; damga sayacı yeni tura geçer. Ödülü yalnız owner rolü kullandırabilir.

### Pilot personel atama

Supabase Auth'ta zaten bulunan personel hesabını kullanın. Yeni hesap daveti/gönderimi bu sürümde otomatik değildir. SQL Editor'da gerçek UUID'leri kullanarak üyelik eklenebilir:

```sql
insert into public.loyalty_members(business_id,user_id,role)
values ('BUSINESS_UUID', 'EXISTING_AUTH_USER_UUID', 'staff');
```

`staff` damga onaylayıp reddedebilir; `owner` bunlara ek olarak ödül kullandırabilir. Üyelikte `active=false` yapıldığında yeni işlemler ve işletme verisine erişim kesilir. Aynı Auth kullanıcısı birden fazla işletmeye üye olabilir; müşteri kayıtları işletme bazında ayrıdır. Gerçek bir işletmeyi yöneticiden farklı hesaba teslim etmeden önce owner üyeliği o mevcut hesaba ayrıca atanmalıdır.

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

Çalışan çekirdek: işletme/üyelik, ilk kampanya kurulumu, doğrulanmış müşteri kaydı, tercih geçmişi, damga talep/onay/ret, ödül oluşturma/kullanma, müşteri grupları, son işlem listeleri, mobil ekranlar.

Pilot sınırları:

- İşletme ekranı son 100 müşteriyi, 100 ödülü ve 100 damgayı yükler; etiketlerde bu sınır belirtilir. Gruplar yüklenen veriler üzerinde çalışır. Ürünleşmeden önce sunucu tarafı sayfalama/arama, tam liste segmentasyonu ve istatistik RPC'leri eklenecek.
- İlk kampanya oluşturulur; panelden kampanya düzenleme, sezonluk aktif/pasif, günlük sınır düzenleme ve çoklu kampanya oluşturma ekranları sıradadır. Hedef/ödül bu pilot arayüzünden değiştirilmez.
- İşletme daveti, personel yönetimi, abonelik/paket/faturalama, WhatsApp gönderimi, Excel aktarımı, damga iptali/telafi işlemi, veri silme/retention akışı sonraki geliştirme dilimleridir.
- Damga ve ödül işlemlerinde kullanıcı UUID'si kaydedilir. Personel adlarının çözülmesi ve kapsamlı olay ekranı sonraki aşamadır.
- Müşteri bilgilendirme/aydınlatma bağlantıları, gerçek işletmenin veri işleme metinleri ve iletişim altyapısı canlı müşteri kullanımından önce tamamlanmalıdır.

## Kontroller

`node --test tests/*.test.mjs`

PostgreSQL uyumlu gerçek SQL/RLS testi (PGlite test bağımlılığı çalışma alanında ayrı kurulur):

`PGLITE_MODULE=/absolute/path/to/@electric-sql/pglite/dist/index.js node tests/loyalty-sql.mjs`

Build sonrası Chromium arayüz testi:

`PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs CHROMIUM_BIN=/absolute/path/to/chromium node tests/loyalty-browser.mjs`

SQL testi işletme izolasyonu, anonim engeli, doğrudan tablo yazma engeli, telefon doğrulaması, izin geçmişi/geri alma, personel/sahip ayrımı, tekrar onay, ödül devri, süre/gün sınırı ve iptal edilen personel erişimini doğrular. Canlı Supabase SMS, gerçek NFC cihazı ve SMS sağlayıcısı testi ayrıca yapılmalıdır.
