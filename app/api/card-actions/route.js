import {requirePanelAdmin} from '../../../lib/admin-auth.mjs';
import {validateCardAction} from '../../../lib/orders.mjs';
import {database,reply} from '../../../lib/panel-server';
export async function POST(request){const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 if(process.env.VERCEL_ENV==='preview')return reply({error:'Önizlemede kart durumunu değiştirme kapalıdır.'},403);
 try{let input;try{input=validateCardAction(await request.json());}catch(e){return reply({error:e.message},400);}
 const count=await database('rpc/panel_set_card_active',auth.user,{method:'POST',body:JSON.stringify(input)});return reply({count});
 }catch(e){return reply({error:e.message},e.status||503);}}
