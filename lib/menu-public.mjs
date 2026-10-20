export async function getPublicMenu(slug){
 const base=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!base||!key)return null;
 const r=await fetch(`${base}/rest/v1/rpc/menu_public`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({p_slug:slug}),cache:'no-store'});
 if(!r.ok)throw new Error('Menü servisine ulaşılamadı.');return r.json();
}
