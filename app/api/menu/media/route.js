import {randomUUID} from 'node:crypto';
import {menuUser,menuRpc,menuReply} from '../../../../lib/menu-server.mjs';
import {menuId} from '../../../../lib/menu.mjs';
export const runtime='nodejs';
export async function POST(request){
 const auth=await menuUser(request);if(!auth.user)return menuReply({error:auth.error},auth.status);
 try{
 if(Number(request.headers.get('content-length'))>3*1024*1024+16384)return menuReply({error:'Görsel en fazla 3 MB olabilir.'},413);
 const form=await request.formData(),business=menuId(form.get('business'));
 const owner=await menuRpc('menu_owned',{p_actor:auth.user.id,p_business:business});if(!owner?.active)return menuReply({error:'İşletme erişimi duraklatılmış.'},403);
 const file=form.get('file');if(!(file instanceof File)||!file.size||file.size>3*1024*1024)return menuReply({error:'En fazla 3 MB PNG, JPEG veya WebP seçin.'},400);
 const bytes=Buffer.from(await file.arrayBuffer());let ext,type;
 if(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))){ext='png';type='image/png';}
 else if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255){ext='jpg';type='image/jpeg';}
 else if(bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'){ext='webp';type='image/webp';}
 else return menuReply({error:'PNG, JPEG veya WebP görsel seçin.'},400);
 const path=`${business}/${randomUUID()}.${ext}`,base=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.SUPABASE_SECRET_KEY;
 const r=await fetch(`${base}/storage/v1/object/menu-media/${path}`,{method:'POST',headers:{apikey:key,Authorization:`Bearer ${key}`,'Content-Type':type,'x-upsert':'false'},body:bytes});
 if(!r.ok)throw new Error('Görsel yüklenemedi. Menü depolama kurulumunu kontrol edin.');
 return menuReply({url:`${base}/storage/v1/object/public/menu-media/${path}`},201);
 }catch(e){return menuReply({error:e.message||'Görsel yüklenemedi.'},e.status||400);}
}
