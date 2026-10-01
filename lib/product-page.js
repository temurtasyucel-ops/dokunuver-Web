import "server-only";
import { getSiteContent } from "./site-content-server";
import { visibleProducts } from "./site-content.mjs";

export async function productMetadata(id) {
  const product = visibleProducts(await getSiteContent()).find(p => p.id === id);
  if (!product) return { title: { absolute: "Ürün bulunamadı | DOKUNUVER" }, robots: { index: false, follow: false } };
  return { title: { absolute: `${product.title} | DOKUNUVER` }, description: product.description,
    alternates: { canonical: `https://dokunuver.com.tr/urunler/${id}` } };
}
