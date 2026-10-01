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
  if (!products.length) return "Kartlarımız yakında satışta";
  const prices = products.map(p => effectivePrice(p));
  return prices.every(p => p === prices[0]) ? `Tekli kartlar ${money(prices[0])}` : `Kartlar ${money(Math.min(...prices))}'den başlayan fiyatlarla`;
}

export function visibleProducts(content) { return content.products.filter(p => p.enabled !== false); }
export function availableStands(product, settings) {
  return (settings.stands || []).filter(s => s.enabled && product.stand_ids?.includes(s.id));
}
export function standSummary(settings) {
  const stands = (settings.stands || []).filter(s => s.enabled);
  return stands.length ? stands.map(s => `${s.title} +${money(s.price)}`).join(" · ") : "Standsız kullanım";
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
  if (!input || !Array.isArray(input.products) || input.products.length < 1 || input.products.length > 100 || !input.settings) fail("1–100 arası ürün gereklidir.");
  const id = (value, label) => {
    if (typeof value !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) || value.length > 80 || ["duo", "new", "edit"].includes(value)) fail(`${label}: küçük harf, rakam ve tire kullanın; en fazla 80 karakter.`);
    return value;
  };
  const enabled = (value, label) => {
    if (typeof value !== "boolean") fail(`${label} durumu geçersiz.`);
    return value;
  };
  const legacy = input.catalog_version === undefined;
  if (!legacy && input.catalog_version !== 2) fail("Katalog sürümü desteklenmiyor.");
  const standInput = legacy ? [{ id: "masaustu", title: "Masaüstü stand", price: input.settings.stand_price, enabled: true, image: "" }] : input.settings.stands;
  if (!Array.isArray(standInput) || standInput.length > 20) fail("En fazla 20 stand seçeneği eklenebilir.");
  const standIds = new Set();
  const stands = standInput.map(s => {
    const standId = id(s?.id, "Stand kodu");
    if (standIds.has(standId)) fail("Stand kodları benzersiz olmalıdır.");
    standIds.add(standId);
    return { id: standId, title: text(s.title, 100, "Stand adı"), price: price(s.price, "Stand ek ücreti"),
      enabled: enabled(s.enabled, "Stand"), image: image(s.image, true) };
  });
  const productIds = new Set();
  const products = input.products.map(p => {
    const productId = id(p?.id, "Ürün adresi");
    if (productIds.has(productId)) fail("Ürün adresleri benzersiz olmalıdır.");
    productIds.add(productId);
    const active = legacy ? true : enabled(p.enabled, "Ürün");
    const selectedStands = legacy ? ["masaustu"] : p.stand_ids;
    if (!Array.isArray(selectedStands) || selectedStands.length > 20 || new Set(selectedStands).size !== selectedStands.length || selectedStands.some(s => !standIds.has(s))) fail("Ürünün stand seçenekleri geçersiz.");
    const basePrice = price(p.price, p.title || productId), campaign = window(p.campaign);
    const salePrice = p.campaign.price === null ? null : price(p.campaign.price, "Kampanya fiyatı");
    if (salePrice !== null && salePrice >= basePrice) fail("Kampanya fiyatı normal fiyattan düşük olmalıdır.");
    if (campaign.enabled && salePrice === null) fail("Aktif kampanyanın fiyatı gereklidir.");
    return { id: productId, enabled: active, stand_ids: [...selectedStands], title: text(p.title, 100, "Ürün adı"), description: text(p.description, 1000, "Ürün açıklaması"),
      image: image(p.image, !active), price: basePrice, campaign: { ...campaign, price: salePrice, label: text(p.campaign.label, 80, "Kampanya etiketi", true) } };
  });
  const banner = { ...window(input.banner), title: text(input.banner.title, 120, "Duyuru başlığı", true),
    text: text(input.banner.text, 1000, "Duyuru metni", true), image: image(input.banner.image, true) };
  if (banner.enabled && !banner.title) fail("Aktif duyurunun başlığı gereklidir.");
  return { catalog_version: 2, products, banner, settings: { stands, stand_price: stands.find(s => s.id === "masaustu")?.price ?? 0,
    shipping_text: text(input.settings.shipping_text, 200, "Kargo açıklaması"), hero_image: image(input.settings.hero_image) } };
}
