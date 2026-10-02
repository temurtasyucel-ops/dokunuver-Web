import {requirePanelAdmin} from '../../../lib/admin-auth.mjs';
import {database,reply} from '../../../lib/panel-server';
export const dynamic='force-dynamic';
export async function GET(request){const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{const q=new URL(request.url).searchParams;const params=new URLSearchParams({select:'*',order:'id.desc',limit:'100',offset:String(Math.max(0,Math.min(100000,Math.floor(Number(q.get('offset'))||0))))});
 if(q.get('entity')){if(!['iban_cards','smart_links','site_content','panel_orders','panel_order_cards','panel_inventory','panel_stock_moves'].includes(q.get('entity')))return reply({error:'Geçersiz alan.'},400);params.set('entity',q.get('entity')==='panel_orders'?'in.(panel_orders,panel_order_cards)':`eq.${q.get('entity')}`);}
 if(q.get('ref')){if(!/^[A-Za-z0-9-]{1,80}$/.test(q.get('ref')))return reply({error:'Geçersiz kayıt kodu.'},400);params.set('ref',`eq.${q.get('ref')}`);}
 return reply({events:await database(`panel_events?${params}`,auth.user)});
 }catch(e){return reply({error:e.message},e.status||503);}}
