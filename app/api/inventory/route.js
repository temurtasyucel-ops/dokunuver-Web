import {requirePanelAdmin} from '../../../lib/admin-auth.mjs';
import {database,reply} from '../../../lib/panel-server';
import {inventoryItem,stockAmount} from '../../../lib/inventory.mjs';
import {UUID} from '../../../lib/orders.mjs';
export const dynamic='force-dynamic';
export async function GET(request){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{const q=new URL(request.url).searchParams;const offset=Math.floor(Math.max(0,Math.min(100000,Number(q.get('offset'))||0)));
 if(q.get('id')){if(!UUID.test(q.get('id')))return reply({error:'Malzeme ID geçersiz.'},400);return reply({moves:await database(`panel_stock_moves?inventory_id=eq.${q.get('id')}&select=*&order=created_at.desc&limit=100&offset=${offset}`,auth.user)});}
 return reply({items:await database(`panel_inventory?select=*&order=name.asc,id.asc&limit=100&offset=${offset}`,auth.user),can_write:process.env.VERCEL_ENV!=='preview'});
 }catch(e){return reply({error:e.message},e.status||503);}
}
async function write(request,edit){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 if(process.env.VERCEL_ENV==='preview')return reply({error:'Önizlemede stok kaydetme kapalıdır.'},403);
 try{let b;try{b=await request.json();}catch{return reply({error:'Geçersiz stok verisi.'},400);}
 if(b?.action==='move'&&!edit){
  let delta;try{delta=stockAmount(b.delta);if(!delta||!UUID.test(b.id||'')||!UUID.test(b.inventory_id||'')||typeof b.note!=='string'||!b.note.trim()||b.note.length>200)throw Error('Stok hareketi, miktar ve açıklama gereklidir.');}catch(e){return reply({error:e.message},400);}
  return reply({item:await database('rpc/panel_stock_change',auth.user,{method:'POST',body:JSON.stringify({p_id:b.id,p_inventory_id:b.inventory_id,p_delta:delta,p_note:b.note})})});
 }
 let item;try{item=inventoryItem(b);}catch(e){return reply({error:e.message},400);}
 if(edit){if(!UUID.test(b.id||'')||!Number.isSafeInteger(b.revision)||b.revision<1)return reply({error:'Malzeme sürümü geçersiz.'},400);
 const previous=(await database(`panel_inventory?id=eq.${b.id}&select=unit`,auth.user))[0];if(!previous)return reply({error:'Malzeme bulunamadı.'},404);if(previous.unit!==item.unit)return reply({error:'Kayıtlı malzemenin birimi değiştirilemez. Yeni malzeme oluşturun.'},400);}
 const rows=await database(edit?`panel_inventory?id=eq.${b.id}&revision=eq.${b.revision}`:'panel_inventory',auth.user,{method:edit?'PATCH':'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({...item,revision:edit?b.revision+1:1,updated_at:new Date().toISOString()})});
 if(!rows.length)return reply({error:'Stok kaydı değişti. Listeyi yenileyin.'},409);return reply({item:rows[0]},edit?200:201);
 }catch(e){return reply({error:e.status===409?'Stok yetersiz, malzeme kapalı veya hareket zaten farklı verilerle işlendi. Listeyi yenileyin.':e.message},e.status||503);}
}
export const POST=request=>write(request,false);
export const PATCH=request=>write(request,true);
