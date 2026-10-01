import Link from "next/link";
import { effectivePrice, isLive, money } from "../../../lib/site-content.mjs";
import { ProductPrice } from "../SiteCommerce";
import { FAQS, PRODUCT_STORIES, orderLink } from "./catalog";
import styles from "./storefront.module.css";

export function Icon({ name = "arrow", className }) {
  const paths = { arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>, check: <path d="m5 12 4 4L19 6" />,
    nfc: <><path d="M7 8a6 6 0 0 1 0 8M11 4a11 11 0 0 1 0 16M3 11a2 2 0 0 1 0 2" /><path d="M19 5v14" /></>,
    qr: <><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="15" y="3" width="6" height="6" rx="1" /><rect x="3" y="15" width="6" height="6" rx="1" /><path d="M15 15h3v3h3M15 21h3M21 15v-3M3 12h6M12 3v6M12 15v6" /></>,
    link: <><path d="m10 13 4-4M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 8l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" transform="translate(1 0) scale(.92)" /></>,
    bag: <><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
    chat: <path d="M21 11a8.5 8.5 0 0 1-9 9 10 10 0 0 1-4-.9L3 21l1.5-5A9 9 0 1 1 21 11Z" /> };
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.arrow}</svg>;
}

export function Brand() {
  return <Link href="/" className={styles.brand} aria-label="DOKUNUVER ana sayfa"><span className={styles.wordmark}><img src="/images/dokunuver-logo.png" alt="DOKUNUVER — Dokun. Bağlan." width="1254" height="1254" /></span></Link>;
}

export function Header() {
  return <header className={styles.header}><div className={styles.headerInner}><Brand />
    <nav className={styles.desktopNav} aria-label="Ana menü"><Link href="/#urunler">Ürünler</Link><Link href="/#nasil-calisir">Nasıl çalışır?</Link><Link href="/#sorular">Sık sorulanlar</Link></nav>
    <a className={styles.navOrder} href={orderLink()} target="_blank" rel="noreferrer">İletişime geç <Icon /></a>
    <details className={styles.mobileMenu}><summary aria-label="Menüyü aç">Menü <span>＋</span></summary><nav aria-label="Mobil menü"><Link href="/#urunler">Ürünler</Link><Link href="/#nasil-calisir">Nasıl çalışır?</Link><Link href="/#sorular">Sık sorulanlar</Link><Link href="/iletisim">İletişim</Link></nav></details>
  </div></header>;
}

export function Footer() {
  return <footer className={styles.footer}><div className={styles.footerTop}><div><Brand /><p>Fiziksel dünyadan dijitale.<br />Bir dokunuşla.</p></div>
    <div><span>KEŞFET</span><Link href="/#urunler">Kartlarımız</Link><Link href="/#nasil-calisir">Nasıl çalışır?</Link><Link href="/iletisim">İletişim</Link></div>
    <div><span>BİLGİ</span><Link href="/gizlilik">Gizlilik politikası</Link><Link href="/kvkk">KVKK aydınlatma metni</Link><a href={orderLink()} target="_blank" rel="noreferrer">WhatsApp</a></div></div>
    <div className={styles.footerBottom}><span>© {new Date().getFullYear()} DOKUNUVER</span><span>Dokun. Bağlan.</span></div></footer>;
}

export function Shell({ children }) {
  return <div className={styles.site}><a className={styles.skipLink} href="#icerik">İçeriğe geç</a><Header /><main id="icerik">{children}</main><Footer /></div>;
}

export function Button({ children, href, secondary = false, external = false }) {
  return <a className={`${styles.button} ${secondary ? styles.secondary : styles.primary}`} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>{children}<Icon /></a>;
}

export function Banner({ banner }) {
  if (!isLive(banner)) return null;
  return <aside className={styles.banner} aria-label="Kampanya duyurusu"><div>{banner.image && <img src={banner.image} alt={banner.title} />}<div><span>DUYURU</span><strong>{banner.title}</strong>{banner.text && <p>{banner.text}</p>}</div></div></aside>;
}

export function ProductCard({ product, compact = false }) {
  const story = PRODUCT_STORIES[product.id];
  return <Link href={`/urunler/${product.id}`} className={`${styles.productCard} ${compact ? styles.compactCard : ""}`} style={{ "--accent": story.accent }}>
    <div className={styles.productVisual}><span>{story.label}</span><img src={product.image} alt={`DOKUNUVER ${product.title}`} loading="lazy" width="1181" height="1181" /><div className={styles.productArrow}><Icon /></div></div>
    <div className={styles.productInfo}><span className={styles.productCategory}>{story.category}</span><h3>{product.title}</h3><p>{product.description}</p>
      <div className={styles.productBottom}><div className={styles.price}><ProductPrice product={product} /></div><span>10 × 10 cm · NFC + QR</span></div></div>
  </Link>;
}

export function HowItWorks() {
  return <section className={styles.section} id="nasil-calisir"><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>KARMAŞIK DEĞİL. DOKUNUVER.</span><h2>Bağlantı kurmak<br />bu kadar kolay.</h2></div><p>NFC veya QR. İki farklı yol,<br />aynı kolay deneyim.</p></div>
    <div className={styles.steps}>{[["nfc", "01", "Yaklaştır veya okut", "NFC destekli telefonunu karta yaklaştır. Dilersen kameranla QR kodu okut."], ["link", "02", "Bağlantıyı aç", "Telefonda çıkan bildirime dokun. Kartına tanımlanan dijital hedef açılsın."], ["check", "03", "Hemen bağlan", "Yorum sayfasına, sosyal medya profiline, iletişim veya hesap bilgilerine ulaş."]].map(([icon, number, title, text]) => <div className={styles.step} key={number}><div><Icon name={icon} /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></div>)}</div>
  </section>;
}

export function FAQ({ settings }) {
  return <section className={`${styles.section} ${styles.faqSection}`} id="sorular"><div><span className={styles.eyebrow}>AKLINIZDA SORU KALMASIN</span><h2>Küçük kart.<br />Net cevaplar.</h2><p>Başka bir sorunuz varsa<br />bize yazabilirsiniz.</p><a href={orderLink()} className={styles.textLink} target="_blank" rel="noreferrer">WhatsApp’tan sorun <Icon /></a></div>
    <div className={styles.faqList}>{FAQS.map(([question, answer], index) => <details key={question}><summary><span>{question}</span><span className={styles.faqPlus}>＋</span></summary><p>{index === 3 ? `${answer} Masaüstü stand +${money(settings.stand_price)} ile eklenebilir.` : answer}</p></details>)}</div>
  </section>;
}

export function OrderCTA({ settings }) {
  return <section className={styles.orderCTA}><div><span className={styles.eyebrow}>SİZİN İÇİN HAZIRLAYALIM</span><h2>Bir sonraki bağlantınız,<br />bir dokunuş uzağınızda.</h2><p>Kartınızı seçin. Bağlantınızı paylaşın.<br />Gerisini birlikte hazırlayalım.</p><Button href={orderLink()} external>WhatsApp’tan sipariş ver</Button><small>Hazır yapışkanlı arka yüz · Stand +{money(settings.stand_price)} · {settings.shipping_text}</small></div><div className={styles.ctaMark} aria-hidden="true"><img src="/images/dokunuver-icon.png" alt="" width="1280" height="1280" /></div></section>;
}

export function ProductPage({ content, id }) {
  const product = content.products.find(p => p.id === id), story = PRODUCT_STORIES[id], { settings } = content;
  return <Shell><Banner banner={content.banner} /><section className={styles.detailSection} style={{ "--accent": story.accent }}>
    <div className={styles.breadcrumb}><Link href="/">Ana sayfa</Link><span>/</span><Link href="/#urunler">Kartlar</Link><span>/</span><span>{product.title}</span></div>
    <div className={styles.detailGrid}><div className={styles.detailVisual}><span className={styles.eyebrow}>{story.label}</span><img src={product.image} alt={`DOKUNUVER ${product.title}`} width="1181" height="1181" fetchPriority="high" /><div><Icon name="nfc" /> NFC <span>+</span><Icon name="qr" /> QR</div></div>
      <div className={styles.detailInfo}><span className={styles.eyebrow}>{story.category}</span><h1>{product.title}</h1><p className={styles.detailLead}>{story.benefit}</p><p>{product.description}</p><div className={styles.detailPrice}><ProductPrice product={product} /></div>
        <div className={styles.detailTerms}><span>10 × 10 cm</span><span>Hazır yapışkanlı</span><span>NFC + QR</span></div>
        <Button href={orderLink(product)} external>Bu kartı sipariş ver</Button><small>Masaüstü stand +{money(settings.stand_price)} · {settings.shipping_text}</small>
        <ul className={styles.benefitList}>{story.benefits.map(text => <li key={text}><Icon name="check" />{text}</li>)}</ul>
      </div></div>
  </section><section className={`${styles.section} ${styles.productStory}`}><span className={styles.eyebrow}>GÜNLÜK HAYATTA DOKUNUVER</span><h2>{story.headline.split("\n").map((line,i) => <span key={line}>{i > 0 && <br />}{line}</span>)}</h2><p>{story.audience}</p>{story.note && <div className={styles.productNote}><Icon name={id === "iban" ? "check" : "chat"} /><p>{story.note}</p></div>}</section>
    <HowItWorks /><section className={styles.section}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>KOLEKSİYONU KEŞFEDİN</span><h2>Diğer bağlantılarınız<br />için de bir kart var.</h2></div><Link href="/#urunler" className={styles.textLink}>Tüm kartlar <Icon /></Link></div><div className={styles.relatedGrid}>{content.products.filter(p => p.id !== id).slice(0,3).map(p => <ProductCard product={p} compact key={p.id} />)}</div></section><FAQ settings={settings} /><OrderCTA settings={settings} /></Shell>;
}
