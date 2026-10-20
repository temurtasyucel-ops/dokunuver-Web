import {menuUser,menuRpc,menuReply,saveMenuRequest} from '../../../lib/menu-server.mjs';
import {menuId} from '../../../lib/menu.mjs';
export const dynamic='force-dynamic';
export const PATCH=saveMenuRequest;
export async function GET(request){
 const auth=await menuUser(request);if(!auth.user)return menuReply({error:auth.error},auth.status);
 try{const id=new URL(request.url).searchParams.get('business');return menuReply(await menuRpc('menu_owned',{p_actor:auth.user.id,p_business:id?menuId(id):null}));}catch(e){return menuReply({error:e.message},e.status||400);}
}
