'use client';
import {useState} from 'react';
import Link from 'next/link';
import {panelFetch} from '../../../lib/panel-client.mjs';
export default function LoyaltySetup(){
 const [error,setError]=useState(''),[result,setResult]=useState(null),[busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setBusy(true);setError('');setResult(null);const form=new FormData(e.currentTarget);
  try{const r=await panelFetch('/api/loyalty/provision',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({slug:form.get('slug'),name:form.get('name'),campaign:form.get('campaign'),reward:form.get('reward'),target:Number(form.get('target'))})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Kurulum tamamlanamadı.');setResult(d);}catch(e){setError(e.message);}finally{setBusy(false);}
 }
 return <main style={{maxWidth:720}}><h1>Dijital Sadakat · Pilot</h1><p>Sadakat işletmesi ve ilk kampanyasını oluşturun. Pilot işletmenin sahibi, bu işlemi yapan yönetici hesabıdır.</p><p><Link href="/sadakat/demo" target="_blank">Müşteri önizlemesi ↗</Link> · <Link href="/sadakat/isletme/demo" target="_blank">İşletme önizlemesi ↗</Link></p><p>Canlı kullanım için sadakat SQL kurulumu ve Supabase SMS doğrulaması tamamlanmalıdır.</p>
 {error&&<p role="alert" style={{color:'#b42318'}}>{error}</p>}
 {result&&<div role="status" style={{padding:20,background:'#e8f5ee',borderRadius:12}}>İşletme oluşturuldu. <Link href={`/sadakat/${result.slug}`}>Müşteri kartı ↗</Link> · <Link href="/sadakat/isletme">İşletme girişi ↗</Link></div>}
 <form onSubmit={submit} style={{display:'grid',gap:16,marginTop:24}}>{[['name','İşletme adı','Pink Rose Cafe'],['slug','Bağlantı adı','pink-rose'],['campaign','Kampanya adı','Cookie molası'],['reward','Ödül açıklaması','1 cookie ikramı']].map(([name,label,placeholder])=><label key={name} style={{display:'grid',gap:6}}>{label}<input name={name} placeholder={placeholder} required minLength={2} maxLength={name==='slug'?60:80} pattern={name==='slug'?'[a-z0-9][a-z0-9-]{2,59}':undefined} style={{padding:12,border:'1px solid #d0d5dd',borderRadius:10}}/></label>)}<label>Ödül için gereken damga <input name="target" type="number" defaultValue={5} min={2} max={30} required/></label><p>Varsayılan günlük sınır müşteri başına 1 damgadır. Ödül hedefi ilk pilotta sabittir.</p><button disabled={busy} style={{padding:14,background:'#087cf0',color:'white',border:0,borderRadius:10}}>{busy?'Oluşturuluyor…':'Pilot işletme oluştur'}</button></form>
 </main>;
}
