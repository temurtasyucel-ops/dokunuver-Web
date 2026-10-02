import {requirePanelAdmin} from '../../../lib/admin-auth.mjs';
import {readSiteContent} from '../../../lib/site-content-server';
import {buildOrder} from '../../../lib/orders.mjs';
import {database,reply} from '../../../lib/panel-server';
export const dynamic='force-dynamic';
export async function GET(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{const q=new URL(request.url).searchParams;const offset=Math.max(0,Math.min(100000,Number(q.get('offset'))||0));const params=new URLSearchParams({select:'*',order:'order_no.desc',limit:'100',offset:String(Math.floor(offset))});
 if(q.get('status')){if(!['new','preparing','ready','shipped','delivered','cancelled'].includes(q.get('status')))return reply({error:'Geçersiz durum.'},400);params.set('status',`eq.${q.get('status')}`);}
 if(q.get('search'))params.set('customer_name',`ilike.*${q.get('search').slice(0,120).replace(/[*,%]/g,'')}*`);
 return reply({orders:await database(`panel_orders?${params}`,auth.user),can_write:process.env.VERCEL_ENV!=='preview'});
 }catch(e){return reply({error:e.message},e.status||503);}
}
async function write(request,create){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 if(process.env.VERCEL_ENV==='preview')return reply({error:'Önizlemede sipariş kaydetme kapalıdır.'},403);
 try{let body;try{body=await request.json();}catch{return reply({error:'Geçersiz sipariş verisi.'},400);}
 let previous;
 if(!create){if(!/^[0-9a-f-]{36}$/.test(body.id||'')||!Number.isSafeInteger(body.revision))return reply({error:'Sipariş sürümü geçersiz.'},400);
 previous=(await database(`panel_orders?id=eq.${body.id}&select=*`,auth.user))[0];if(!previous)return reply({error:'Sipariş bulunamadı.'},404);
 if(previous.revision!==body.revision)return reply({error:'Sipariş başka bir oturumda değişti. Listeyi yenileyin.'},409);}
 let order;try{order=buildOrder(body, (await readSiteContent()).content,previous);}catch(e){return reply({error:e.message},400);}
 const data=await database(create?'panel_orders':`panel_orders?id=eq.${body.id}&revision=eq.${body.revision}`,auth.user,{method:create?'POST':'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify({...order,revision:create?1:body.revision+1,updated_at:new Date().toISOString()})});
 if(!data.length)return reply({error:'Sipariş değişti. Listeyi yenileyin.'},409);return reply({order:data[0]},create?201:200);
 }catch(e){return reply({error:e.message||'Sipariş kaydedilemedi.'},e.status||503);}
}
export const POST=request=>write(request,true);
export const PATCH=request=>write(request,false);
