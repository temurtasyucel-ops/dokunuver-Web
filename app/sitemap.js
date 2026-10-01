import { getSiteContent } from "../lib/site-content-server";
import { visibleProducts } from "../lib/site-content.mjs";
export const dynamic = "force-dynamic";
export default async function sitemap() {
  const baseUrl = "https://dokunuver.com.tr";
  const products = visibleProducts(await getSiteContent());
  return [
    { url: baseUrl, changeFrequency: "weekly", priority: 1 },
    ...products.map(p => ({ url: `${baseUrl}/urunler/${p.id}`, changeFrequency: "monthly", priority: 0.8 })),
    { url: `${baseUrl}/iletisim`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/gizlilik`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
