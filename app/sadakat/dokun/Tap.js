'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {hasLoyaltySession,loyaltyNfcClaim} from '../../../lib/loyalty-client.mjs';
import s from '../loyalty.module.css';
export default function Tap({demo=false}){
 const started=useRef(false),[phase,setPhase]=useState(demo?'ready':'loading'),[message,setMessage]=useState(''),[slug,setSlug]=useState(''),[count,setCount]=useState(3);
 useEffect(()=>{
  if(demo||started.current)return;started.current=true;
  const params=new URLSearchParams(window.location.search),proof={tag:params.get('tag'),e:params.get('e'),c:params.get('c')};
  // Remove bearer proof from visible history before API/auth or navigation.
  window.history.replaceState(null,'','/sadakat/dokun');
  if(!proof.tag||!proof.e||!proof.c){setPhase('error');setMessage('Kasadaki damga kartına telefonunu yeniden yaklaştır.');return;}
  if(!hasLoyaltySession()){setPhase('error');setMessage('Önce ilk NFC kartından sadakat hesabına giriş yap. Ardından kasadaki karta tekrar dokun.');return;}
  loyaltyNfcClaim(proof).then(r=>{setSlug(r.slug);setPhase('success');setMessage('1 damga hesabına eklendi.');}).catch(e=>{setPhase('error');setMessage(e.message);});
 },[demo]);
 return <main className={s.customer}><header className={s.brand}><strong>DOKUNUVER</strong><span>DİJİTAL SADAKAT</span></header>
 {demo&&<div className={s.demo}>İki NFC demosu · Gerçek kart okunmaz, kayıt oluşmaz.</div>}
 <section className={s.hero}><span className={s.eyebrow}>KASADA DOKUN, DAMGANI KAZAN</span><h1>{phase==='success'?'Damgan eklendi':phase==='loading'?'Kart doğrulanıyor…':'Sadakat cebinde'}</h1><p>Kasiyer paneli veya onay düğmesi gerekmez.</p></section>
 <section className={s.card}>
 {phase==='loading'&&<p role="status">Güvenli kart okuması ve hesabın kontrol ediliyor.</p>}
 {message&&<p role={phase==='error'?'alert':'status'} className={s.notice}>{message}</p>}
 {demo&&<><h2>İlk NFC: üyelik kartı</h2><p>Müşteri üye olur ve kartını açar.</p><Link href="/sadakat/demo">Müşteri portalını gör ↗</Link><h2>İkinci NFC: kasa kartı</h2><p>Ödeme sonrası personelin uzattığı güvenli karta dokunur. Sistem geçerli okumayla bir damga ekler.</p><p><strong>{count} / 6 damga</strong></p><button disabled={phase==='success'} onClick={()=>{setCount(4);setPhase('success');setMessage('Demo: 1 damga eklendi. Kasiyer onayı gerekmedi.');}}>İkinci NFC’ye dokunmayı dene</button><button className={s.secondary} disabled={phase!=='success'} onClick={()=>setMessage('Demo: aynı okuma tekrar kullanılamaz. Yeni damga eklenmedi.')}>Aynı bağlantıyı tekrar aç</button></>}
 {!demo&&phase==='success'&&slug&&<Link href={`/sadakat/${encodeURIComponent(slug)}`}>Sadakat kartımı aç →</Link>}
 {!demo&&phase==='error'&&<p>Üyelik için ilk kartı, damga kazanmak için ödeme sonrası kasadaki ikinci kartı kullan.</p>}
 </section><footer className={s.footer}>DOKUNUVER · Dokun. Bağlan.</footer></main>;
}
