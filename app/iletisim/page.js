import { getSiteContent } from "../../lib/site-content-server";
import { priceSummary, money } from "../../lib/site-content.mjs";
import { Shell, Banner, Button, Icon, FAQ } from "../components/storefront/Storefront";
import { orderLink } from "../components/storefront/catalog";
import styles from "../components/storefront/storefront.module.css";
export const dynamic = "force-dynamic";
export const metadata = { title: "İletişim", description: "DOKUNUVER kartları hakkında bilgi alın ve WhatsApp üzerinden sipariş verin." };
export default async function Page() {
 const content = await getSiteContent();
 return <Shell><Banner banner={content.banner} /><section className={`${styles.section} ${styles.contactHero}`}><div><span className={styles.eyebrow}>BİRLİKTE HAZIRLAYALIM</span><h1>İlk bağlantı,<br />bir merhaba.</h1><p>İşletmeniz için uygun kartı birlikte seçelim. Sorularınızı ve sipariş talebinizi WhatsApp üzerinden paylaşabilirsiniz.</p></div><div className={styles.contactCard}><Icon name="chat" /><h2>WhatsApp’tan konuşalım.</h2><p>Ürün seçimi, bağlantı tanımlama ve sipariş için bize yazın.</p><Button href={orderLink()} external>İletişime geç</Button><small>{priceSummary(content.products)}<br />Masaüstü stand +{money(content.settings.stand_price)} · {content.settings.shipping_text}</small></div></section><section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>SİPARİŞ SÜRECİ</span><h2>Seçin. Paylaşın.<br />Bağlanın.</h2></div></div><div className={styles.orderSteps}>{[["01","Kartınızı seçin","İhtiyacınıza uygun DOKUNUVER kartını belirleyin."],["02","Bilgilerinizi paylaşın","İlgili bağlantıyı veya IBAN bilgilerini WhatsApp üzerinden iletin."],["03","Kullanıma hazır teslim alın","NFC ve QR bağlantıları hazırlanmış kartınızı teslim alıp kullanmaya başlayın."]].map(([n,t,p])=><div key={n}><span>{n}</span><h3>{t}</h3><p>{p}</p></div>)}</div></section><FAQ settings={content.settings} /></Shell>;
}
