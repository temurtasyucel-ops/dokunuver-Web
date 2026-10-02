import {requirePanelAdmin} from '../../../lib/admin-auth.mjs';
import {database,reply} from '../../../lib/panel-server';
import {UUID,CARD_PRODUCTS} from '../../../lib/orders.mjs';
export const dynamic='force-dynamic';
export async function GET(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{const q=new URL(request.url).searchParams,id=q.get('order_id');if(!UUID.test(id||''))return reply({error:'Sipariş ID geçersiz.'},400);
 const order=(await database(`panel_orders?id=eq.${id}&select=*`,auth.user))[0];if(!order)return reply({error:'Sipariş bulunamadı.'},404);
 const links=await database(`panel_order_cards?order_id=eq.${id}&select=*&order=created_at.asc`,auth.user);
 return reply({order,links,can_write:process.env.VERCEL_ENV!=='preview'});
 }catch(e){return reply({error:e.message},e.status||503);}
}
export async function POST(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 if(process.env.VERCEL_ENV==='preview')return reply({error:'Önizlemede kart eşleştirme kapalıdır.'},403);
 try{let b;try{b=await request.json();}catch{return reply({error:'Geçersiz veri.'},400);}
 if(!b||!UUID.test(b.order_id||'')||!Number.isSafeInteger(b.revision)||b.revision<1||!['iban','smart'].includes(b.kind)||!['attach','detach'].includes(b.action)||!Array.isArray(b.codes)||b.codes.length<1||b.codes.length>100||new Set(b.codes).size!==b.codes.length||b.codes.some(c=>typeof c!=='string'||!/^[A-Z0-9]{6}$/.test(c))||b.action==='attach'&&!Object.hasOwn(CARD_PRODUCTS,b.product_id))return reply({error:'Sipariş, ürün veya kart seçimi geçersiz.'},400);
 const revision=await database('rpc/panel_order_card_change',auth.user,{method:'POST',body:JSON.stringify({p_order_id:b.order_id,p_revision:b.revision,p_kind:b.kind,p_product_id:b.product_id||'',p_codes:b.codes,p_attach:b.action==='attach'})});return reply({revision});
 }catch(e){return reply({error:e.status===409?'Kart başka siparişe bağlı, ürün/adet uygun değil veya sipariş değişti. Listeyi yenileyin.':e.message},e.status||503);}
}
