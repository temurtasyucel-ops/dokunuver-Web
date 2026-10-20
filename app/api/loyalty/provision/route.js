import { requirePanelAdmin } from '../../../../lib/admin-auth.mjs';
import { database,reply } from '../../../../lib/panel-server.js';
export const dynamic='force-dynamic';
export async function POST(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{
  const body=await request.json();
  const {slug,name,campaign,reward,target}=body;
  if(typeof slug!=='string'||!/^[a-z0-9][a-z0-9-]{2,59}$/.test(slug)||['demo','isletme'].includes(slug)||![name,campaign,reward].every(x=>typeof x==='string'&&x.trim().length>=2&&x.trim().length<=80)||!Number.isInteger(target)||target<2||target>30)return reply({error:'İşletme ve kampanya alanlarını kontrol edin. demo ve isletme bağlantı adları kullanılamaz.'},400);
  const id=await database('rpc/loyalty_provision',auth.user,{method:'POST',body:JSON.stringify({p_actor:auth.user.id,p_slug:slug,p_name:name.trim(),p_campaign:campaign.trim(),p_reward:reward.trim(),p_target:target})});
  return reply({id,slug},201);
 }catch(e){return reply({error:e.status?e.message:'İşletme oluşturulamadı. Alanları kontrol edin.'},e.status||400);}
}
