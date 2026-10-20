import {parseMenuDocument,publishMenu,menuId} from './menu.mjs';
export const menuReply=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export async function menuUser(request,fetchImpl=fetch){
 const token=request.headers.get('authorization');if(!token?.startsWith('Bearer ')||!token.slice(7).trim())return {error:'İşletme hesabınıza giriş yapın.',status:401};
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return {error:'İşletme bağlantısı henüz yapılandırılmadı.',status:503};
 try{const r=await fetchImpl(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:token},cache:'no-store'});if(!r.ok)return {error:'Oturum geçersiz veya süresi dolmuş.',status:r.status===401||r.status===403?401:503};const user=await r.json();if(!user.id||!user.email_confirmed_at)return {error:'Doğrulanmış işletme hesabı gerekiyor.',status:403};return {user};}catch{return {error:'Oturum doğrulanamadı.',status:503};}
}
export async function menuRpc(name,args,fetchImpl=fetch){
 const base=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SECRET_KEY;
 if(!base||!key)throw new Error('Menü bağlantısı henüz yapılandırılmadı.');
 const r=await fetchImpl(`${base}/rest/v1/rpc/${name}`,{method:'POST',cache:'no-store',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify(args)});
 let data;try{data=await r.json();}catch{throw new Error('Menü servisi geçerli yanıt vermedi.');}
 if(!r.ok){const msg=data?.message||'';const message=msg.includes('REVISION_CONFLICT')?'Bu menü başka oturumda değişti. Düzenlemelerinizi not edip sayfayı yenileyin.':msg.includes('VERIFIED_OWNER_REQUIRED')?'Bu e-postayla doğrulanmış işletme hesabı bulunamadı.':msg.includes('MENU_ACCESS_REQUIRED')?'Bu işletmeye erişiminiz yok.':msg.includes('BUSINESS_PAUSED')?'İşletme erişimi duraklatılmış.':data?.code==='23505'?'Bu bağlantı adı zaten kullanılıyor.':['42P01','PGRST202'].includes(data?.code)?'Menü SQL kurulumu henüz tamamlanmadı.':'İşlem tamamlanamadı.';const e=new Error(message);e.status=msg.includes('MENU_ACCESS_REQUIRED')?403:409;throw e;}return data;
}
export async function saveMenuRequest(request,{getUser=menuUser,rpc=menuRpc}={}){
 const auth=await getUser(request);if(!auth.user)return menuReply({error:auth.error},auth.status);
 try{const body=await request.json(),business=menuId(body.business);if(!Number.isSafeInteger(body.revision)||body.revision<1||!['save','publish'].includes(body.action))throw new Error('Kayıt sürümü veya işlem geçersiz.');
 const draft=parseMenuDocument(body.document,{business,base:process.env.NEXT_PUBLIC_SUPABASE_URL});
 const published=body.action==='publish'?publishMenu(draft):null;
 return menuReply(await rpc('menu_save',{p_actor:auth.user.id,p_business:business,p_revision:body.revision,p_draft:draft,p_published:published}));
 }catch(e){return menuReply({error:e.message||'Menü kaydedilemedi.'},e.status||400);}
}
