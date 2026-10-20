'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {CONSENT_TEXT,normalizePhone} from '../../lib/loyalty.mjs';
import {loyaltyDB,loyaltyAuth,hasLoyaltySession,clearLoyaltySession,loyaltyAction} from '../../lib/loyalty-client.mjs';
import {demoBusiness} from './demo-data.mjs';
import s from './loyalty.module.css';
const date=v=>new Date(v).toLocaleString('tr-TR');
export default function Customer({slug,demo=false}){
 const [business,setBusiness]=useState(demo?demoBusiness:null),[profile,setProfile]=useState(demo?{name:'Deniz',marketing_opt_in:false}:null);
 const [balances,setBalances]=useState(demo?[{campaign_id:'cookie',stamps:3}]:[]),[rewards,setRewards]=useState([]),[requests,setRequests]=useState([]),[history,setHistory]=useState([]);
 const [phase,setPhase]=useState(demo?'card':'loading'),[phone,setPhone]=useState(''),[code,setCode]=useState(''),[name,setName]=useState(''),[consent,setConsent]=useState(false);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 async function loadCard(b){
  const own=await loyaltyDB(`loyalty_customers?business_id=eq.${b.id}&select=id,name,marketing_opt_in`);
  if(!own.length){setPhase('register');return;}
  setProfile(own[0]);
  const [bs,rs,qs,hs]=await Promise.all([
   loyaltyDB(`loyalty_balances?business_id=eq.${b.id}&customer_id=eq.${own[0].id}&select=campaign_id,stamps,total_stamps`),
   loyaltyDB(`loyalty_rewards?business_id=eq.${b.id}&customer_id=eq.${own[0].id}&select=id,label,earned_at,redeemed_at&order=earned_at.desc&limit=30`),
   loyaltyDB(`loyalty_requests?business_id=eq.${b.id}&customer_id=eq.${own[0].id}&select=id,campaign_id,status,expires_at&status=eq.pending&order=created_at.desc&limit=10`),
   loyaltyDB(`loyalty_stamps?business_id=eq.${b.id}&customer_id=eq.${own[0].id}&select=id,created_at&order=created_at.desc&limit=20`)
  ]);setBalances(bs);setRewards(rs);setRequests(qs);setHistory(hs);setPhase('card');
 }
 useEffect(()=>{
  if(demo)return;let current=true;
  (async()=>{try{
   const b=await loyaltyDB('rpc/loyalty_public',{p_slug:slug},true);if(!current)return;
   if(!b){setPhase('missing');return;}setBusiness(b);
   if(hasLoyaltySession())await loadCard(b);else setPhase('phone');
  }catch(e){if(current){setError(e.message);setPhase('failed');}}})();
  return()=>{current=false;};
 },[slug,demo]);
 async function run(fn){setBusy(true);setError('');setNotice('');try{await fn();}catch(e){setError(e.message);}finally{setBusy(false);}}
 function logout(){if(!demo)clearLoyaltySession();setProfile(null);setBalances([]);setRewards([]);setRequests([]);setHistory([]);setPhone('');setCode('');setName('');setConsent(false);setPhase('phone');}
 async function requestStamp(c){
  if(demo){setRequests([{id:'demo-request',campaign_id:c.id,status:'pending',expires_at:new Date(Date.now()+300000).toISOString()}]);setNotice('Demo talep oluşturuldu. Gerçek kullanımda personel onayı gerekir.');return;}
  await loyaltyAction(business.id,'request_stamp',{campaign_id:c.id});await loadCard(business);setNotice('Talebiniz kasaya iletildi. Alışverişinizi personelinize gösterin.');
 }
 return <main className={s.customer}>
  <header className={s.brand}><strong>DOKUNUVER</strong><span>DİJİTAL SADAKAT</span></header>
  {demo&&<div className={s.demo}>Önizleme · Örnek veriler kullanılır, gerçek damga veya kayıt oluşmaz. <Link href="/sadakat/isletme/demo">İşletme ekranı ↗</Link></div>}
  <section className={s.hero}><span className={s.eyebrow}>HER ZİYARETİN BİR KARŞILIĞI VAR</span><h1>{business?.name||'Sadakat kartın'}</h1><p>Damgaların ve ikramların, her zaman yanında.</p></section>
  {error&&<div role="alert" className={`${s.notice} ${s.error}`}>{error}</div>}
  {notice&&<div role="status" className={s.notice}>{notice}</div>}
  {phase==='loading'&&<div className={s.card} role="status">Kartın hazırlanıyor…</div>}
  {phase==='missing'&&<div className={s.card}><h2>Kart bulunamadı</h2><p>İşletme bağlantısını kontrol edin.</p></div>}
  {phase==='failed'&&<div className={s.card}><p>Kart bilgisi alınamadı.</p><div className={s.actions}><button onClick={()=>window.location.reload()}>Tekrar dene</button>{business&&<button className={s.secondary} onClick={logout}>Yeniden giriş yap</button>}</div></div>}
  {phase==='phone'&&<form className={s.card} onSubmit={e=>{e.preventDefault();run(async()=>{const p=normalizePhone(phone);await loyaltyAuth('otp',{phone:p,create_user:true});setPhone(p);setPhase('code');});}}><h2>Kartını aç</h2><p className={s.muted}>Telefon numaranı doğrula; damgaların kaybolmasın.</p><label>Cep telefonu<input type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" value={phone} onChange={e=>setPhone(e.target.value)} required/></label><button className={s.full} disabled={busy}>SMS kodu gönder</button><p className={s.qrNote}>Numaran kartını tanımak için kullanılır. Kampanya mesajları için tercih ayrıca sorulur.</p></form>}
  {phase==='code'&&<form className={s.card} onSubmit={e=>{e.preventDefault();run(async()=>{await loyaltyAuth('verify',{type:'sms',phone,token:code});await loadCard(business);});}}><h2>Telefonunu doğrula</h2><p className={s.muted}>{phone} numarasına gönderilen kodu yaz.</p><label>SMS kodu<input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={e=>setCode(e.target.value)} maxLength={10} required/></label><button className={s.full} disabled={busy}>Doğrula</button><button type="button" className={s.textButton} disabled={busy} onClick={()=>{setCode('');setPhase('phone');}}>Numarayı değiştir / yeniden kod iste</button></form>}
  {phase==='register'&&<form className={s.card} onSubmit={e=>{e.preventDefault();run(async()=>{await loyaltyAction(business.id,'register',{name,marketing_opt_in:consent});await loadCard(business);});}}><h2>Tanışalım</h2><label>Adın<input value={name} onChange={e=>setName(e.target.value)} maxLength={80} autoComplete="given-name" required/></label><label className={s.check}><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{CONSENT_TEXT} <small>(İsteğe bağlı)</small></span></label><p className={s.muted}>İşaretlemeden de sadakat kartını kullanabilirsin. Tercihini istediğin zaman değiştirebilirsin.</p><button className={s.full} disabled={busy}>Sadakat kartımı oluştur</button></form>}
  {phase==='card'&&<>
   <div className={s.row}><p className={s.muted}>Merhaba {profile?.name}</p>{!demo&&<button disabled={busy} className={s.textButton} onClick={logout}>Çıkış yap</button>}</div>
   {business.campaigns.length===0&&<div className={s.card}>İşletmenin şu anda açık bir kampanyası yok.</div>}
   {business.campaigns.map(c=>{const balance=balances.find(b=>b.campaign_id===c.id)?.stamps||0;const pending=requests.find(r=>r.campaign_id===c.id&&r.status==='pending'&&new Date(r.expires_at)>new Date());return <section className={s.card} key={c.id}><span className={s.eyebrow}>{c.name}</span><h2>{c.reward}</h2><div className={s.progress}><strong>{balance}<span> / {c.target}</span></strong><span>Ödülüne {c.target-balance} damga kaldı</span></div><div className={s.stamps} aria-label={`${c.target} damganın ${balance} tanesi dolu`}>{Array.from({length:c.target},(_,i)=><span aria-hidden="true" className={`${s.stamp} ${i<balance?s.filled:''}`} key={i}>{i<balance?'✓':i+1}</span>)}</div>{pending?<><p role="status" className={s.notice}>Kasada onay bekliyor · {date(pending.expires_at)} tarihine kadar</p><button className={s.full} disabled={busy} onClick={()=>run(async()=>{if(demo)setNotice('Demo: personel onayı bekleniyor.');else await loadCard(business);})}>Damga durumunu yenile</button></>:<button className={s.full} disabled={busy} onClick={()=>run(()=>requestStamp(c))}>Alışverişim için damga iste</button>}<p className={s.qrNote}>Damga, alışveriş sonrasında işletme personeli onayladığında eklenir.</p></section>;})}
   <section className={s.card}><h2>İkramların</h2>{rewards.length?rewards.map(r=><div className={s.reward} key={r.id}><strong>{r.label}</strong><span className={s.small}>{r.redeemed_at?`Kullanıldı · ${date(r.redeemed_at)}`:'Hazır · Kullanmak için kasaya göster'}</span></div>):<p className={s.muted}>Kartın dolduğunda ödülün burada görünecek. Yeni damgalar toplamaya devam edebilirsin.</p>}</section>
   <section className={s.card}><h2>İletişim tercihin</h2><label className={s.check}><input type="checkbox" checked={!!profile?.marketing_opt_in} disabled={busy} onChange={e=>{const allowed=e.target.checked;run(async()=>{if(!demo)await loyaltyAction(business.id,'consent',{allowed});setProfile(p=>({...p,marketing_opt_in:allowed}));setNotice('İletişim tercihin kaydedildi.');});}}/><span>{CONSENT_TEXT}</span></label><p className={s.muted}>İzin vermemen veya iznini geri alman damgalarını etkilemez.</p></section>
   <details className={s.card}><summary>Son 20 damga işlemin</summary>{history.length?history.map(h=><div key={h.id} className={s.history}>+1 damga · {date(h.created_at)}</div>):<p className={s.muted}>Henüz tamamlanmış işlem yok.</p>}</details>
  </>}
  <footer className={s.footer}>DOKUNUVER · Dokun. Bağlan.</footer>
 </main>;
}
