import {PDFDocument,rgb} from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fontData from './pdf/font.mjs';
import {ORDER_STATUSES,PAYMENT_STATUSES,paymentStatus} from './orders.mjs';
import {money} from './site-content.mjs';
export async function orderPdf(order){
 const doc=await PDFDocument.create();doc.registerFontkit(fontkit);
 const font=await doc.embedFont(Buffer.from(fontData,'base64'),{subset:true});
 const glyphs=new Set(font.getCharacterSet());
 const clean=value=>Array.from(String(value??'').replace(/[\x00-\x1f\x7f]/g,' ')).map(c=>glyphs.has(c.codePointAt(0))?c:'?').join('');
 const ink=rgb(.07,.12,.17),muted=rgb(.4,.45,.5),blue=rgb(.09,.32,.94),light=rgb(.94,.96,.99);
 let page,y;const margin=44,width=507;
 const draw=(value,x,at,size=10,color=ink)=>page.drawText(clean(value),{x,y:at,font,size,color});
 function addPage(){page=doc.addPage([595.28,841.89]);draw('DOKUNUVER',margin,792,22);draw('Dokun. Bağlan.',margin,772,10,blue);draw(`SİPARİŞ ÖZETİ · DK-${order.order_no}`,margin,731,15);page.drawLine({start:{x:margin,y:714},end:{x:551,y:714},thickness:1,color:light});y=690;}
 function space(height){if(y-height<90)addPage();}
 function wrap(value,available,size=10){const lines=[];let line='';for(const char of clean(value)){if(font.widthOfTextAtSize(line+char,size)>available&&line){const breakAt=line.lastIndexOf(' ');if(breakAt>line.length*.4){lines.push(line.slice(0,breakAt));line=line.slice(breakAt+1)+char;}else{lines.push(line);line=char;}}else line+=char;}if(line)lines.push(line);return lines.length?lines:[''];}
 function paragraph(value,size=10,color=ink){for(const line of wrap(value,width,size)){space(size+7);draw(line,margin,y,size,color);y-=size+7;}}
 function tableHead(){space(32);page.drawRectangle({x:margin,y:y-8,width,height:25,color:light});draw('Ürün / Stand',margin+8,y,10);draw('Adet',344,y,10);draw('Birim',391,y,10);draw('Tutar',480,y,10);y-=33;}
 addPage();paragraph(order.customer_name,13);if(order.phone)paragraph(`Telefon: ${order.phone}`,10,muted);
 paragraph(`Sipariş tarihi: ${new Date(order.created_at).toLocaleDateString('tr-TR',{timeZone:'Europe/Istanbul'})}`,10,muted);
 paragraph(`Durum: ${ORDER_STATUSES[order.status]||order.status} · Teslimat: ${order.delivery_method==='pickup'?'Elden teslim / Gel-al':'Kargo'}`,10,muted);
 y-=14;tableHead();
 const summaryHeight=100+(order.tracking?wrap(`Kargo takip bilgisi: ${order.tracking}`,width).length*17+8:0);
 for(const [index,item] of order.items.entries()){const lines=wrap(`${item.title} / ${item.stand_title}`,275,10),height=Math.max(36,lines.length*16+14);if(y-height-(index===order.items.length-1?summaryHeight:0)<90){addPage();tableHead();}
 lines.forEach((line,i)=>draw(line,margin+8,y-i*16));draw(item.quantity,344,y);draw(money(item.card_price+item.stand_price),391,y,9);draw(money(Math.round((item.card_price+item.stand_price)*item.quantity*100)/100),480,y,9);
 y-=height;page.drawLine({start:{x:margin,y:y+10},end:{x:551,y:y+10},thickness:.5,color:light});}
 space(summaryHeight);y-=10;paragraph(`Kargo ücreti: ${money(order.shipping_fee)}`,11);paragraph(`Toplam: ${money(order.total)}`,17,blue);
 paragraph(`Tahsil edilen: ${money(order.paid_amount||0)} · Kalan: ${money(Math.max(0,Math.round((order.total-(order.paid_amount||0))*100)/100))}`,11);
 paragraph(`Ödeme durumu: ${PAYMENT_STATUSES[paymentStatus(order)]}`,10,muted);
 if(order.tracking){y-=8;paragraph(`Kargo takip bilgisi: ${order.tracking}`,10,muted);}
 const pages=doc.getPages();pages.forEach((p,index)=>{p.drawLine({start:{x:margin,y:60},end:{x:551,y:60},thickness:.5,color:light});p.drawText('DOKUNUVER · Sipariş özeti. Fatura değildir.',{x:margin,y:44,font,size:8,color:muted});p.drawText(`${index+1} / ${pages.length}`,{x:514,y:44,font,size:8,color:muted});});
 doc.setTitle(`DOKUNUVER DK-${order.order_no} Sipariş Özeti`);doc.setAuthor('DOKUNUVER');return doc.save();
}
