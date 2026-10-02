import { effectivePrice } from './site-content.mjs';
export const ORDER_STATUSES = {new:'Yeni',preparing:'Hazırlanıyor',ready:'Hazır',shipped:'Kargolandı',delivered:'Teslim edildi',cancelled:'İptal'};
export function buildOrder(input, catalog, previous) {
 const text=(v,n,label,optional=false)=>{if(typeof v!=='string'||v.length>n||(!optional&&!v.trim()))throw new Error(`${label} geçersiz.`);return v.trim();};
 const amount=(v,label)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>1000000||Math.abs(v*100-Math.round(v*100))>0.00001)throw new Error(`${label} geçersiz.`);return v;};
 const merged={phone:'',notes:'',tracking:'',status:'new',delivery_method:'courier',shipping_fee:0,...previous,...input};
 if(!Object.hasOwn(ORDER_STATUSES,merged.status))throw new Error('Sipariş durumu geçersiz.');
 if(!['courier','pickup'].includes(merged.delivery_method))throw new Error('Teslimat şekli geçersiz.');
 let items=previous?.items;
 if(input.items!==undefined){
  if(!Array.isArray(input.items)||!input.items.length||input.items.length>30)throw new Error('Siparişe 1–30 ürün satırı ekleyin.');
  items=input.items.map(item=>{
   if(!Number.isInteger(item.quantity)||item.quantity<1||item.quantity>1000)throw new Error('Adet 1–1000 arası olmalıdır.');
   const old=previous?.items.find(p=>p.product_id===item.product_id&&p.stand_id===(item.stand_id||''));
   if(old)return {...old,quantity:item.quantity};
   const product=catalog.products.find(p=>p.id===item.product_id&&p.enabled);
   if(!product)throw new Error('Seçilen ürün satışta değil.');
   const stand=item.stand_id?catalog.settings.stands.find(s=>s.id===item.stand_id&&s.enabled&&product.stand_ids.includes(s.id)):null;
   if(item.stand_id&&!stand)throw new Error('Bu ürün için seçilen stand kullanılamıyor.');
   return {product_id:product.id,title:product.title,stand_id:stand?.id||'',stand_title:stand?.title||'Standsız',quantity:item.quantity,card_price:effectivePrice(product),stand_price:stand?.price||0};
  });
 }
 if(!items?.length)throw new Error('Sipariş ürünleri gereklidir.');
 const shipping_fee=amount(merged.shipping_fee,'Kargo tutarı');
 const total_cents=items.reduce((sum,i)=>sum+(Math.round(i.card_price*100)+Math.round(i.stand_price*100))*i.quantity,Math.round(shipping_fee*100));
 if(total_cents>10000000000)throw new Error('Sipariş toplamı çok yüksek.');
 const paid_amount=amount(merged.paid_amount??0,'Tahsil edilen tutar');
 if(Math.round(paid_amount*100)>total_cents)throw new Error('Tahsil edilen tutar sipariş toplamını aşamaz.');
 return {customer_name:text(merged.customer_name,120,'Müşteri adı'),phone:text(merged.phone,40,'Telefon',true),notes:text(merged.notes,2000,'Not',true),
  tracking:text(merged.tracking,200,'Kargo takip bilgisi',true),delivery_method:merged.delivery_method,status:merged.status,shipping_fee,items,total:total_cents/100,
  paid_amount,payment_note:text(merged.payment_note??'',500,'Ödeme notu',true)};
}
export const PAYMENT_STATUSES={unpaid:'Ödenmedi',partial:'Kapora / Kısmi ödeme',paid:'Ödendi'};
export const CARD_PRODUCTS={'iban':'iban','google-yorum':'google','instagram':'instagram','whatsapp':'whatsapp','ilan':'ilan'};
export const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function paymentStatus(order){return Math.round((order.paid_amount||0)*100)>=Math.round(order.total*100)?'paid':order.paid_amount>0?'partial':'unpaid';}
export function validateCardAction(body) {
 if(!['iban','smart'].includes(body.kind)||typeof body.active!=='boolean'||!Array.isArray(body.codes)||body.codes.length<1||body.codes.length>100||new Set(body.codes).size!==body.codes.length||body.codes.some(c=>typeof c!=='string'||!/^[A-Z0-9]{6}$/.test(c)))throw new Error('1–100 benzersiz kart ve geçerli durum seçin.');
 return {p_kind:body.kind,p_codes:body.codes,p_active:body.active};
}
