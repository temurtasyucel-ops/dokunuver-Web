import {requirePanelAdmin} from '../../../lib/admin-auth.mjs';
import {database,reply} from '../../../lib/panel-server';
export const dynamic='force-dynamic';
export async function GET(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{
  const q=new URL(request.url).searchParams,kind=q.get('kind')||'iban';
  if(!['iban','smart'].includes(kind))return reply({error:'Geçersiz kart türü.'},400);
  const params=new URLSearchParams({select:kind==='iban'?'code,business_name,status,active,batch_code,created_at':'code,business_name,status,active,batch_code,created_at,product_type',order:'created_at.desc,code.asc',limit:'100',offset:String(Math.floor(Math.max(0,Math.min(100000,Number(q.get('offset'))||0))))});
  if(q.get('status')){if(!['stock','assigned','locked','cancelled'].includes(q.get('status')))return reply({error:'Geçersiz durum.'},400);params.set('status',`eq.${q.get('status')}`);}
  if(q.get('active')){if(!['true','false'].includes(q.get('active')))return reply({error:'Geçersiz etkinlik.'},400);params.set('active',`eq.${q.get('active')}`);}
  if(q.get('product')&&kind==='smart'){if(!['google','instagram','whatsapp','ilan'].includes(q.get('product')))return reply({error:'Geçersiz ürün.'},400);params.set('product_type',`eq.${q.get('product')}`);}
  if(q.get('batch'))params.set('batch_code',`eq.${q.get('batch').slice(0,100)}`);
  if(q.get('search')){const term=q.get('search').slice(0,100).replace(/[^a-zA-Z0-9ığüşöçİĞÜŞÖÇ .-]/g,'');if(term)params.set('or',`(business_name.ilike.*${term}*,code.ilike.*${term}*)`);}
  const available=q.get('available')==='true';if(available)params.set('kind',`eq.${kind}`);
  return reply({cards:await database(`${available?'panel_available_cards':kind==='iban'?'iban_cards':'smart_links'}?${params}`,auth.user),can_write:process.env.VERCEL_ENV!=='preview'});
 }catch(e){return reply({error:e.message},e.status||503);}
}
