# Sipariş, toplu işlemler ve işlem geçmişi

## Kurulum

Supabase > SQL Editor > New query bölümünde
`supabase/migrations/20261001_panel_operations.sql` dosyasının tamamını çalıştırın.
Beklenen sonuç: `Success. No rows returned`. Yeni ortam değişkeni gerekmiyor.
Bu kurulum mevcut kartları silmez veya değişiklik öncesi geçmiş oluşturmaz.
SQL kurulumu önce, uygulama yayını sonra yapılmalıdır. SQL eski uygulamayla da uyumludur.

## Kullanım

- Sipariş ve üretim: WhatsApp'tan gelen siparişi elle kaydedin. Ürün, stand, adet,
  teslimat yöntemi ve siparişe eklenen kargo ücreti toplamı oluşturur.
  Bu özellik ödeme tahsil etmez, müşteriye mesaj göndermez ve WhatsApp'tan otomatik veri almaz.
  Fiyat ve başlıklar sipariş anındaki haliyle saklanır. Aynı ürün/stand satırının adedi
  değişince eski birim fiyat korunur. Farklı ürün/stand seçilince güncel fiyat alınır.
  Aynı anda yapılan düzenlemelerde eski sürümün üzerine yazılmaz.
- Toplu işlemler: kart türü, müşteri/kod, parti, üretim, aktiflik ve ürün filtreleri.
  Seçim sayfalar arasında korunur, tür değişince onayla temizlenir. En fazla 100 kart.
  ZIP yalnızca seçilen kartları içerir; hata/iptalde eksik arşiv indirilmez.
  Aktif/pasif işlemi atomiktir: bir kart uygun değilse hiçbir kart değişmez.
  Stok/iptal kartları aktifleştirilemez. Müşteri ve kilit alanlarına dokunulmaz.
- İşlem geçmişi: kurulumdan sonraki kart, sipariş ve site içeriği değişiklikleri.
  Değişen alan adları, sonuç durumu, zaman ve kullanıcı ID saklanır.
  IBAN, müşteri telefonu, notlar, hedef URL ve eski/yeni içerik değerleri saklanmaz.
  Eski uygulama veya SQL işlemleri kullanıcı ID'siz görünebilir.
- Oturum: süre dolmadan veya ilk 401 yanıtında bir kez yenilenir. Ağ/servis sorunu
  geçerli oturumu silmez. Geçersiz yenileme anahtarı yeniden giriş gerektirir.
  Çıkış, eşzamanlı yenilemenin oturumu geri açmasını engeller.

Önizlemede sipariş ve toplu aktif/pasif yazma kapalıdır; formlar ve okuma/baskı
test edilebilir. Veritabanı paylaşımı yüzünden önizleme testlerinde gerçek veri
değiştirilmemelidir. Yerel entegrasyon testleri sahte servis kullanır.

## Güvenlik

Yeni API'ler Supabase oturumu ve `site_admins` üyeliği ister.
Tablolar RLS ile anon/authenticated rollerine kapalıdır, servis anahtarı yalnızca
sunucuda kullanılır. Toplu RPC sadece service_role için açılır.
`x-panel-actor` değeri istemciden alınmaz; sunucu doğrulanmış kullanıcı ID'sini ekler.
Geçmiş, güvenilir SQL yöneticisinin değişikliklerini engelleyen değiştirilemez bir
güvenlik denetim sistemi değildir; panel operasyon kaydıdır.

## Geri dönüş

Uygulama eski sürüme döndürülebilir. Sipariş/geçmiş tablolarını silmeyin;
SQL kurulumu mevcut kart akışlarıyla uyumludur. Geçmiş büyümesi için ileride
arşivleme politikası belirlenmelidir.
