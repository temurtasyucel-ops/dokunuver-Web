"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import styles from "./panel-shell.module.css";
const sections = [
  { href: "/panel/ozet", title: "İşletme Özeti", sub: "Güncel iş ve ödemeler", icon: "settings" },
  { href: "/panel", title: "IBAN Kartları", sub: "Stok ve müşteri kartları", icon: "card" },
  { href: "/panel/smart-links", title: "Smart Links", sub: "Bağlantılar ve üretim", icon: "link" },
  { href: "/panel/siparisler", title: "Siparişler", sub: "Üretim ve teslimat", icon: "card" },
  { href: "/panel/stok", title: "Malzeme Stoku", sub: "Giriş, çıkış ve kritik stok", icon: "card" },
  { href: "/panel/toplu-islemler", title: "Toplu İşlemler", sub: "Seçim, durum ve baskı", icon: "settings" },
  { href: "/panel/islem-gecmisi", title: "İşlem Geçmişi", sub: "Kayıt değişiklikleri", icon: "link" },
  { href: "/panel/site-yonetimi", title: "Site Yönetimi", sub: "Fiyat, kampanya ve görsel", icon: "settings" },
];
function Glyph({ name }) {
 const paths = { card: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h3" /></>, link: <><path d="m10 14 4-4M8 15l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M16 9l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" /></>, settings: <><path d="M4 6h16M4 12h16M4 18h16" /><circle cx="8" cy="6" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="18" r="2" /></> };
 return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">{paths[name]}</svg>;
}
export default function PanelShell({ children }) {
 const pathname = usePathname();
 const active = sections.find(s => s.href !== "/panel" && pathname.startsWith(s.href)) || sections.find(s => s.href === "/panel");
 const [warning, setWarning] = useState(false);
 useEffect(() => { const show = () => setWarning(true); window.addEventListener("dokunuver-session-warning", show); return () => window.removeEventListener("dokunuver-session-warning", show); }, []);
 if (pathname === "/panel/login") return children;
 return <div className={styles.shell}><a className={styles.skip} href="#panel-icerik">İçeriğe geç</a><aside className={styles.sidebar}><Link href="/panel" className={styles.brand}>DOKUNUVER<span>Dokun. Bağlan.</span></Link><div className={styles.label}>YÖNETİM ALANI</div><nav aria-label="Panel bölümleri" className={styles.nav}>{sections.map(s => <Link key={s.href} href={s.href} aria-current={active.href === s.href ? "page" : undefined}><Glyph name={s.icon} /><span>{s.title}<small>{s.sub}</small></span></Link>)}</nav><div className={styles.sidebarBottom}><span>NFC + QR, tek merkezden.</span><Link href="/" target="_blank" rel="noreferrer">Müşteri sitesini aç ↗</Link></div></aside><div className={styles.workspace}><header className={styles.topbar}><div><span>YÖNETİM PANELİ</span><strong>{active.title}</strong></div><div className={styles.topActions}><Link href="/" target="_blank" rel="noreferrer">Siteyi gör ↗</Link><LogoutButton /></div></header>{warning && <div role="status" style={{padding:"12px 24px",background:"#fff8e5"}}>Oturum servisine ulaşılamadı. Düzenlemelerin açık kalıyor; sonraki işlemde tekrar denenecek. <button onClick={() => setWarning(false)}>Kapat</button></div>}<div id="panel-icerik" className={styles.content}>{children}</div><footer className={styles.footer}>DOKUNUVER · Yönetim paneli</footer></div></div>;
}
