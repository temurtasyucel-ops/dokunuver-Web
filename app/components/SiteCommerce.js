import { effectivePrice, isLive, money } from "../../lib/site-content.mjs";

export function ProductPrice({ product }) {
  const price = effectivePrice(product), sale = price < product.price;
  return <><span>{money(price)}</span>{sale && <><del style={{ marginLeft: 12, fontSize: "0.55em", fontWeight: 500, color: "#667085" }}>{money(product.price)}</del>
    <span style={{ display: "block", color: "#087cf0", fontSize: 13, marginTop: 6 }}>{product.campaign.label || "Kampanya"}</span></>}</>;
}

export function CampaignBanner({ banner }) {
  if (!isLive(banner)) return null;
  return <aside aria-label="Kampanya duyurusu" style={{ maxWidth: 1132, margin: "12px auto 24px", padding: 24, background: "#eaf4ff", borderRadius: 16 }}>
    {banner.image && <img src={banner.image} alt={banner.title} style={{ display: "block", width: "100%", maxHeight: 360, objectFit: "contain", marginBottom: 16 }} />}
    <strong style={{ fontSize: 22 }}>{banner.title}</strong>
    {banner.text && <p style={{ margin: "10px 0 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{banner.text}</p>}
  </aside>;
}
