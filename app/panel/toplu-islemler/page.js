"use client";
import {useEffect,useRef,useState} from 'react';
import JSZip from 'jszip';
import {panelFetch} from '../../../lib/panel-client.mjs';
import styles from '../operations.module.css';
const statuses={stock:'Stok',assigned:'Atandı',locked:'Kilitli',cancelled:'İptal'};
const products={google:'Google Yorum',instagram:'Instagram',whatsapp:'WhatsApp',ilan:'İlan'};
const filters={search:'',batch:'',status:'',active:'',product:''};
export default function Bulk(){
 const [kind,setKind]=useState('iban'),[form,setForm]=useState(filters),[applied,setApplied]=useState(filters),[offset,setOffset]=useState(0),[rows,setRows]=useState([]),[selected,setSelected]=useState({}),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[retry,setRetry]=useState(0),[canWrite,setCanWrite]=useState(false);
 const cancel=useRef(false),controller=useRef(null);
 useEffect(()=>{let alive=true;setLoading(true);setError('');panelFetch('/api/panel-cards?'+new URLSearchParams({...applied,kind,offset:String(offset)})).then(read).then(data=>{if(alive){setRows(data.cards);setCanWrite(data.can_write);}}).catch(e=>{if(alive)setError(e.message);}).finally(()=>{if(alive)setLoading(false);});return()=>{alive=false;};},[kind,applied,offset,retry]);
 useEffect(()=>()=>{cancel.current=true;controller.current?.abort();},[]);
 const cards=Object.values(selected);
 function choose(row,checked){setSelected(old=>{const next={...old};if(checked){if(Object.keys(next).length>=100&&!next[row.code])return old;next[row.code]=row;}else delete next[row.code];return next;});}
 async function action(active){
  if(!window.confirm(`${cards.length} seçili kart ${active?'aktif':'pasif'} yapılacak. Kodlar: ${cards.map(c=>c.code).join(', ')}. Devam edilsin mi?`))return;
  setBusy(true);setError('');setNotice('');
  try{const data=await read(await panelFetch('/api/card-actions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,codes:cards.map(c=>c.code),active})}));setNotice(`${data.count} kart güncellendi.`);setSelected({});setRetry(n=>n+1);}catch(e){setError(e.message);}finally{setBusy(false);}
 }
 async function download(){setBusy(true);setError('');cancel.current=false;controller.current=new AbortController();
  try{const zip=new JSZip();for(let i=0;i<cards.length;i++){
   if(cancel.current)throw new Error('İndirme iptal edildi. Eksik ZIP oluşturulmadı.');
   setNotice(`Baskı hazırlanıyor: ${i+1}/${cards.length}`);
   const r=await panelFetch(`/api/${kind==='iban'?'print-iban':'print-card'}/${cards[i].code}`,{cache:'no-store',signal:controller.current.signal});
   if(!r.ok){let message;try{message=(await r.json()).error;}catch{}throw new Error(message||`${cards[i].code} baskısı oluşturulamadı.`);}
   if(!r.headers.get('content-type')?.startsWith('image/png'))throw new Error('Baskı servisi geçersiz dosya döndürdü.');
   zip.file(`DOKUNUVER-${kind.toUpperCase()}-${cards[i].code}.png`,await r.blob());
  }
  const blob=await zip.generateAsync({type:'blob'});if(cancel.current)throw new Error('İndirme iptal edildi.');
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`DOKUNUVER-secili-${kind}-${cards.length}.zip`;a.click();setTimeout(()=>URL.revokeObjectURL(url),30000);setNotice(`${cards.length} baskı görseli indirildi.`);
  }catch(e){setError(e.name==='AbortError'?'İndirme iptal edildi. Eksik ZIP oluşturulmadı.':e.message);setNotice('');}finally{setBusy(false);controller.current=null;}
 }
 return <main className={styles.page}><div className={styles.hero}><h1>Seçili kartlarla işlemler</h1><p>Filtrele, en fazla 100 kart seç ve baskılarını indir veya kullanım durumunu değiştir.</p></div>
 {error&&<div role="alert" className={styles.error}>{error}<button onClick={()=>setRetry(n=>n+1)}>Tekrar dene</button></div>}{notice&&<div role="status" className={styles.notice}>{notice}</div>}
 <section className={styles.card}><fieldset disabled={busy}><div className={styles.grid}>
 <label className={styles.field}>Kart türü<select aria-label="Kart türü" value={kind} onChange={e=>{if(cards.length&&!window.confirm('Tür değişince mevcut seçim temizlenecek. Devam edilsin mi?'))return;setKind(e.target.value);setSelected({});setOffset(0);setForm(filters);setApplied(filters);}}><option value="iban">IBAN</option><option value="smart">Smart Links</option></select></label>
 <Filter label="Müşteri veya kod" value={form.search} onChange={v=>setForm({...form,search:v})}/><Filter label="Parti kodu (tam eşleşme)" value={form.batch} onChange={v=>setForm({...form,batch:v})}/>
 <Select label="Üretim durumu" value={form.status} options={statuses} onChange={v=>setForm({...form,status:v})}/><Select label="Kullanım durumu" value={form.active} options={{true:'Aktif',false:'Pasif'}} onChange={v=>setForm({...form,active:v})}/>
 {kind==='smart'&&<Select label="Ürün" value={form.product} options={products} onChange={v=>setForm({...form,product:v})}/>}</div><div className={styles.actions}><button onClick={()=>{setApplied({...form});setOffset(0);}}>Filtrele</button><button onClick={()=>{setForm(filters);setApplied(filters);setOffset(0);}}>Filtreleri Temizle</button></div></fieldset></section>
 <section className={styles.card}><h2>Seçili: {cards.length}/100</h2><p className={styles.muted}>Seçimler filtre ve sayfa değişiminde korunur. İşlem yalnızca aşağıdaki seçili kodlara uygulanır. Stok veya iptal kartları aktifleştirilemez; kilit ve müşteri bilgileri değişmez.</p>
 {cards.length>0&&<details><summary>Seçili kodları göster</summary><p>{cards.map(c=>c.code).join(' · ')}</p></details>}
 {!canWrite&&<p className={styles.muted}>Önizlemede aktif/pasif değişiklikleri kapalıdır. Baskı indirme kullanılabilir.</p>}
 <div className={styles.actions}><button disabled={busy||loading||!rows.length} onClick={()=>setSelected(old=>{const next={...old};for(const row of rows)if(Object.keys(next).length<100)next[row.code]=row;return next;})}>Bu Sayfadan Seç (100 sınırı)</button><button disabled={busy||!cards.length} onClick={()=>setSelected({})}>Seçimi Temizle</button><button className={styles.primary} disabled={busy||!cards.length} onClick={download}>Seçili Baskıları ZIP İndir</button><button disabled={busy||!cards.length||!canWrite} onClick={()=>action(true)}>Aktif Yap</button><button disabled={busy||!cards.length||!canWrite} onClick={()=>action(false)}>Pasif Yap</button>{busy&&controller.current&&<button onClick={()=>{cancel.current=true;controller.current?.abort();}}>İndirmeyi İptal Et</button>}</div>
 {loading?<p>Yükleniyor…</p>:error?null:!rows.length?<p>Kart bulunamadı.</p>:rows.map(row=><div key={row.code} className={styles.row}><label className={styles.check}><input aria-label={`${row.code} seç`} type="checkbox" disabled={busy||(!selected[row.code]&&cards.length>=100)} checked={!!selected[row.code]} onChange={e=>choose(row,e.target.checked)}/><span><strong>{row.code} · {row.business_name||'Atanmamış kart'}</strong><p>{statuses[row.status]||row.status} · {row.active?'Aktif':'Pasif'} · {row.batch_code||'Parti yok'}{row.product_type?` · ${products[row.product_type]||row.product_type}`:''}</p></span></label><a className={styles.link} href={`/panel/islem-gecmisi?entity=${kind==='iban'?'iban_cards':'smart_links'}&ref=${row.code}`}>Geçmiş</a></div>)}
 <div className={styles.paging}><button disabled={busy||loading||!offset} onClick={()=>setOffset(n=>Math.max(0,n-100))}>Önceki</button><span>Sayfa {offset/100+1}</span><button disabled={busy||loading||rows.length<100} onClick={()=>setOffset(n=>n+100)}>Sonraki</button></div></section></main>;
}
async function read(r){const data=await r.json();if(!r.ok)throw new Error(data.error||'Kartlar alınamadı.');return data;}
function Filter({label,value,onChange}){return <label className={styles.field}>{label}<input value={value} onChange={e=>onChange(e.target.value)}/></label>;}
function Select({label,value,onChange,options}){return <label className={styles.field}>{label}<select aria-label={label} value={value} onChange={e=>onChange(e.target.value)}><option value="">Tümü</option>{Object.entries(options).map(([id,name])=><option key={id} value={id}>{name}</option>)}</select></label>;}
