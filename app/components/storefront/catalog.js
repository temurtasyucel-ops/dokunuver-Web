export const PRODUCT_STORIES = {
  "google-yorum": { label: "GOOGLE YORUM", accent: "#2563eb", category: "Müşteri deneyimleri", headline: "Deneyimleri paylaşmak,\nartık daha kolay.",
    benefit: "Yorum sayfanıza giden en kısa yol.", audience: "Kafeler, restoranlar, mağazalar ve hizmet işletmeleri için.",
    benefits: ["Google yorum sayfanıza doğrudan erişim", "İşletmenize özel bağlantı", "Kartı değiştirmeden bağlantı güncelleme"],
    note: "Kart, müşterilerinizi Google yorum sayfanıza yönlendirir. Belirli bir puan veya olumlu yorum talep etmez; müşteriler kendi deneyimlerini özgürce paylaşır." },
  instagram: { label: "INSTAGRAM", accent: "#bb3b86", category: "Sosyal medya", headline: "Gerçek karşılaşmalar.\nYeni bağlantılar.",
    benefit: "Profiliniz, tek dokunuş uzakta.", audience: "Butikler, güzellik salonları, içerik üreticileri ve markalar için.",
    benefits: ["Instagram profilinize kolay erişim", "Kullanıcı adı aramaya gerek kalmaz", "Profil değişirse bağlantı güncellenebilir"] },
  whatsapp: { label: "WHATSAPP", accent: "#16834f", category: "Doğrudan iletişim", headline: "Bir dokunuşla\nsohbete başlayın.",
    benefit: "İletişim kurmanın pratik yolu.", audience: "Sipariş, randevu veya bilgi taleplerini WhatsApp üzerinden alan işletmeler için.",
    benefits: ["Numara kaydetmeden WhatsApp'a erişim", "İşletmenizin iletişim bağlantısı", "Numara değişirse hedef güncellenebilir"] },
  iban: { label: "IBAN", accent: "#5338bb", category: "Hesap bilgileri", headline: "IBAN paylaşmanın\nsade yolu.",
    benefit: "Hesap bilgileriniz düzenli ve erişilebilir.", audience: "Hesap bilgilerini müşterileriyle kolayca paylaşmak isteyen işletmeler ve bireyler için.",
    benefits: ["Banka, hesap sahibi ve IBAN tek ekranda", "Hesap sahibi ve IBAN kolayca kopyalanabilir", "Doğrulama sonrasında finansal bilgiler kilitlenir"],
    note: "IBAN Kartı para transferi yapmaz; hesap bilgilerinizi gösterir. Finansal bilgiler doğrulandıktan sonra kilitlenir. Kartın aktif veya pasif durumu bu kilitten bağımsızdır." },
  ilan: { label: "İLAN", accent: "#ad7520", category: "İlan bağlantıları", headline: "İlanınızın tüm detayları,\nhemen elinizin altında.",
    benefit: "Uzun bağlantılar yerine tek dokunuş.", audience: "İlanlarını fiziksel bir noktadan hızlıca paylaşmak isteyen kullanıcılar için.",
    benefits: ["İlan sayfanıza doğrudan yönlendirme", "İlan numarası yazmaya gerek kalmaz", "Yeni ilan için bağlantı güncellenebilir"] },
};

export const FAQS = [
  ["NFC olmayan telefonlarda kullanılabilir mi?", "Evet. Her kartta QR kod da bulunur. NFC desteklemeyen veya NFC özelliği kapalı olan telefonlarda QR kod okutularak aynı hedefe ulaşılabilir."],
  ["Ek bir uygulama indirmek gerekiyor mu?", "NFC ve QR bağlantısını açmak için ek bir DOKUNUVER uygulaması gerekmez. Hedef hizmetin kendi giriş veya uygulama gereksinimleri geçerli olabilir."],
  ["Bağlantım değişirse yeni kart almam gerekir mi?", "Smart Link kullanılan Google, Instagram, WhatsApp ve İlan kartlarında hedef bağlantı güncellenebilir. Doğrulanıp kilitlenen IBAN kartlarının finansal bilgileri bu kapsamda değildir."],
  ["Kartı nasıl yerleştirebilirim?", "10 × 10 cm kartların arka yüzü hazır yapışkanlıdır. Uygun, düz bir yüzeye yerleştirebilir veya masaüstü stand seçeneğini tercih edebilirsiniz. NFC performansını etkileyebileceği için metal yüzeylerde kullanmadan önce test edin."],
  ["Siparişi nasıl verebilirim?", "İstediğiniz kartı seçip WhatsApp üzerinden bize ulaşın. İlgili bağlantı veya hesap bilgilerini paylaşın; kartınız size özel, NFC ve QR bağlantıları hazırlanmış şekilde üretilsin."],
];

export function productStory(product) {
  return PRODUCT_STORIES[product.id] || { label: product.title, accent: "#2563eb", category: "NFC kartlar", headline: "Yeni bağlantınız,\nbir dokunuş uzağınızda.",
    benefit: "NFC ve QR ile kolay erişim.", audience: product.description,
    benefits: ["NFC ve QR birlikte", "Size özel hazırlanan bağlantı", "Hazır yapışkanlı arka yüz"] };
}

export function orderLink(product, stand, total) {
  const selection = total === undefined ? "" : `\nStand tercihi: ${stand?.title || "Standsız"}\nKart ve stand toplamı: ${total} TL (kargo hariç).`;
  return `https://wa.me/905075738349?text=${encodeURIComponent(product ? `Merhaba, DOKUNUVER ${product.title} için sipariş vermek istiyorum.${selection}` : "Merhaba, DOKUNUVER kartları hakkında bilgi almak istiyorum.")}`;
}
