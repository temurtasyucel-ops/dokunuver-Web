"use client";
import { useEffect, useRef, useState } from 'react';
import styles from './payment-card.module.css';
function Icon({ name, size = 20 }) {
  const shapes = {
    bank: <><path d="m3 9 9-6 9 6H3ZM5 10v8m5-8v8m4-8v8m5-8v8M3 21h18M3 18h18" /></>,
    copy: <><rect x="8" y="8" width="12" height="13" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" /></>,
    check: <path d="m5 12 4 4 10-10" />,
    arrow: <path d="m9 5 7 7-7 7" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[name]}</svg>;
}
function Frame({ children }) {
  return <main className={styles.page}><div className={styles.wrap}>{children}<footer className={styles.footer}><a href="https://dokunuver.com.tr" target="_blank" rel="noreferrer"><span className={styles.brandMark} aria-hidden="true"><span /><span /><span /></span><span>DOKUNUVER<small>Dokun. Bağlan.</small></span></a><span>NFC + QR altyapısı</span></footer></div></main>;
}
export function PaymentState({ loading = false, missing = false, onRetry }) {
  return <Frame><section className={styles.state} aria-busy={loading}><div className={styles.stateIcon}><Icon name="bank" size={28} /></div><h1>{loading ? 'Hesap bilgileri yükleniyor' : missing ? 'Kart kullanıma açık değil' : 'Bilgilere ulaşılamadı'}</h1><p role={loading ? 'status' : 'alert'}>{loading ? 'Lütfen kısa bir süre bekleyin.' : missing ? 'Bu kart bulunamadı veya kullanım dışı. Kartı sağlayan işletmeyle iletişime geçebilirsiniz.' : 'Bağlantınızı kontrol edip tekrar deneyin.'}</p>{!loading && !missing && <button className={styles.primary} onClick={onRetry} type="button">Tekrar dene</button>}</section></Frame>;
}
export default function PaymentCard({ card, demo = false, locked = false }) {
  const [copied, setCopied] = useState('');
  const [copyError, setCopyError] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const iban = card.iban.replace(/\s+/g, '');
  const groups = iban.match(/.{1,4}/g) || [];
  const lockedDate = card.locked_at && !Number.isNaN(Date.parse(card.locked_at)) ? new Date(card.locked_at).toLocaleDateString('tr-TR', { timeZone: 'Europe/Istanbul', day: '2-digit', month: '2-digit', year: 'numeric' }) : null;
  async function copy(kind) {
    setCopyError('');
    try {
      await navigator.clipboard.writeText(kind === 'iban' ? iban : card.account_holder);
      clearTimeout(timer.current);
      setCopied(kind);
      timer.current = setTimeout(() => setCopied(''), 2500);
    } catch { setCopyError('Kopyalama yapılamadı. Bilgiye basılı tutarak veya metni seçerek kopyalayabilirsiniz.'); }
  }
  return <Frame>
    {demo && <p className={styles.demo} role="note">Örnek görünüm · Bu bilgilerle ödeme yapmayın.</p>}
    <article className={styles.card}>
      <header className={styles.hero}>
        <div className={styles.heroTop}><span className={styles.heroIcon}><Icon name="bank" size={26} /></span><span className={styles.tag}>HAVALE / EFT</span></div>
        <p className={styles.eyebrow}>ÖDEME BİLGİLERİ</p>
        <h1>{card.business_name}</h1>
        <p className={styles.heroNote}>Hesap bilgileri, tek dokunuşla.</p>
        <div className={styles.heroBottom}><span className={styles.dot} />{demo ? 'Demo IBAN kartı' : 'Dijital IBAN kartı'}</div>
        <div className={styles.heroArt} aria-hidden="true"><span /><span /><span /></div>
      </header>
      <div className={styles.content}>
        <div className={styles.bank}><span className={styles.bankIcon}><Icon name="bank" /></span><div><span className={styles.label}>BANKA</span><p>{card.bank_name}</p></div></div>
        <div className={styles.holder}><div><span className={styles.label}>HESAP SAHİBİ</span><p>{card.account_holder}</p></div><button className={styles.copySmall} type="button" onClick={() => copy('holder')} aria-label={copied === 'holder' ? 'Hesap sahibi kopyalandı' : 'Hesap sahibini kopyala'}><Icon name={copied === 'holder' ? 'check' : 'copy'} size={18} /><span>{copied === 'holder' ? 'Kopyalandı' : 'Kopyala'}</span></button></div>
        <section className={styles.ibanBlock} aria-labelledby="iban-heading"><div className={styles.ibanHeading}><h2 id="iban-heading">IBAN NUMARASI</h2><span>TR</span></div><p className={styles.iban} aria-label={`IBAN: ${groups.join(' ')}`} dir="ltr">{groups.map((group, i) => <span key={i}>{group}</span>)}</p><button type="button" onClick={() => copy('iban')} className={`${styles.primary} ${copied === 'iban' ? styles.copied : ''}`}><Icon name={copied === 'iban' ? 'check' : 'copy'} /><span>{copied === 'iban' ? 'IBAN kopyalandı' : "IBAN’ı kopyala"}</span><span className={styles.buttonArrow}><Icon name="arrow" size={18} /></span></button></section>
        <p className={styles.feedback} role="status" aria-live="polite">{copyError || (copied === 'iban' ? 'IBAN boşluksuz olarak kopyalandı.' : copied === 'holder' ? 'Hesap sahibi kopyalandı.' : '')}</p>
        {locked && !demo && <details className={styles.security}><summary><Icon name="lock" size={16} /><span>Hesap bilgileri kilitli</span><span className={styles.detailsArrow}>+</span></summary><p>Bu kartın banka, hesap sahibi ve IBAN bilgileri kilitlenmiştir; normal panel işlemleriyle değiştirilemez.{lockedDate && <span>Kilitlenme tarihi: {lockedDate}</span>}</p></details>}
        <p className={styles.caution}>Transferi onaylamadan önce bankanızda görünen alıcı adı ve IBAN’ı kontrol edin.</p>
      </div>
    </article>
  </Frame>;
}
