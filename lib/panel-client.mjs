export function createPanelClient({storage,fetchImpl,refresh,notify=()=>{},lock=fn=>fn(),now=Date.now}) {
 let refreshing;
 const access=()=>storage.getItem('dokunuver_access_token');
 const clear=()=>{storage.removeItem('dokunuver_access_token');storage.removeItem('dokunuver_refresh_token');storage.removeItem('dokunuver_expires_at');notify();};
 const store=data=>{if(!data?.access_token||!data?.refresh_token)throw new Error('Geçerli oturum oluşturulamadı.');storage.setItem('dokunuver_access_token',data.access_token);storage.setItem('dokunuver_refresh_token',data.refresh_token);storage.setItem('dokunuver_expires_at',String(now()+(data.expires_in||3600)*1000));};
 async function renew(failedToken){
  if(refreshing)return refreshing;
  refreshing=lock(async()=>{
   if(failedToken&&access()&&access()!==failedToken)return access();
   const token=storage.getItem('dokunuver_refresh_token');if(!token){clear();throw new Error('Oturum sona erdi. Yeniden giriş yapın.');}
   const response=await refresh(token);let data;try{data=await response.json();}catch{throw new Error('Oturum servisi geçerli yanıt vermedi. Tekrar deneyin.');}
   if(!response.ok){if(response.status===400||response.status===401){clear();throw new Error('Oturum sona erdi. Yeniden giriş yapın.');}throw new Error('Oturum yenilenemedi. Tekrar deneyin.');}
   if(storage.getItem('dokunuver_refresh_token')!==token){if(access())return access();throw new Error('Oturum kapatıldı.');}
   store(data);return data.access_token;
  });
  try{return await refreshing;}finally{refreshing=undefined;}
 }
 async function panelFetch(url,options={}){
  let token=access();const expires=Number(storage.getItem('dokunuver_expires_at'));
  if(token&&expires&&expires<now()+60000)token=await renew(token);
  const send=t=>{const headers=new Headers(options.headers);headers.set('Authorization',`Bearer ${t||''}`);return fetchImpl(url,{...options,headers});};
  const response=await send(token);if(response.status!==401)return response;
  token=await renew(token);const retry=await send(token);if(retry.status===401)clear();return retry;
 }
 return {panelFetch,store,clear,renew};
}
let client;
export function panelClient(){
 if(!client)client=createPanelClient({storage:localStorage,fetchImpl:fetch,notify:()=>window.dispatchEvent(new Event('dokunuver-session-ended')),
 lock:fn=>navigator.locks?navigator.locks.request('dokunuver-session-refresh',fn):fn(),
 refresh:token=>fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL?.trim().replace(/\/+$/,'')}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:token})})});
 return client;
}
export const panelFetch=(url,options)=>panelClient().panelFetch(url,options);
