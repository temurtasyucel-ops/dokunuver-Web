# Sipariş kartları, ödeme, malzeme stoku ve PDF

## Yayın sırası

Önce mevcut `20261001_panel_operations.sql` kurulumu bulunmalıdır.
Ardından Supabase > SQL Editor > New query içine
`supabase/migrations/20261002_panel_business.sql` dosyasının tamamını yapıştırıp Run'a basın.
Beklenen sonuç `Success. No rows returned`. SQL tekrar çalıştırılabilir.
Yeni ortam değişkeni veya ücretli hizmet gerekmiyor.
Mevcut kart/müşteri verileri silinmez. Önce SQL, sonra uygulama yayını.

## Kart eşleştirme

Siparişler > Kartları Eşleştir ekranında sipariş ürününü seçip uygun kodu bağlayın.
Her kod (IBAN veya Smart Link) aynı anda tek siparişe bağlı olabilir.
Ürün türü ve sipariş adedi veritabanında doğrulanır. Başka siparişe bağlı veya
iptal kartlar aday listesinde gösterilmez. Stok ve atanmış kartlar kullanılabilir.
Eşleştirme müşteri adı, IBAN, hedef URL, aktiflik veya kilidi değiştirmez.
Stok kartının müşteri atamasını Müşteri / Hedef Bilgileri bağlantısından ayrıca tamamlayın.
Bağlı kartların ürün türü/kodu değiştirilemez veya kart silinemez.
Sipariş ürününü kaldırmadan/adedi azaltmadan önce fazla kartları ayırın.
Sipariş iptal edildiğinde bağlantılar korunur; yeniden kullanmak için açıkça kaldırın.
Şu an beş temel ürünün NFC türleri eşleştirilir. Yeni özel ürünlerin fiziksel
kart türü tanımı olmadığında ekran bunu belirtir.

## Ödeme takibi

Tahsil edilen toplam tutarı ve iç ödeme notunu elle kaydedin.
Durum tutardan hesaplanır: 0 = ödenmedi; toplamın altında = kapora/kısmi;
toplam = ödendi. Tahsilat sipariş toplamını aşamaz.
Sipariş tutarı azaltılırken tahsilatı da gerekiyorsa aynı formda düzeltin.
Bu bir muhasebe veya ödeme tahsilat entegrasyonu değildir; takiptir.
İptal siparişleri genel ödeme beklentisinden çıkarılır.
Ödeme filtresi ve URL'den filtreli giriş desteklenir.

## Stok

Malzemeyi oluşturun, ardından Stok Giriş / Çıkış ile ilk sayımınızı girin.
Kart, stand, NFC etiket, ambalaj ve diğer kategorileri; adet/paket/metre birimleri.
Miktar iki ondalık hane destekler. Her giriş/çıkış açıklama ve son bakiye ile kaydedilir.
Hareket veritabanında atomiktir; eksi stok oluşturulamaz.
Ağ hatası sonrası aynı formdan tekrar kaydetme aynı hareketi çoğaltmaz.
Hareketi değiştirmek veya düzeltmek için açıklamalı ters hareket ekleyin.
Geçmiş kayıtları silinmez. Takibi bırakılan malzemeler pasif yapılabilir.
Birim sonradan değiştirilemez. Kritik seviye aktif miktara eşit/üstündeyse uyarı çıkar.
Siparişler stokları otomatik düşürmez; malzeme reçeteleri henüz tanımlı değildir.
NFC kod kayıtlarındaki stok ile fiziksel malzeme sayımı ayrı tutulur.

## PDF ve özet

Siparişler > PDF Özeti İndir: kaydedilmiş müşteri, ürün/stand/adet, toplam,
tahsilat, kalan tutar ve takip bilgisini indirir. İç sipariş ve ödeme notlarını,
NFC kodlarını veya IBAN/hedef URL bilgilerini içermez. Müşteriye otomatik gönderilmez.
Türkçe font gömülüdür; çok sayfalı siparişler desteklenir. Desteklenmeyen font
karakterleri '?' olarak gösterilir. Belge fatura değildir.
Giriş sonrası İşletme Özeti açılır. Açık işler, kargodaki siparişler, kalan
ödemeler, kritik malzemeler ve siparişe ayrılmamış NFC stok kodları görünür.
Özet tüm veriler üzerinden sunucuda hesaplanır, ilk 100 kayıtla sınırlı değildir.
İş sırası ve kritik malzeme önizlemeleri 10 kayıtla sınırlıdır, toplamları ayrıca gösterilir.

## Önizleme ve güvenlik

Yeni yazma uçları preview'de kapalıdır. SQL rol/RLS kısıtları yalnızca sunucu
service_role ve doğrulanmış site_admins erişimine izin verir.
Sipariş sürümü eşleştirmede de artar; eski form yeni verinin üzerine yazamaz.
İşlem geçmişinde eşleştirme ve stok alan adları görünür; hassas not değerleri kaydedilmez.
Stok hareket açıklamaları admin ekranında ayrı hareket tablosunda bulunur.

## Doğrulama

`node --test tests/*.test.mjs` ve `npm run build`.
Migration testi: `PGLITE_MODULE=/absolute/path/to/pglite/dist/index.js node tests/business-sql.mjs`.
Tarayıcı: `PLAYWRIGHT_MODULE`, `CHROMIUM_MODULE`, `CHROMIUM_BIN` env'leri ile
`node tests/business-browser.mjs`; sahte servis kullanır, canlı veriye dokunmaz.
PGlite, Playwright ve Chromium sadece test ortamına gerekir; prod bağımlılığı değildir.

Geri dönüşte uygulama eski sürüme döndürülebilir; yeni tabloları/hareketleri silmeyin.
Eski sürüm bağlı ürünleri kaldırmaya çalışırsa DB koruması hata verebilir.
