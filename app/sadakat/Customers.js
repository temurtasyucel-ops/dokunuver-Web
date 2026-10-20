'use client';
import {useEffect,useState} from 'react';
import {loyaltyDB} from '../../lib/loyalty-client.mjs';
import {segmentCustomers} from '../../lib/loyalty.mjs';
import s from './loyalty.module.css';
const date=v=>v?new Date(v).toLocaleDateString('tr-TR'):'Henüz yok';
export default function Customers({businessId,demo,data,campaigns}){
 const [search,setSearch]=useState(''),[segment,setSegment]=useState('all'),[page,setPage]=useState(1),[reload,setReload]=useState(0);
 const [result,setResult]=useState({customers:[],total:0}),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{
  let current=true;setBusy(true);setError('');
  const timer=setTimeout(async()=>{try{
   let next;
   if(demo){
    const rows=segmentCustomers(data.customers,data.balances.filter(b=>campaigns.find(c=>c.id===b.campaign_id)?.active!==false),data.rewards,segment).filter(c=>`${c.name} ${c.phone}`.toLocaleLowerCase('tr').includes(search.trim().toLocaleLowerCase('tr')));
    next={total:rows.length,customers:rows.slice((page-1)*25,page*25).map(c=>({...c,balances:data.balances.filter(b=>b.customer_id===c.id).map(b=>({...b,campaign_name:campaigns.find(p=>p.id===b.campaign_id)?.name}))}))};
   }else next=await loyaltyDB('rpc/loyalty_customer_page',{p_business:businessId,p_search:search,p_segment:segment,p_page:page,p_size:25});
   if(current)setResult(next);
  }catch(e){if(current){setError(e.message);setResult({customers:[],total:0});}}finally{if(current)setBusy(false);}},250);
  return()=>{current=false;clearTimeout(timer);};
 },[businessId,demo,data,campaigns,search,segment,page,reload]);
 const pages=Math.max(1,Math.ceil(result.total/25));
 return <section className={s.card}><div className={s.row}><h2>Müşteriler</h2><button className={s.secondary} disabled={busy} onClick={()=>setReload(v=>v+1)}>Listeyi yenile</button></div><p className={s.muted}>Arama ve gruplar işletmenin tüm müşteri kayıtlarını kapsar. Her sayfada 25 kayıt gösterilir.</p><div className={s.toolbar}><input aria-label="Müşteri ara" placeholder="Ad veya telefon ara" value={search} maxLength={100} onChange={e=>{setSearch(e.target.value);setPage(1);}}/><select aria-label="Müşteri grubu" value={segment} onChange={e=>{setSegment(e.target.value);setPage(1);}}><option value="all">Tüm müşteriler</option><option value="near">Ödülüne 1 damga kalanlar</option><option value="reward">Ödülü hazır olanlar</option><option value="inactive">30 gündür gelmeyenler</option><option value="consented">Kampanya iletişimi açık</option></select></div>
  {error&&<p role="alert" className={`${s.notice} ${s.error}`}>{error}</p>}
  {busy?<p className={s.empty} role="status">Müşteriler yükleniyor…</p>:<><p className={s.muted}>{result.total} müşteri bulundu</p><ul className={s.people}>{result.customers.map(c=><li className={s.person} key={c.id}><div className={s.row}><strong>{c.name}</strong><span className={s.badge}>{c.marketing_opt_in?'WhatsApp tercihi açık':'Kampanya mesajı istemiyor'}</span></div><p>{c.phone} · Son damga: {date(c.last_visit_at)}</p><p>{c.balances.map(b=>`${b.campaign_name}: ${b.stamps}/${b.target} (toplam ${b.total_stamps})`).join(' · ')||'Henüz damga yok'}</p></li>)}</ul>{!result.customers.length&&<p className={s.empty}>Bu filtrede müşteri yok.</p>}</>}
  <div className={s.row}><span className={s.muted}>Sayfa {page} / {pages}</span><div className={s.actions}><button className={s.secondary} disabled={busy||page<=1} onClick={()=>setPage(v=>v-1)}>Önceki</button><button className={s.secondary} disabled={busy||page>=pages} onClick={()=>setPage(v=>v+1)}>Sonraki</button></div></div>
  <p className={s.qrNote}>İletişim tercihleri kayıt altındadır. Kampanya gönderimi bu sürümde kapalıdır.</p>
 </section>;
}
