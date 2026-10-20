'use client';
import {useEffect,useState,useRef} from 'react';
import Link from 'next/link';
import {loyaltyDB,loyaltyAuth,loyaltyAction,hasLoyaltySession,clearLoyaltySession} from '../../lib/loyalty-client.mjs';
import Customers from './Customers';
import Settings from './Settings';
import {demoData,demoBusiness} from './demo-data.mjs';
import s from './loyalty.module.css';
const date=v=>v?new Date(v).toLocaleDateString('tr-TR'):'Henüz yok';
export default function Business({demo=false}){
 const [session,setSession]=useState(demo),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [businesses,setBusinesses]=useState(demo?[{...demoBusiness,role:'owner'}]:[]),[businessId,setBusinessId]=useState(demo?'demo':'');
 const [data,setData]=useState({customers:[],balances:[],requests:[],rewards:[],stamps:[]});
 const [campaigns,setCampaigns]=useState(demo?demoBusiness.campaigns.map(c=>({...c,active:true,daily_limit:1,revision:1,terms_locked:true})):[]),[tab,setTab]=useState('queue');
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const loadVersion=useRef(0);
 const [stats,setStats]=useState({customers:0,pending:0,rewards:0}),[members,setMembers]=useState([]),[events,setEvents]=useState([]);
 const business=businesses.find(b=>b.id===businessId),role=business?.role;
 async function loadBusinesses(){
  const rows=await loyaltyDB('rpc/loyalty_my_businesses',{});setBusinesses(rows);setBusinessId(rows[0]?.id||'');setSession(true);
 }
 async function load(business){
  const version=++loadVersion.current;
  const d=await loyaltyDB('rpc/loyalty_dashboard',{p_business:business});
  if(version!==loadVersion.current)return;
  setCampaigns(d.campaigns);setStats(d.stats);setMembers(d.members);setEvents(d.admin_events);
  setData({customers:[],balances:[],requests:d.requests,rewards:d.rewards,stamps:d.stamps,reward_history:d.reward_history});
 }

 useEffect(()=>{if(demo){setData(demoData());setMembers([{user_id:'demo-owner',role:'owner',active:true,display_name:'İşletme sahibi',email:'sahip@example.com'},{user_id:'demo-staff',role:'staff',active:true,display_name:'Örnek personel',email:'personel@example.com'}]);return;}if(hasLoyaltySession())run(loadBusinesses);},[demo]);
 useEffect(()=>{if(demo||!businessId)return;setData({customers:[],balances:[],requests:[],rewards:[],stamps:[]});run(()=>load(businessId));},[businessId,demo]);
 async function run(fn){setBusy(true);setError('');setNotice('');try{await fn();}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function act(action,id){
  if(demo){
   setData(d=>{
    if(action==='redeem')return {...d,rewards:d.rewards.map(r=>r.id===id?{...r,redeemed_at:new Date().toISOString()}:r)};
    const req=d.requests.find(q=>q.id===id);if(!req)return d;
    const next={...d,requests:d.requests.filter(q=>q.id!==id)};
    if(action==='approve'){
     const campaign=campaigns.find(c=>c.id===req.campaign_id);const bal=d.balances.find(b=>b.customer_id===req.customer_id&&b.campaign_id===req.campaign_id);
     next.balances=d.balances.map(b=>b===bal?{...b,stamps:(b.stamps+1)%campaign.target,total_stamps:b.total_stamps+1}:b);
     if(bal&&bal.stamps+1>=campaign.target)next.rewards=[...d.rewards,{id:`demo-${Date.now()}`,customer_id:req.customer_id,campaign_id:req.campaign_id,label:campaign.reward,earned_at:new Date().toISOString()}];
     next.stamps=[{id:`stamp-${Date.now()}`,customer_id:req.customer_id,created_at:new Date().toISOString(),actor_id:'Demo işletme sahibi'},...d.stamps];
    }return next;
   });setNotice('Demo işlem tamamlandı. Gerçek kayıt değişmedi.');return;
  }
  await loyaltyAction(businessId,action,action==='redeem'?{reward_id:id}:{request_id:id});await load(businessId);setNotice('İşlem tamamlandı.');
 }
 async function saveCampaign(form){
  let ok=false;await run(async()=>{
   if(demo){setCampaigns(cs=>form.revision===0?[...cs,{...form,revision:1}]:cs.map(c=>c.id===form.id?{...form,revision:c.revision+1}:c));setEvents(es=>[{action:'campaign_saved',details:{name:form.name},actor_name:'İşletme sahibi',created_at:new Date().toISOString()},...es]);}
   else{await loyaltyDB('rpc/loyalty_campaign_save',{p_business:businessId,p_id:form.id,p_revision:form.revision,p_data:{name:form.name,reward:form.reward,target:form.target,daily_limit:form.daily_limit,active:form.active}});await load(businessId);}
   setNotice(demo?'Demo kampanyası kaydedildi. Gerçek kayıt değişmedi.':'Kampanya kaydedildi.');ok=true;
  });return ok;
 }
 async function saveStaff(form){
  let ok=false;await run(async()=>{
   if(demo){setMembers(ms=>{const old=ms.find(m=>m.email===form.email);return old?ms.map(m=>m===old?{...m,display_name:form.name,active:form.active}:m):[...ms,{user_id:crypto.randomUUID(),role:'staff',active:true,display_name:form.name,email:form.email}];});setEvents(es=>[{action:'staff_saved',details:{name:form.name},actor_name:'İşletme sahibi',created_at:new Date().toISOString()},...es]);}
   else{await loyaltyDB('rpc/loyalty_staff_save',{p_business:businessId,p_email:form.email,p_name:form.name,p_active:form.active});await load(businessId);}
   setNotice(demo?'Demo personel erişimi güncellendi. Gerçek hesap veya davet oluşmadı.':'Personel erişimi güncellendi.');ok=true;
  });return ok;
 }

 const person=id=>data.customers.find(c=>c.id===id);
 const pending=data.requests.filter(r=>new Date(r.expires_at)>new Date());
 return <main className={s.shell}>
  <header className={s.brand}><strong>DOKUNUVER <span> SADAKAT</span></strong><div className={s.actions}>{demo?<Link href="/sadakat/demo">Müşteri ekranı ↗</Link>:session&&<button className={s.textButton} disabled={busy} onClick={()=>{loadVersion.current++;clearLoyaltySession();setSession(false);setBusinessId('');setBusinesses([]);setData({customers:[],balances:[],requests:[],rewards:[],stamps:[]});}}>Çıkış yap</button>}</div></header>
  {demo&&<div className={s.demo}>İşletme önizlemesi · Tüm isimler ve telefonlar örnektir. İşlemler yalnız bu ekranda simüle edilir. Mesaj gönderimi kapalıdır.</div>}
  {error&&<p role="alert" className={`${s.notice} ${s.error}`}>{error}</p>}{notice&&<p role="status" className={s.notice}>{notice}</p>}
  {!session?<form className={`${s.card} ${s.login}`} onSubmit={e=>{e.preventDefault();run(async()=>{await loyaltyAuth('token?grant_type=password',{email,password});setPassword('');await loadBusinesses();});}}><span className={s.eyebrow}>İŞLETME GİRİŞİ</span><h1>Müşterilerinle bağını güçlendir.</h1><p className={s.muted}>Yetkilendirilmiş işletme hesabınla giriş yap.</p><label>E-posta<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Şifre<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className={s.full} disabled={busy}>Giriş yap</button><p className={s.qrNote}><Link href="/sadakat/isletme/demo">Örnek işletme panelini incele ↗</Link></p></form>:<>
   <section className={s.hero}><span className={s.eyebrow}>İŞLETME PANELİ</span><h1>{business?.name||'İşletmelerin'}</h1><p>Bekleyen damgaları onayla, ödülleri yönet, müşterilerini tanı.</p></section>
   {businesses.length>1&&<label>İşletme<select disabled={busy} value={businessId} onChange={e=>{loadVersion.current++;setCampaigns([]);setMembers([]);setEvents([]);setStats({customers:0,pending:0,rewards:0});setTab('queue');setBusinessId(e.target.value);}}>{businesses.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>}
   {!business&&<div className={s.card}>Bu hesaba tanımlı işletme bulunamadı. DOKUNUVER yöneticisiyle iletişime geçin.</div>}
   {business&&<>
    <div className={s.stats}><div><strong>{demo?data.customers.length:stats.customers}</strong><span>Toplam müşteri</span></div><div><strong>{demo?pending.length:stats.pending}</strong><span>Bekleyen damga</span></div><div><strong>{demo?data.rewards.filter(r=>!r.redeemed_at).length:stats.rewards}</strong><span>Hazır ödül</span></div></div>
    <div className={s.row}><nav className={s.tabs} aria-label="Sadakat paneli">{[['queue','Kasa'],['customers','Müşteriler'],['history','İşlem geçmişi'],...(role==='owner'?[['settings','Kampanya & personel']]:[])].map(([key,label])=><button key={key} aria-pressed={tab===key} onClick={()=>setTab(key)}>{label}</button>)}</nav><button className={s.secondary} disabled={busy} onClick={()=>run(async()=>{if(demo)setNotice('Demo verileri gösteriliyor.');else await load(businessId);})}>Yenile</button></div>
    {tab==='queue'&&<div className={s.grid}>
     <section className={s.card}><h2>Damga onayı</h2><p className={s.muted}>Müşteriyi ve alışverişi kontrol ettikten sonra onayla. Talepler 5 dakika geçerlidir.</p><ul className={s.people}>{pending.map(q=><li className={s.person} key={q.id}><strong>{q.customer_name||person(q.customer_id)?.name||'Kayıtlı müşteri'}</strong><p>{q.customer_phone||person(q.customer_id)?.phone||'Müşteri kimliğini kasada doğrulayın'} · {campaigns.find(c=>c.id===q.campaign_id)?.name}</p><p>Talep: {q.id.slice(0,8)} · Son saat: {new Date(q.expires_at).toLocaleTimeString('tr-TR')}</p><div className={s.actions}><button disabled={busy} onClick={()=>run(()=>act('approve',q.id))}>Alışverişi doğrula · +1</button><button disabled={busy} className={s.secondary} onClick={()=>run(()=>act('reject',q.id))}>Reddet</button></div></li>)}</ul>{!pending.length&&<p className={s.empty}>Onay bekleyen talep yok.</p>}</section>
     <section className={s.card}><h2>Hazır ödüller</h2><p className={s.muted}>Ödül tesliminde müşterinin kartıyla eşleştir. Kullandırma yetkisi işletme sahibindedir.</p>{data.rewards.filter(r=>!r.redeemed_at).map(r=><article className={s.reward} key={r.id}><strong>{r.customer_name||person(r.customer_id)?.name||'Kayıtlı müşteri'}</strong><p>{r.label}</p><p className={s.small}>Ödül: {r.id.slice(0,8)}</p>{role==='owner'&&<button disabled={busy} onClick={()=>{if(demo||window.confirm('Ödülü müşteriye teslim ettiniz mi? Bu işlem ödülü kullanılmış olarak kaydeder.'))run(()=>act('redeem',r.id));}}>Ödülü teslim ettim</button>}</article>)}{!data.rewards.some(r=>!r.redeemed_at)&&<p className={s.empty}>Kullanılmayı bekleyen ödül yok.</p>}</section>
    </div>}
    {tab==='customers'&&<Customers key={businessId} businessId={businessId} demo={demo} data={data} campaigns={campaigns}/>}
    {tab==='settings'&&role==='owner'&&<Settings key={businessId} campaigns={campaigns} members={members} events={events} busy={busy} onCampaign={saveCampaign} onStaff={saveStaff}/>}
    {tab==='history'&&<section className={s.card}><h2>Son 100 damga işlemi</h2>{data.stamps.length?data.stamps.map(h=><div className={s.history} key={h.id}><strong>{h.customer_name||person(h.customer_id)?.name||'Kayıtlı müşteri'} · +1 damga</strong><div>{new Date(h.created_at).toLocaleString('tr-TR')}</div><div className={s.muted}>Onaylayan: {h.actor_name||h.actor_id}</div></div>):<p className={s.empty}>Henüz tamamlanmış damga yok.</p>}<h2 style={{marginTop:24}}>Son yüklenen ödüller</h2>{(data.reward_history||data.rewards).map(r=><div className={s.history} key={r.id}>{r.label} · {r.redeemed_at?`Kullanıldı: ${date(r.redeemed_at)}`:'Kullanılmadı'} · {r.customer_name||person(r.customer_id)?.name||'Kayıtlı müşteri'}</div>)}</section>}
    <p className={s.footer}>Müşteri kartı: <Link href={demo?'/sadakat/demo':`/sadakat/${business.slug}`}>Kartı aç ↗</Link> · NFC ve QR için bu bağlantıyı kullanın.</p>
   </>}
  </>}
 </main>;
}
