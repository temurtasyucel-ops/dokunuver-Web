import { createPanelClient } from './panel-client.mjs';
import { loyaltyError } from './loyalty.mjs';
let session;
const config=()=>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/,'');
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)throw new Error('Sadakat bağlantı ayarları henüz tamamlanmadı.');
 return {url,key};
};
function authClient(){
 if(!session)session=createPanelClient({storage:{getItem:k=>localStorage.getItem(k.replace('dokunuver_','loyalty_')),setItem:(k,v)=>localStorage.setItem(k.replace('dokunuver_','loyalty_'),v),removeItem:k=>localStorage.removeItem(k.replace('dokunuver_','loyalty_'))},fetchImpl:fetch,
  refresh:token=>{const {url,key}=config();return fetch(`${url}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:token})});},
  lock:fn=>navigator.locks?navigator.locks.request('loyalty-refresh',fn):fn()});
 return session;
}
async function parse(response){let data;try{data=await response.json();}catch{throw new Error('Sunucudan geçerli yanıt alınamadı.');}if(!response.ok)throw new Error(loyaltyError(data));return data;}
export async function loyaltyAuth(action,body){const {url,key}=config();const data=await parse(await fetch(`${url}/auth/v1/${action}`,{method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:JSON.stringify(body)}));if(data.access_token)authClient().store(data);return data;}
export const hasLoyaltySession=()=>!!localStorage.getItem('loyalty_access_token');
export function clearLoyaltySession(){authClient().clear();}
export async function loyaltyDB(path,body,anonymous=false){
 const {url,key}=config();const options={method:body===undefined?'GET':'POST',headers:{apikey:key,'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})};
 const endpoint=`${url}/rest/v1/${path}`;
 return parse(await (anonymous?fetch(endpoint,options):authClient().panelFetch(endpoint,options)));
}
export const loyaltyAction=(business,action,data={})=>loyaltyDB('rpc/loyalty_action',{p_business:business,p_action:action,p_data:data});
