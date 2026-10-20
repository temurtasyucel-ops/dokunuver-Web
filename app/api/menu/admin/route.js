import {requirePanelAdmin} from '../../../../lib/admin-auth.mjs';
import {menuRpc,menuReply} from '../../../../lib/menu-server.mjs';
import {blankMenu,menuSlug,menuId} from '../../../../lib/menu.mjs';
export const dynamic='force-dynamic';
async function handle(request,action){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return menuReply({error:auth.error},auth.status);
 try{
 if(action==='list')return menuReply(await menuRpc('menu_admin_list',{p_actor:auth.user.id}));
 const b=await request.json();
 if(action==='active'){if(typeof b.active!=='boolean')throw new Error('Geçersiz durum.');return menuReply(await menuRpc('menu_set_active',{p_actor:auth.user.id,p_business:menuId(b.business),p_active:b.active}));}
 if(typeof b.name!=='string'||!b.name.trim()||b.name.length>100||typeof b.email!=='string'||!/^\S+@\S+\.\S+$/.test(b.email)||b.email.length>254)throw new Error('İşletme adı ve hesap e-postasını kontrol edin.');
 const name=b.name.trim();return menuReply({id:await menuRpc('menu_provision',{p_actor:auth.user.id,p_slug:menuSlug(b.slug),p_name:name,p_email:b.email.trim(),p_document:blankMenu(name)})},201);
 }catch(e){return menuReply({error:e.message},e.status||400);}
}
export const GET=r=>handle(r,'list');export const POST=r=>handle(r,'create');export const PATCH=r=>handle(r,'active');
