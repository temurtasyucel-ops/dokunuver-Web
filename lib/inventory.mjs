export const CATEGORIES={card:'Kart',stand:'Stand',nfc:'NFC etiket',packaging:'Ambalaj',other:'Diğer'};
export const UNITS={adet:'Adet',paket:'Paket',metre:'Metre'};
export function inventoryItem(input){
 if(!input||typeof input.name!=='string'||!input.name.trim()||input.name.length>100||!Object.hasOwn(CATEGORIES,input.category)||!Object.hasOwn(UNITS,input.unit)||typeof input.active!=='boolean')throw new Error('Malzeme adı, kategori ve birim geçersiz.');
 return {name:input.name.trim(),category:input.category,unit:input.unit,active:input.active,low_stock_threshold:stockAmount(input.low_stock_threshold,false)};
}
export function stockAmount(value,signed=true){if(typeof value!=='number'||!Number.isFinite(value)||Math.abs(value)>1000000||Math.abs(value*100-Math.round(value*100))>0.00001||(!signed&&value<0))throw new Error('Stok miktarı en fazla 1.000.000 ve iki ondalık hane olmalıdır.');return value;}
