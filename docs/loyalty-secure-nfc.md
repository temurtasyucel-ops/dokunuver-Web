# İki NFC ile kasiyer onaysız damga

## Akış
1. Standart NFC: `/sadakat/<isletme-slug>`; müşteri telefonunu doğrular ve üye olur.
2. Kasada personelin kontrolünde tutulan NTAG 424 DNA: `/sadakat/dokun?tag=<kayit-id>&e=<PICCENCData>&c=<SDMMAC>`.
3. Açık sadakat oturumu sunucuda doğrulanır. Sunucu kart imzasını doğrular; SQL tek işlemde sayaç, işletme, kampanya, üyelik, bekleme süresi ve günlük sınırı kontrol ederek damga ve gerekirse ödül ekler.
4. GET yalnız sayfayı açar; kayıt yazmaz. İstemci oturum varsa POST yapar. Aynı sayaç iki kez kullanılamaz. Kullanıcı/işletme/kampanya istemciden kabul edilmez.

Demo: `/sadakat/demo/dokun`. Örnek sayılarla yerel simülasyondur, gerçek API çağrısı veya kriptografik kart okuması değildir.

## Desteklenen kart profili
NXP NTAG 424 DNA, AES SDM, şifreli PICCData (C7: 7 bayt UID ve 3 bayt little-endian sayaç), SDMMACInputOffset == SDMMACOffset (boş mesaj CMAC). Başka profiller otomatik kabul edilmez. URL içinde `e` 32 hex ve `c` 16 hex karakterdir. Offsetler kartın gerçek NDEF baytlarına göre hesaplanmalı; HTTP/HTTPS URI kısaltma baytı dahil doğrulanmalıdır. Sabit QR veya NTAG213/215/216 ile otomatik damga verilmez.

Kaynak: https://www.nxp.com/docs/en/application-note/AN12196.pdf Rev 2.0, §3.3 ve §3.4.4.2.1. Testler NXP tablo 4 ve NIST CMAC referanslarıyla kontrol edilir.

## Kurulum ve devreye alma
- Önce önceki üç migration, ardından yalnız `20261020_loyalty_nfc.sql` uygulanır. Bu migration boş/kilitli kayıt tablolarını oluşturur; damga özelliğini açmaz. `dokun` işletme slug'ı artık ayrılmıştır.
- Kart başına farklı, rastgele AES-128 SDM meta ve file anahtarı kullanın; fabrika sıfır anahtarları uygulama tarafından reddedilir. Kart yönetim/yazma anahtarlarını da değiştirin; son kullanıcı NDEF/config yazamamalıdır.
- Güvenilir kurulum operatörü SQL yönetimi üzerinden `loyalty_nfc_tags` tablosuna rastgele 16–48 karakter id, işletme, kampanya, fiziksel UID (14 büyük hex), benzersiz key_ref ekler. `active=false` bırakılır. İstemci ve işletme personeli bu tabloyu okuyamaz veya yazamaz.
- Sunucuda `LOYALTY_NFC_KEYS_JSON` değeri şu yapıda güvenli ortam değişkenidir: `{ "key-ref": { "uid": "<UID>", "metaKey": "<32-hex>", "fileKey": "<32-hex>" } }`. Gerçek anahtarları sohbete, git'e, SQL'e veya istemciye koymayın. `NEXT_PUBLIC_` öneki kullanılmaz.
- Varsayılan `cooldown_seconds=3600`; 60–86400 arası. Günlük sınır kampanyanın İstanbul gününe göre sınırıdır ve diğer damga kanallarıyla ortaktır. Anahtar değişiminde aynı UID sayaç geçmişini sıfırlamayın; yenilenen fiziksel kart yeni UID/kayıt almalıdır.
- Fiziksel kartla test ortamında doğrulayın: iki farklı telefonda oturum, ilk üyelik, gerçek okuma, aynı URL tekrar, bozuk imza, kart kapatma, işletme/kampanya kapatma, günlük sınır, ödül eşiği, iPhone/Android arka plan NFC okuması. Gerçek donanım testi henüz yapılmadı.
- Doğrulama tamamlanınca kayıt `active=true` ve sunucu `LOYALTY_SECURE_NFC_ENABLED=true` yapılır, yeniden dağıtılır. Anahtar/özellik ayarı eksikse kapalı kalır. Acil durdurma: kartı pasifleştirin veya global bayrağı kapatın.
- SMS sağlayıcısı hâlâ ayrıca gereklidir; demo veya güvenli NFC bunu sağlamaz.

## Sınırlar
Kart imzası ödeme, GPS konumu veya canlı fiziksel yakınlık kanıtı değildir. Kullanılmış/daha eski sayaçlar engellenir; fakat henüz kullanılmamış bir okuma URL'si başka cihaza aktarılabilir veya daha sonra ilk kez kullanılabilir. Çipte güvenilir zaman damgası yoktur; bu sürüm okumaya mutlak yaş sınırı atfedemez. Daha yeni kabul edilen sayaç öncekileri geçersiz kılar. URL bir bearer kanıtıdır; başka müşteriye aktarılan kullanılmamış bir kanıtta ilk geçerli talep kazanabilir. Bu nedenle ikinci kart ödeme sonrası personel tarafından uzatılır, masada/halka açık tutulmaz. Kopyalanmış QR ile eşdeğer değildir.

UID kart başına iki anahtar ve SQL kampanya eşlemesiyle bağlanır; URL'deki tag değişimi başka kampanyaya taşıyamaz. Sayaç artışı ve damga atomiktir; başarısız işlem sayaç tüketmez. Uygulama URL'yi tarayıcı geçmişinden temizler, referrer göndermez, API no-store döner, kanıtı kalıcı tarayıcı deposuna yazmaz. İstemci yüklenmeden gelen URL altyapı erişim kayıtlarında görülebilir: devreye almada `e/c` query/body kaydını kapatın veya maskeleyin; üçüncü taraf analiz/izleme eklemeyin. Uç noktaya altyapı seviyesinde oran sınırı uygulayın.

Kasiyer düğmesi olmadan çalışır; ödeme doğrulaması gerekiyorsa POS entegrasyonu ayrı aşamadır. Ödül teslimi mevcut yetkili işletme akışında kalır; bu değişiklik otomatik ödül kullandırmaz. Eski personel onaylı damga talebi yedek kanalı mevcut kalır.
