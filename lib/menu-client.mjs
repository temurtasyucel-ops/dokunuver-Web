import {createPanelClient} from './panel-client.mjs';
import {loginToPanel} from './panel-login.mjs';
let client;
function session(){if(!client)client=createPanelClient({storage:{getItem:k=>localStorage.getItem(k.replace('dokunuver_','menu_')),setItem:(k,v)=>localStorage.setItem(k.replace('dokunuver_','menu_'),v),removeItem:k=>localStorage.removeItem(k.replace('dokunuver_','menu_'))},fetchImpl:fetch,lock:fn=>navigator.locks?navigator.locks.request('menu-refresh',fn):fn(),refresh:token=>fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:token})})});return client;}
export async function menuLogin(email,password){const data=await loginToPanel({url:process.env.NEXT_PUBLIC_SUPABASE_URL,key:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,email,password});session().store(data);}
export const menuLogout=()=>session().clear();
export const menuSession=()=>!!localStorage.getItem('menu_access_token');
export async function menuFetch(path,options={}){const r=await session().panelFetch(path,options);let d;try{d=await r.json();}catch{throw new Error('Sunucudan geçerli yanıt alınamadı.');}if(!r.ok)throw new Error(d.error||'İşlem tamamlanamadı.');return d;}
