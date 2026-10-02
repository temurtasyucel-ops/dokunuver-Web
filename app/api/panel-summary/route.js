import {requirePanelAdmin} from '../../../lib/admin-auth.mjs';
import {database,reply} from '../../../lib/panel-server';
export const dynamic='force-dynamic';
export async function GET(request){const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{return reply(await database('rpc/panel_business_summary',auth.user,{method:'POST',body:'{}'}));}catch(e){return reply({error:e.message},e.status||503);}}
