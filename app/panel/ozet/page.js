"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {panelFetch} from '../../../lib/panel-client.mjs';
import {ORDER_STATUSES} from '../../../lib/orders.mjs';
import {money} from '../../../lib/site-content.mjs';
import {UNITS} from '../../../lib/inventory.mjs';
import styles from '../operations.module.css';
export default function Summary(){const [data,setData]=useState(null),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{let alive=true;setError('');panelFetch('/api/panel-summary').then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Özet alınamadı.');return d;}).then(d=>{if(alive)setData(d);}).catch(e=>{if(alive)setError(e.message);});return()=>{alive=false;};},[retry]);
 return <main className={styles.page}><div className={styles.hero}><h1>İşletme özeti</h1><p>Sipariş, ödeme ve üretim için güncel durum.</p><button onClick={()=>setRetry(n=>n+1)}>Özeti Yenile</button></div>{error&&<div role="alert" className={styles.error}>{error}</div>}{!data&&!error?<p>Yükleniyor…</p>:data&&<>
 <div className={styles.grid}><Tile title="Hazırlık / teslimat bekleyen" value={data.orders.pending} href="/panel/siparisler"/><Tile title="Kargoda" value={data.orders.shipped} href="/panel/siparisler?status=shipped"/><Tile title="Ödeme bekleyen sipariş" value={data.orders.unpaid} href="/panel/siparisler?payment=outstanding"/><Tile title="Toplam kalan ödeme" value={money(data.orders.remaining)} href="/panel/siparisler?payment=outstanding"/></div>
 <section className={styles.card}><h2>Sıradaki işler</h2><p className={styles.muted}>En eski 10 açık sipariş. Tüm siparişler için Siparişler bölümünü aç.</p>{!data.queue.length?<p>Bekleyen iş yok.</p>:data.queue.map(o=><div className={styles.row} key={o.id}><div><strong>DK-{o.order_no} · {o.customer_name}</strong><p>{ORDER_STATUSES[o.status]} · {new Date(o.created_at).toLocaleDateString('tr-TR',{timeZone:'Europe/Istanbul'})}</p></div><Link className={styles.link} href={`/panel/siparisler/${o.id}/kartlar`}>Kartları Eşleştir</Link></div>)}<Link href="/panel/siparisler">Tüm siparişler →</Link></section>
 <section className={styles.card}><h2>Kritik malzemeler ({data.low_stock_count})</h2>{!data.low_stock.length?<p>Aktif malzemelerde kritik stok yok.</p>:data.low_stock.map(i=><div className={styles.row} key={i.id}><div><strong>{i.name}</strong><p>{i.quantity} {UNITS[i.unit]} · Kritik seviye: {i.low_stock_threshold}</p></div></div>)}<Link href="/panel/stok">Malzeme stoklarını aç →</Link></section>
 <section className={styles.card}><h2>Siparişe ayrılmamış NFC stok kartları</h2><div className={styles.grid}><Tile title="IBAN" value={data.card_stock.iban} href="/panel/toplu-islemler"/>{Object.entries(data.card_stock.smart).map(([type,n])=><Tile key={type} title={({google:'Google Yorum',instagram:'Instagram',whatsapp:'WhatsApp',ilan:'İlan'})[type]||type} value={n} href="/panel/smart-links"/>)}</div><p className={styles.muted}>Buradaki miktarlar NFC kod kayıtlarıdır. Fiziksel malzeme sayımı Stok bölümünde ayrıca tutulur.</p></section></>}
 </main>;
}
function Tile({title,value,href}){return <Link href={href} className={styles.card} style={{display:'block',textDecoration:'none',color:'inherit'}}><p className={styles.muted}>{title}</p><strong className={styles.total}>{value}</strong></Link>;}
