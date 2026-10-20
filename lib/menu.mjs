export const blankMenu=(name='İşletmeniz')=>({profile:{name,tagline:'Güzel lezzetler, keyifli anlar.',description:'',address:'',phone:'',hours:'',google:'',instagram:'',logo:'',cover:'',accent:'#20564b'},categories:[],items:[]});
export function menuSlug(value){if(typeof value!=='string'||!/^[a-z0-9][a-z0-9-]{2,59}$/.test(value)||['demo','menu'].includes(value))throw new Error('Bağlantı adı 3–60 küçük harf, rakam veya tire içermeli.');return value;}
export function menuId(value){if(typeof value!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value))throw new Error('İşletme seçimi geçersiz.');return value;}
const text=(value,max,required=false)=>{if(typeof value!=='string'||value.length>max||(required&&!value.trim()))throw new Error('Metin alanlarını ve uzunluklarını kontrol edin.');return value.trim();};
export function menuLink(value,kind){
 if(value===''||value===undefined)return '';const v=text(value,500);let u;try{u=new URL(v);}catch{throw new Error('Bağlantıyı https:// ile başlayan tam adres olarak yazın.');}
 const hosts=kind==='instagram'?['instagram.com','www.instagram.com']:['google.com','www.google.com','maps.google.com','google.com.tr','www.google.com.tr','maps.app.goo.gl','g.page'];
 if(u.protocol!=='https:'||u.username||u.password||u.port||!hosts.includes(u.hostname))throw new Error(kind==='instagram'?'Geçerli bir Instagram bağlantısı yazın.':'Google işletme veya Haritalar bağlantısı yazın.');return u.href;
}
export function menuImage(value,business,base){
 if(!value)return '';const v=text(value,700);let u,b;try{u=new URL(v);b=new URL(base);}catch{throw new Error('Görseli panelden yükleyin.');}
 if(u.origin!==b.origin||u.search||u.hash||!u.pathname.startsWith(`/storage/v1/object/public/menu-media/${business}/`)||!/^[-a-zA-Z0-9_./]+$/.test(u.pathname)||u.pathname.includes('..'))throw new Error('Görsel bu işletmeye ait değil.');return u.href;
}
export function parseMenuDocument(input,{business,base}={}){
 if(!input||!input.profile||!Array.isArray(input.categories)||!Array.isArray(input.items)||input.categories.length>30||input.items.length>200)throw new Error('En fazla 30 kategori ve 200 ürün eklenebilir.');
 const p=input.profile;const profile={};for(const [k,max,required] of [['name',100,true],['tagline',140],['description',700],['address',250],['phone',30],['hours',180]])profile[k]=text(p[k]??'',max,required);
 profile.google=menuLink(p.google,'google');profile.instagram=menuLink(p.instagram,'instagram');
 profile.logo=menuImage(p.logo,business,base);profile.cover=menuImage(p.cover,business,base);
 if(!/^#[0-9a-f]{6}$/i.test(p.accent))throw new Error('Geçerli bir tema rengi seçin.');profile.accent=p.accent;
 const ids=new Set(),cats=new Set();const id=v=>{if(typeof v!=='string'||!/^[-a-zA-Z0-9_]{1,64}$/.test(v)||ids.has(v))throw new Error('Kayıt kimliği geçersiz veya tekrarlı.');ids.add(v);return v;};
 const bool=v=>{if(typeof v!=='boolean')throw new Error('Görünürlük seçimi geçersiz.');return v;};
 const categories=input.categories.map(c=>{const cid=id(c.id);cats.add(cid);return {id:cid,name:text(c.name,60,true),visible:bool(c.visible)};});
 const items=input.items.map(i=>{
  if(!cats.has(i.category))throw new Error('Ürün için geçerli kategori seçin.');
  if(!Number.isSafeInteger(i.price)||i.price<0||i.price>100000000)throw new Error('Ürün fiyatını kontrol edin.');
  return {id:id(i.id),category:i.category,name:text(i.name,100,true),description:text(i.description??'',700),price:i.price,image:menuImage(i.image,business,base),visible:bool(i.visible),soldOut:bool(i.soldOut),featured:bool(i.featured),allergens:text(i.allergens??'',200)};
 });return {profile,categories,items};
}
export function publishMenu(doc){
 const categories=doc.categories.filter(c=>c.visible),ids=new Set(categories.map(c=>c.id));
 const items=doc.items.filter(i=>i.visible&&ids.has(i.category));
 if(!items.length)throw new Error('Yayınlamak için görünür bir kategoride en az bir görünür ürün ekleyin.');
 return {profile:doc.profile,categories,items};
}
export function priceCents(value){if(typeof value!=='string'||!/^\d{1,7}([.,]\d{1,2})?$/.test(value.trim()))throw new Error('Fiyatı 150 veya 150,50 şeklinde yazın.');const [whole,decimal='']=value.trim().replace(',','.').split('.');const cents=Number(whole)*100+Number(decimal.padEnd(2,'0'));if(cents>100000000)throw new Error('Fiyat çok yüksek.');return cents;}
export const menuMoney=cents=>new Intl.NumberFormat('tr-TR',{style:'currency',currency:'TRY',maximumFractionDigits:cents%100?2:0}).format(cents/100);
