import 'server-only';
export const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export function panelHeaders(user){const key=process.env.SUPABASE_SECRET_KEY;return {apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json','x-panel-actor':user.id};}
export async function database(path,user,options={}){
 const r=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/${path}`,{...options,headers:{...panelHeaders(user),...options.headers},cache:'no-store'});
 let data;try{data=await r.json();}catch{throw new Error('Veritabanı geçerli yanıt vermedi.');}
 if(!r.ok){const conflict=['P0001','23505'].includes(data?.code);const e=new Error(['42P01','42703','PGRST202','PGRST204','PGRST205'].includes(data?.code)?'Panel SQL kurulumu eksik. İlgili kurulum dosyasını çalıştırın.':conflict?'Kayıt değişti veya bu işlem için uygun değil. Listeyi yenileyin.':'İşlem tamamlanamadı.');e.status=conflict?409:503;throw e;}
 return data;
}
