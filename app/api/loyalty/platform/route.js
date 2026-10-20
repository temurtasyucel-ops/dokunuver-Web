import {requirePanelAdmin} from '../../../../lib/admin-auth.mjs';
import {database,reply} from '../../../../lib/panel-server.js';
import {parsePlatformQuery,parsePlatformSettings} from '../../../../lib/loyalty-platform.mjs';
export const dynamic='force-dynamic';
export async function GET(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{
  const q=parsePlatformQuery(new URL(request.url).searchParams);
  return reply(await database('rpc/loyalty_platform_list',auth.user,{method:'POST',body:JSON.stringify({p_actor:auth.user.id,p_search:q.search,p_state:q.state,p_page:q.page,p_size:25})}));
 }catch(e){return reply({error:e.message||'İşletme listesi alınamadı.'},e.status||400);}
}
export async function PATCH(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{
  const b=parsePlatformSettings(await request.json());
  return reply(await database('rpc/loyalty_platform_save',auth.user,{method:'POST',body:JSON.stringify({p_actor:auth.user.id,p_business:b.business_id,p_revision:b.revision,p_plan:b.plan,p_monthly_sms_limit:b.monthly_sms_limit,p_active:b.active})}));
 }catch(e){return reply({error:e.status?e.message:'Paket ve SMS limiti alanlarını kontrol edin.'},e.status||400);}
}
