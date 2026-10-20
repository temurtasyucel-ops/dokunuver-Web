'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {panelFetch} from '../../lib/panel-client.mjs';
import {LOYALTY_PLANS} from '../../lib/loyalty-platform.mjs';
import s from './loyalty.module.css';
const samples=[{id:'00000000-0000-4000-8000-000000000001',name:'Pink Rose Cafe',slug:'pink-rose',active:true,plan_code:'pilot',monthly_sms_limit:0,revision:1,customer_count:38,active_campaigns:2},{id:'00000000-0000-4000-8000-000000000002',name:'Örnek Kahve',slug:'ornek-kahve',active:true,plan_code:'standard',monthly_sms_limit:250,revision:1,customer_count:124,active_campaigns:1},{id:'00000000-0000-4000-8000-000000000003',name:'Örnek Atölye',slug:'ornek-atolye',active:false,plan_code:'advanced',monthly_sms_limit:500,revision:1,customer_count:74,active_campaigns:1}];
export default function Platform({demo=false,refreshKey=0}){
 const [all,setAll]=useState(samples),[result,setResult]=useState({businesses:[],total:0,summary:{businesses:0,active:0,paused:0}});
 const [search,setSearch]=useState(''),[state,setState]=useState('all'),[page,setPage]=useState(1),[refresh,setRefresh]=useState(0),[editing,setEditing]=useState(null);
 const [loading,setLoading]=useState(true),[saving,setSaving]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 useEffect(()=>{
  let current=true;setLoading(true);setError('');
  const timer=setTimeout(async()=>{try{
   let next;
   if(demo){const matching=all.filter(b=>(state==='all'||(state==='active'?b.active:!b.active))&&`${b.name} ${b.slug}`.toLocaleLowerCase('tr').includes(search.trim().toLocaleLowerCase('tr')));next={businesses:matching.slice((page-1)*25,page*25),total:matching.length,summary:{businesses:all.length,active:all.filter(b=>b.active).length,paused:all.filter(b=>!b.active).length}};}
   else{const q=new URLSearchParams({search,state,page:String(page)});const r=await panelFetch('/api/loyalty/platform?'+q);next=await r.json();if(!r.ok)throw new Error(next.error||'İşletme listesi alınamadı.');}
   if(current)setResult(next);
  }catch(e){if(current){setError(e.message||'İşletme listesi alınamadı.');setResult({businesses:[],total:0,summary:{businesses:0,active:0,paused:0}});}}finally{if(current)setLoading(false);}},200);
  return()=>{current=false;clearTimeout(timer);};
 },[demo,all,search,state,page,refresh,refreshKey]);
 async function save(e){
  e.preventDefault();setSaving(true);setError('');setNotice('');
  const body={business_id:editing.id,revision:editing.revision,plan:editing.plan_code,monthly_sms_limit:editing.monthly_sms_limit,active:editing.active};
  try{
   if(demo)setAll(rows=>rows.map(b=>b.id===editing.id?{...b,...editing,revision:b.revision+1}:b));
   else{const r=await panelFetch('/api/loyalty/platform',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Ayarlar kaydedilemedi.');setRefresh(v=>v+1);}
   setNotice(demo?'Demo ayarları güncellendi. Gerçek paket, ödeme veya SMS gönderimi oluşmadı.':'İşletme ayarları kaydedildi. SMS gönderimi etkinleştirilmedi.');setEditing(null);
  }catch(e){setError(e.message||'Ayarlar kaydedilemedi.');}finally{setSaving(false);}
 }
 return <section className={s.root}><div className={demo?s.shell:''} style={demo?undefined:{padding:24,borderRadius:20}}>
  {demo&&<><header className={s.brand}><strong>DOKUNUVER</strong><span>PLATFORM YÖNETİMİ</span></header><p className={s.demo}>Yönetim önizlemesi · İşletmeler ve sayılar örnektir. Değişiklikler yalnız bu ekranda geçerlidir. <Link href="/sadakat/isletme/demo">İşletme paneli ↗</Link></p></>}
  <span className={s.eyebrow}>DOKUNUVER YÖNETİMİ</span><h1>Sadakat işletmeleri</h1><p className={s.muted}>İşletmelerin paketlerini ve planlanan doğrulama SMS limitlerini tek yerden yönet.</p>
  <p className={s.notice}>SMS sağlayıcısı henüz bağlı değil. Buradaki limitler hazırlık ayarıdır; gönderim ve kullanım ölçümü etkin değildir. Paket seçimi ödeme veya abonelik tahsilatı başlatmaz.</p>
  {error&&<p className={`${s.notice} ${s.error}`} role="alert">{error}</p>}{notice&&<p className={s.notice} role="status">{notice}</p>}
  <div className={s.stats}><div><strong>{result.summary.businesses}</strong><span>Toplam işletme</span></div><div><strong>{result.summary.active}</strong><span>Aktif</span></div><div><strong>{result.summary.paused}</strong><span>Duraklatılmış</span></div></div>
  <div className={s.toolbar}><input aria-label="İşletme ara" placeholder="İşletme adı veya bağlantı ara" value={search} maxLength={100} onChange={e=>{setSearch(e.target.value);setPage(1);}}/><select aria-label="İşletme durumu" value={state} onChange={e=>{setState(e.target.value);setPage(1);}}><option value="all">Tüm işletmeler</option><option value="active">Aktif işletmeler</option><option value="paused">Duraklatılmış işletmeler</option></select></div>
  {loading?<p className={s.empty} role="status">İşletmeler yükleniyor…</p>:<><p className={s.muted}>{result.total} işletme bulundu</p><div className={s.card}><ul className={s.people}>{result.businesses.map(b=><li className={s.person} key={b.id}><div className={s.row}><strong>{b.name}</strong><span className={s.badge}>{b.active?'Aktif':'Duraklatılmış'} · {LOYALTY_PLANS[b.plan_code]}</span></div><p>/{b.slug} · {b.customer_count} müşteri · {b.active_campaigns} aktif kampanya</p><p>Planlanan aylık doğrulama SMS limiti: <strong>{b.monthly_sms_limit}</strong></p><p>SMS kullanımı: bağlantı bekleniyor</p><div className={s.actions}><button disabled={saving} className={s.secondary} onClick={()=>{setEditing({...b});setError('');setNotice('');}}>Ayarlar · {b.name}</button>{!demo&&<Link href={`/sadakat/${b.slug}`} target="_blank" rel="noreferrer">Müşteri kartını aç ↗</Link>}</div></li>)}</ul>{!result.businesses.length&&<p className={s.empty}>Bu aramada işletme bulunamadı.</p>}</div></>}
  <div className={s.row}><span className={s.muted}>Sayfa {page} / {Math.max(1,Math.ceil(result.total/25))}</span><div className={s.actions}><button disabled={loading||page<=1} className={s.secondary} onClick={()=>setPage(v=>v-1)}>Önceki</button><button disabled={loading||page*25>=result.total} className={s.secondary} onClick={()=>setPage(v=>v+1)}>Sonraki</button><button disabled={loading} className={s.secondary} onClick={()=>setRefresh(v=>v+1)}>Listeyi yenile</button></div></div>
  {editing&&<form className={s.card} style={{marginTop:24}} onSubmit={save}><h2>{editing.name} · Paket ve erişim</h2><label>Paket<select aria-label="Paket" value={editing.plan_code} onChange={e=>setEditing(b=>({...b,plan_code:e.target.value}))}>{Object.entries(LOYALTY_PLANS).map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label><label>Aylık doğrulama SMS limiti<input type="number" min={0} max={1000000} step={1} required value={editing.monthly_sms_limit} onChange={e=>setEditing(b=>({...b,monthly_sms_limit:Number(e.target.value)}))}/></label><p className={s.muted}>0, SMS kotası ayrılmadığı anlamına gelir. Bu limit yalnız doğrulama SMS’i için planlanır; kampanya mesajları ayrı yönetilecek. Gönderim entegrasyonu tamamlanana kadar kullanım sayacı yoktur.</p><label className={s.check}><input type="checkbox" checked={editing.active} onChange={e=>setEditing(b=>({...b,active:e.target.checked}))}/>İşletme aktif</label>{!editing.active&&<p className={s.notice}>Kaydettiğinde müşteri sayfası ve işletmenin yeni işlemleri duraklatılır. Müşteri, damga ve ödül kayıtları silinmez.</p>}<div className={s.actions}><button disabled={saving}>{saving?'Kaydediliyor…':'İşletme ayarlarını kaydet'}</button><button disabled={saving} className={s.secondary} type="button" onClick={()=>setEditing(null)}>Vazgeç</button></div></form>}
 </div></section>;
}
