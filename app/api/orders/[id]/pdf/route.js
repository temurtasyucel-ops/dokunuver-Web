import {requirePanelAdmin} from '../../../../../lib/admin-auth.mjs';
import {database,reply} from '../../../../../lib/panel-server';
import {UUID} from '../../../../../lib/orders.mjs';
import {orderPdf} from '../../../../../lib/order-pdf.mjs';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export async function GET(request,{params}){
 const auth=await requirePanelAdmin(request);if(!auth.ok)return reply({error:auth.error},auth.status);
 try{const {id}=await params;if(!UUID.test(id))return reply({error:'Sipariş ID geçersiz.'},400);
 const order=(await database(`panel_orders?id=eq.${id}&select=*`,auth.user))[0];if(!order)return reply({error:'Sipariş bulunamadı.'},404);
 return new Response(await orderPdf(order),{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="DOKUNUVER-DK-${order.order_no}.pdf"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
 }catch{return reply({error:'Sipariş PDF özeti oluşturulamadı.'},503);}
}
