export const PRODUCT_IDS = ["google-yorum", "instagram", "whatsapp", "iban", "ilan"];
export const DEFAULT_CONTENT = {
  settings: { stand_price: 50, shipping_text: "Kargo alıcıya aittir.", hero_image: "/images/dokunuver-icon.png" },
  banner: { enabled: false, title: "", text: "", image: "", starts_at: null, ends_at: null },
  products: [
    ["google-yorum", "Google Yorum Kartı", "Müşterilerinizi Google yorum sayfanıza NFC veya QR ile kolayca yönlendirin."],
    ["instagram", "Instagram Kartı", "Instagram profilinizi müşterilerinizle NFC veya QR üzerinden kolayca paylaşın."],
    ["whatsapp", "WhatsApp Kartı", "Müşterilerinizin numaranızı kaydetmeden WhatsApp bağlantınıza ulaşmasını kolaylaştırın."],
    ["iban", "IBAN Kartı", "Doğrulanmış banka, hesap sahibi ve IBAN bilgilerinizi NFC veya QR üzerinden kolayca paylaşın."],
    ["ilan", "İlan Kartı", "İlan bağlantınızı NFC veya QR ile müşterilerinize doğrudan ulaştırın."],
  ].map(([id, title, description]) => ({ id, title, description, image: `/images/${id}-nfc.png`, price: 250,
    campaign: { enabled: false, price: null, label: "", starts_at: null, ends_at: null } })),
};

export function isLive(campaign, now = Date.now()) {
  return campaign.enabled && (!campaign.starts_at || Date.parse(campaign.starts_at) <= now)
    && (!campaign.ends_at || now < Date.parse(campaign.ends_at));
}

export function effectivePrice(product, now = Date.now()) {
  return isLive(product.campaign, now) && product.campaign.price !== null ? product.campaign.price : product.price;
}

export function money(value) {
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 }).format(value)} TL`;
}

export function priceSummary(products) {
  const prices = products.map(p => effectivePrice(p));
  return prices.every(p => p === prices[0]) ? `Tekli kartlar ${money(prices[0])}` : `Kartlar ${money(Math.min(...prices))}'den başlayan fiyatlarla`;
}

export function validateContent(input, supabaseUrl) {
  const fail = message => { throw new Error(message); };
  const text = (value, max, label, empty = false) => {
    if (typeof value !== "string" || value.length > max || (!empty && !value.trim())) fail(`${label} geçersiz.`);
    return value.trim();
  };
  const price = (value, label) => {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1000000 || Math.abs(value * 100 - Math.round(value * 100)) > 0.00001) fail(`${label}: 0–1.000.000 arası, en fazla iki ondalıklı tutar girin.`);
    return value;
  };
  const image = (value, optional = false) => {
    value = text(value, 2048, "Görsel adresi", optional);
    if (optional && !value) return "";
    if (/^\/images\/[a-zA-Z0-9._/-]+\.(png|jpe?g|webp)$/i.test(value) && !value.includes("..")) return value;
    try {
      const url = new URL(value), base = new URL(supabaseUrl);
      if (url.origin === base.origin && url.pathname.startsWith("/storage/v1/object/public/site-media/") && !url.search && !url.hash && /\.(png|jpe?g|webp)$/i.test(url.pathname)) return url.href;
    } catch {}
    fail("Görsel yükleyin veya mevcut /images/ adresini kullanın.");
  };
  const window = c => {
    if (!c || typeof c.enabled !== "boolean") fail("Kampanya durumu geçersiz.");
    const date = v => {
      if (v === null || v === "") return null;
      if (typeof v !== "string" || !Number.isFinite(Date.parse(v))) fail("Kampanya tarihi geçersiz.");
      return new Date(v).toISOString();
    };
    const starts_at = date(c.starts_at), ends_at = date(c.ends_at);
    if (starts_at && ends_at && starts_at >= ends_at) fail("Bitiş tarihi başlangıçtan sonra olmalıdır.");
    return { enabled: c.enabled, starts_at, ends_at };
  };
  if (!input || !Array.isArray(input.products) || input.products.length !== 5 || !input.settings) fail("Beş aktif ürünün bilgileri gereklidir.");
  const products = PRODUCT_IDS.map(id => {
    const matches = input.products.filter(p => p?.id === id);
    if (matches.length !== 1) fail("Ürün listesi geçersiz.");
    const p = matches[0], basePrice = price(p.price, p.title || id), campaign = window(p.campaign);
    const salePrice = p.campaign.price === null ? null : price(p.campaign.price, "Kampanya fiyatı");
    if (salePrice !== null && salePrice >= basePrice) fail("Kampanya fiyatı normal fiyattan düşük olmalıdır.");
    if (campaign.enabled && salePrice === null) fail("Aktif kampanyanın fiyatı gereklidir.");
    return { id, title: text(p.title, 100, "Ürün adı"), description: text(p.description, 1000, "Ürün açıklaması"),
      image: image(p.image), price: basePrice, campaign: { ...campaign, price: salePrice, label: text(p.campaign.label, 80, "Kampanya etiketi", true) } };
  });
  const banner = { ...window(input.banner), title: text(input.banner.title, 120, "Duyuru başlığı", true),
    text: text(input.banner.text, 1000, "Duyuru metni", true), image: image(input.banner.image, true) };
  if (banner.enabled && !banner.title) fail("Aktif duyurunun başlığı gereklidir.");
  return { products, banner, settings: { stand_price: price(input.settings.stand_price, "Stand fiyatı"),
    shipping_text: text(input.settings.shipping_text, 200, "Kargo açıklaması"), hero_image: image(input.settings.hero_image) } };
}
