import {parseNfcProof,verifyNfcProof,nfcKeyConfig} from './loyalty-nfc.mjs';
const reply=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function handleNfcClaim(request,{database,fetchImpl=fetch,env=process.env}){
 if(env.LOYALTY_SECURE_NFC_ENABLED!=='true')return reply({error:'Güvenli NFC henüz etkinleştirilmedi.'},503);
 const token=request.headers.get('authorization');
 if(!token?.startsWith('Bearer '))return reply({error:'Önce sadakat hesabınıza giriş yapın.'},401);
 try{
  const url=env.NEXT_PUBLIC_SUPABASE_URL,key=env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const auth=await fetchImpl(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:token},cache:'no-store'});
  if(!auth.ok)return reply({error:'Sadakat oturumunuzu yeniden açın.'},401);
  const user=await auth.json();if(!user?.id||!user.phone_confirmed_at)return reply({error:'Telefon doğrulaması gerekiyor.'},403);
  const proof=parseNfcProof(await request.json());
  const tag=await database('rpc/loyalty_nfc_lookup',user,{method:'POST',body:JSON.stringify({p_tag:proof.tag})});
  if(!tag)throw new Error('INVALID_NFC');
  const config=nfcKeyConfig(tag.key_ref,env);if(config.uid?.toUpperCase()!==tag.uid)throw new Error('INVALID_NFC');
  const verified=verifyNfcProof(proof,config);
  const result=await database('rpc/loyalty_nfc_claim',user,{method:'POST',body:JSON.stringify({p_actor:user.id,p_tag:proof.tag,p_uid:verified.uid,p_counter:verified.counter})});
  return reply(result);
 }catch(e){
  return reply({error:e.message==='NFC_DISABLED'?'Güvenli NFC henüz etkinleştirilmedi.':'Damga eklenemedi. Kart okunmuş olabilir, bekleme/günlük sınırına ulaşılmış olabilir veya bu işletmede üyeliğiniz bulunmayabilir. Üyelik kartınızı kontrol edip kasada yeniden dokunun.'},e.message==='NFC_DISABLED'?503:409);
 }
}
