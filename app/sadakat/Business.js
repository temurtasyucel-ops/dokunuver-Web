'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {loyaltyDB,loyaltyAuth,loyaltyAction,hasLoyaltySession,clearLoyaltySession} from '../../lib/loyalty-client.mjs';
import {segmentCustomers} from '../../lib/loyalty.mjs';
import {demoData,demoBusiness} from './demo-data.mjs';
import s from './loyalty.module.css';
const date=v=>v?new Date(v).toLocaleDateString('tr-TR'):'Henüz yok';
export default function Business({demo=false}){
 const [session,setSession]=useState(demo),[email,setEmail]=useState(''),[password,setPassword]=useState('');
 const [businesses,setBusinesses]=useState(demo?[{...demoBusiness,role:'owner'}]:[]),[businessId,setBusinessId]=useState(demo?'demo':'');
 const [data,setData]=useState({customers:[],balances:[],requests:[],rewards:[],stamps:[]});
 const [campaigns,setCampaigns]=useState(demo?demoBusiness.campaigns:[]),[segment,setSegment]=useState('all'),[search,setSearch]=useState(''),[tab,setTab]=useState('queue');
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const business=businesses.find(b=>b.id===businessId),role=business?.role;
 async function loadBusinesses(){
  const memberships=await loyaltyDB('loyalty_members?active=eq.true&select=business_id,role,loyalty_businesses(id,name,slug)&limit=100');
  const rows=memberships.filter(m=>m.loyalty_businesses).map(m=>({...m.loyalty_businesses,role:m.role}));setBusinesses(rows);setBusinessId(rows[0]?.id||'');setSession(true);
 }
 async function load(business){
  const query=`business_id=eq.${business}`;
  const [cs,bs,rs,qs,hs,ps]=await Promise.all([
   loyaltyDB(`loyalty_customers?${query}&select=id,name,phone,marketing_opt_in,created_at,last_visit_at&order=created_at.desc&limit=100`),
   loyaltyDB(`loyalty_balances?${query}&select=customer_id,campaign_id,stamps,total_stamps&limit=3000`),
   loyaltyDB(`loyalty_rewards?${query}&select=id,customer_id,campaign_id,label,earned_at,redeemed_at&order=earned_at.desc&limit=100`),
   loyaltyDB(`loyalty_requests?${query}&select=id,customer_id,campaign_id,status,expires_at&status=eq.pending&expires_at=gt.${new Date().toISOString()}&order=created_at&limit=100`),
   loyaltyDB(`loyalty_stamps?${query}&select=id,customer_id,campaign_id,actor_id,created_at&order=created_at.desc&limit=100`),
   loyaltyDB(`loyalty_campaigns?${query}&select=id,name,reward,target,active&limit=100`)
  ]);
  setCampaigns(ps);setData({customers:cs,balances:bs.map(b=>({...b,target:ps.find(c=>c.id===b.campaign_id)?.target})),rewards:rs,requests:qs,stamps:hs});
 }
 useEffect(()=>{if(demo){setData(demoData());return;}if(hasLoyaltySession())run(loadBusinesses);},[demo]);
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
 const visible=segmentCustomers(data.customers,data.balances,data.rewards,segment).filter(c=>`${c.name} ${c.phone}`.toLocaleLowerCase('tr').includes(search.toLocaleLowerCase('tr')));
 const person=id=>data.customers.find(c=>c.id===id);
 const pending=data.requests.filter(r=>new Date(r.expires_at)>new Date());
 return <main className={s.shell}>
  <header className={s.brand}><strong>DOKUNUVER <span> SADAKAT</span></strong><div className={s.actions}>{demo?<Link href="/sadakat/demo">Müşteri ekranı ↗</Link>:session&&<button className={s.textButton} disabled={busy} onClick={()=>{clearLoyaltySession();setSession(false);setBusinessId('');setBusinesses([]);setData({customers:[],balances:[],requests:[],rewards:[],stamps:[]});}}>Çıkış yap</button>}</div></header>
  {demo&&<div className={s.demo}>İşletme önizlemesi · Tüm isimler ve telefonlar örnektir. İşlemler yalnız bu ekranda simüle edilir. Mesaj gönderimi kapalıdır.</div>}
  {error&&<p role="alert" className={`${s.notice} ${s.error}`}>{error}</p>}{notice&&<p role="status" className={s.notice}>{notice}</p>}
  {!session?<form className={`${s.card} ${s.login}`} onSubmit={e=>{e.preventDefault();run(async()=>{await loyaltyAuth('token?grant_type=password',{email,password});setPassword('');await loadBusinesses();});}}><span className={s.eyebrow}>İŞLETME GİRİŞİ</span><h1>Müşterilerinle bağını güçlendir.</h1><p className={s.muted}>Yetkilendirilmiş işletme hesabınla giriş yap.</p><label>E-posta<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Şifre<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className={s.full} disabled={busy}>Giriş yap</button><p className={s.qrNote}><Link href="/sadakat/isletme/demo">Örnek işletme panelini incele ↗</Link></p></form>:<>
   <section className={s.hero}><span className={s.eyebrow}>İŞLETME PANELİ</span><h1>{business?.name||'İşletmelerin'}</h1><p>Bekleyen damgaları onayla, ödülleri yönet, müşterilerini tanı.</p></section>
   {businesses.length>1&&<label>İşletme<select disabled={busy} value={businessId} onChange={e=>setBusinessId(e.target.value)}>{businesses.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>}
   {!business&&<div className={s.card}>Bu hesaba tanımlı işletme bulunamadı. DOKUNUVER yöneticisiyle iletişime geçin.</div>}
   {business&&<>
    <div className={s.stats}><div><strong>{data.customers.length}</strong><span>Son yüklenen müşteri</span></div><div><strong>{pending.length}</strong><span>Bekleyen damga</span></div><div><strong>{data.rewards.filter(r=>!r.redeemed_at).length}</strong><span>Yüklenen hazır ödül</span></div></div>
    <div className={s.row}><nav className={s.tabs} aria-label="Sadakat paneli">{[['queue','Kasa'],['customers','Müşteriler'],['history','İşlem geçmişi']].map(([key,label])=><button key={key} aria-pressed={tab===key} onClick={()=>setTab(key)}>{label}</button>)}</nav><button className={s.secondary} disabled={busy} onClick={()=>run(async()=>{if(demo)setNotice('Demo verileri gösteriliyor.');else await load(businessId);})}>Yenile</button></div>
    {tab==='queue'&&<div className={s.grid}>
     <section className={s.card}><h2>Damga onayı</h2><p className={s.muted}>Müşteriyi ve alışverişi kontrol ettikten sonra onayla. Talepler 5 dakika geçerlidir.</p><ul className={s.people}>{pending.map(q=><li className={s.person} key={q.id}><strong>{person(q.customer_id)?.name||'Kayıtlı müşteri'}</strong><p>{person(q.customer_id)?.phone||'Müşteri kimliğini kasada doğrulayın'} · {campaigns.find(c=>c.id===q.campaign_id)?.name}</p><p>Talep: {q.id.slice(0,8)} · Son saat: {new Date(q.expires_at).toLocaleTimeString('tr-TR')}</p><div className={s.actions}><button disabled={busy} onClick={()=>run(()=>act('approve',q.id))}>Alışverişi doğrula · +1</button><button disabled={busy} className={s.secondary} onClick={()=>run(()=>act('reject',q.id))}>Reddet</button></div></li>)}</ul>{!pending.length&&<p className={s.empty}>Onay bekleyen talep yok.</p>}</section>
     <section className={s.card}><h2>Hazır ödüller</h2><p className={s.muted}>Ödül tesliminde müşterinin kartıyla eşleştir. Kullandırma yetkisi işletme sahibindedir.</p>{data.rewards.filter(r=>!r.redeemed_at).map(r=><article className={s.reward} key={r.id}><strong>{person(r.customer_id)?.name||'Kayıtlı müşteri'}</strong><p>{r.label}</p><p className={s.small}>Ödül: {r.id.slice(0,8)}</p>{role==='owner'&&<button disabled={busy} onClick={()=>{if(demo||window.confirm('Ödülü müşteriye teslim ettiniz mi? Bu işlem ödülü kullanılmış olarak kaydeder.'))run(()=>act('redeem',r.id));}}>Ödülü teslim ettim</button>}</article>)}{!data.rewards.some(r=>!r.redeemed_at)&&<p className={s.empty}>Kullanılmayı bekleyen ödül yok.</p>}</section>
    </div>}
    {tab==='customers'&&<section className={s.card}><h2>Müşteriler</h2><p className={s.muted}>Son kayıt olan 100 müşteri üzerinden gösterilir. Filtreler bu listedeki kayıtları kapsar.</p><div className={s.toolbar}><input aria-label="Müşteri ara" placeholder="Ad veya telefon ara" value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Müşteri grubu" value={segment} onChange={e=>setSegment(e.target.value)}><option value="all">Tüm yüklenen müşteriler</option><option value="near">Ödülüne 1 damga kalanlar</option><option value="reward">Ödülü hazır olanlar</option><option value="inactive">30 gündür gelmeyenler</option><option value="consented">Kampanya iletişimi açık</option></select></div><ul className={s.people}>{visible.map(c=><li className={s.person} key={c.id}><div className={s.row}><strong>{c.name}</strong><span className={s.badge}>{c.marketing_opt_in?'WhatsApp tercihi açık':'Kampanya mesajı istemiyor'}</span></div><p>{c.phone} · Son damga: {date(c.last_visit_at)}</p><p>{data.balances.filter(b=>b.customer_id===c.id).map(b=>`${campaigns.find(p=>p.id===b.campaign_id)?.name||'Kampanya'}: ${b.stamps}/${b.target} (toplam ${b.total_stamps})`).join(' · ')||'Henüz damga yok'}</p></li>)}</ul>{!visible.length&&<p className={s.empty}>Bu filtrede müşteri yok.</p>}<p className={s.qrNote}>İletişim tercihleri kayıt altındadır. Bu pilot sürüm mesaj göndermez; WhatsApp gönderimi ayrı aşamada açılacaktır.</p></section>}
    {tab==='history'&&<section className={s.card}><h2>Son 100 damga işlemi</h2>{data.stamps.length?data.stamps.map(h=><div className={s.history} key={h.id}><strong>{person(h.customer_id)?.name||'Kayıtlı müşteri'} · +1 damga</strong><div>{new Date(h.created_at).toLocaleString('tr-TR')}</div><div className={s.muted}>Onaylayan kullanıcı: {h.actor_id}</div></div>):<p className={s.empty}>Henüz tamamlanmış damga yok.</p>}<h2 style={{marginTop:24}}>Son yüklenen ödüller</h2>{data.rewards.map(r=><div className={s.history} key={r.id}>{r.label} · {r.redeemed_at?`Kullanıldı: ${date(r.redeemed_at)}`:'Kullanılmadı'} · {person(r.customer_id)?.name||'Kayıtlı müşteri'}</div>)}</section>}
    <p className={s.footer}>Müşteri kartı: <Link href={demo?'/sadakat/demo':`/sadakat/${business.slug}`}>Kartı aç ↗</Link> · NFC ve QR için bu bağlantıyı kullanın.</p>
   </>}
  </>}
 </main>;
}
