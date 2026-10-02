// PLAYWRIGHT_MODULE and CHROMIUM_MODULE: absolute module paths; CHROMIUM_BIN: local Chromium executable.
import http from 'node:http';
import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {DEFAULT_CONTENT,validateContent} from '../lib/site-content.mjs';
import {fileURLToPath} from 'node:url';
const {chromium:playwright}=await import(process.env.PLAYWRIGHT_MODULE);
const {default:Chromium}=await import(process.env.CHROMIUM_MODULE);
const root=fileURLToPath(new URL('..',import.meta.url));
const content=validateContent(structuredClone(DEFAULT_CONTENT),'http://127.0.0.1:4581');
let orders=[],links=[],inventory=[],moves=[],writes=0;
const orderId='11111111-1111-4111-8111-111111111111',itemId='22222222-2222-4222-8222-222222222222';
const cards=[{code:'ABC234',product_type:'instagram',status:'stock',active:false,business_name:'',batch_code:'TEST-1',created_at:new Date().toISOString()},{code:'DEF567',product_type:'instagram',status:'stock',active:false,business_name:'',batch_code:'TEST-1',created_at:new Date().toISOString()}];
const status=o=>o.paid_amount>=o.total?'paid':o.paid_amount>0?'partial':'unpaid';
const server=http.createServer(async(req,res)=>{let raw='';for await(const part of req)raw+=part;const b=raw?JSON.parse(raw):null,u=new URL(req.url,'http://localhost');
 const send=(data,code=200)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};
 if(u.pathname==='/auth/v1/user')return send({id:'test-admin'});
 if(u.pathname==='/rest/v1/site_admins')return send([{user_id:'test-admin'}]);
 if(u.pathname==='/rest/v1/site_content')return send([{content,revision:1,updated_at:new Date().toISOString()}]);
 if(req.method!=='GET'){writes++;assert.equal(req.headers['x-panel-actor'],'test-admin');}
 if(u.pathname==='/rest/v1/panel_orders'){
  if(req.method==='POST'){const row={...b,id:orderId,order_no:1,created_at:new Date().toISOString(),payment_status:status(b)};orders.push(row);return send([row],201);}
  if(req.method==='PATCH'){const row=orders.find(o=>`eq.${o.id}`===u.searchParams.get('id')&&`eq.${o.revision}`===u.searchParams.get('revision'));if(!row)return send([]);Object.assign(row,b);row.payment_status=status(row);return send([row]);}
  return send(orders.filter(o=>!u.searchParams.get('id')||`eq.${o.id}`===u.searchParams.get('id')));
 }
 if(u.pathname==='/rest/v1/panel_order_cards')return send(links.filter(l=>`eq.${l.order_id}`===u.searchParams.get('order_id')));
 if(u.pathname==='/rest/v1/panel_available_cards')return send(cards.filter(c=>!links.some(l=>l.code===c.code)));
 if(u.pathname==='/rest/v1/rpc/panel_order_card_change'){
  const order=orders.find(o=>o.id===b.p_order_id);if(order.revision!==b.p_revision)return send({code:'P0001'},400);
  if(b.p_attach)for(const code of b.p_codes)links.push({code,kind:b.p_kind,order_id:b.p_order_id,product_id:b.p_product_id,created_at:new Date().toISOString()});
  else links=links.filter(l=>!b.p_codes.includes(l.code));return send(++order.revision);
 }
 if(u.pathname==='/rest/v1/panel_inventory'){
  if(req.method==='POST'){const row={...b,id:itemId,quantity:0,created_at:new Date().toISOString()};inventory.push(row);return send([row],201);}
  if(req.method==='PATCH'){Object.assign(inventory[0],b);return send([inventory[0]]);}
  return send(inventory);
 }
 if(u.pathname==='/rest/v1/panel_stock_moves')return send(moves);
 if(u.pathname==='/rest/v1/rpc/panel_stock_change'){
  if(!moves.some(m=>m.id===b.p_id)){inventory[0].quantity+=b.p_delta;inventory[0].revision++;moves.unshift({id:b.p_id,delta:b.p_delta,note:b.p_note,balance:inventory[0].quantity,created_at:new Date().toISOString()});}return send(inventory[0]);
 }
 if(u.pathname==='/rest/v1/rpc/panel_business_summary')return send({orders:{pending:orders.length,shipped:0,unpaid:orders.length,remaining:orders.reduce((sum,o)=>sum+o.total-o.paid_amount,0)},queue:orders,low_stock:inventory.filter(i=>i.quantity<=i.low_stock_threshold),low_stock_count:inventory.filter(i=>i.quantity<=i.low_stock_threshold).length,card_stock:{iban:0,smart:{instagram:cards.length-links.length}}});
 if(u.pathname==='/rest/v1/panel_events')return send([]);
 return send({error:'Unknown mock endpoint '+u.pathname},404);
});
await new Promise(r=>server.listen(4581,'127.0.0.1',r));
const env={...process.env,NEXT_PUBLIC_SUPABASE_URL:'http://127.0.0.1:4581',NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:'mock-public',SUPABASE_SECRET_KEY:'mock-secret',VERCEL_ENV:'production'};
let next,logs='',browser;
function start(preview=false){next=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','4582'],{cwd:root,env:{...env,VERCEL_ENV:preview?'preview':'production'},stdio:['ignore','pipe','pipe']});next.stdout.on('data',d=>logs+=d);next.stderr.on('data',d=>logs+=d);}
async function ready(){for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:4582/panel/login')).ok)return;}catch{}await new Promise(r=>setTimeout(r,200));}throw Error('Next not ready');}
try{start();await ready();browser=await playwright.launch({executablePath:process.env.CHROMIUM_BIN,args:Chromium.args,headless:true});const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});await context.addInitScript(()=>localStorage.setItem('dokunuver_access_token','test-admin'));const page=await context.newPage();page.setDefaultTimeout(10000);page.on('dialog',d=>d.accept());const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4582/panel/siparisler');await page.getByRole('button',{name:'Yeni Sipariş',exact:true}).click();await page.getByLabel('Müşteri / işletme').fill('Şükrü Test');await page.getByRole('button',{name:'Ürün Satırı Ekle'}).click();await page.getByLabel('Ürün 1',{exact:true}).selectOption('instagram');await page.getByLabel('Tahsil edilen tutar (TL)').fill('50');await page.getByLabel('Ödeme notu (iç kullanım)').fill('PRIVATE_PAYMENT');await page.getByLabel('Sipariş / üretim notu').fill('PRIVATE_NOTE');await page.getByRole('button',{name:'Siparişi Kaydet',exact:true}).click();await page.getByRole('status').filter({hasText:'DK-1 kaydedildi.'}).waitFor();assert.equal(orders[0].paid_amount,50);assert.equal(orders[0].total,250);
 const pdfDownload=page.waitForEvent('download');await page.getByRole('button',{name:'PDF Özeti İndir',exact:true}).click();assert.equal((await pdfDownload).suggestedFilename(),'DOKUNUVER-DK-1.pdf');
 await page.getByRole('link',{name:'Kartları Eşleştir',exact:true}).click();await page.getByRole('button',{name:'Siparişe Bağla'}).first().click();await page.getByRole('status').filter({hasText:'ABC234 eşleştirildi.'}).waitFor();await page.getByRole('button',{name:'Bağlantıyı Kaldır'}).waitFor();assert.equal(links.length,1);assert.equal(orders[0].revision,2);await page.getByRole('button',{name:'Siparişe Bağla'}).waitFor();assert.equal(await page.getByRole('button',{name:'Siparişe Bağla'}).isEnabled(),false);
 await page.getByRole('button',{name:'Bağlantıyı Kaldır'}).click();await page.getByRole('status').filter({hasText:'bağlantısı kaldırıldı'}).waitFor();assert.equal(links.length,0);
 await page.goto('http://127.0.0.1:4582/panel/stok');await page.getByRole('button',{name:'Yeni Malzeme'}).click();await page.getByLabel('Malzeme adı').fill('NFC etiket');await page.getByLabel('Kritik stok seviyesi').fill('5');await page.getByRole('button',{name:'Malzemeyi Kaydet'}).click();await page.getByRole('status').filter({hasText:'Malzeme kaydedildi.'}).waitFor();
 await page.getByRole('button',{name:'Stok Giriş / Çıkış'}).click();await page.getByLabel('Miktar',{exact:true}).fill('10');await page.getByLabel('Açıklama (zorunlu)').fill('İlk sayım');await page.getByRole('button',{name:'Hareketi Kaydet'}).click();await page.getByRole('status').filter({hasText:'Stok hareketi kaydedildi.'}).waitFor();assert.equal(inventory[0].quantity,10);
 await page.getByRole('button',{name:'Stok Giriş / Çıkış'}).click();await page.getByLabel('Hareket türü').selectOption('out');await page.getByLabel('Miktar',{exact:true}).fill('8');await page.getByLabel('Açıklama (zorunlu)').fill('DK-1 üretim');await page.getByRole('button',{name:'Hareketi Kaydet'}).click();await page.getByRole('status').filter({hasText:'Stok hareketi kaydedildi.'}).waitFor();assert.equal(inventory[0].quantity,2);await page.getByRole('button',{name:'Hareketler',exact:true}).click();await page.getByText('DK-1 üretim',{exact:true}).waitFor();
 await page.goto('http://127.0.0.1:4582/panel/ozet');await page.getByRole('heading',{name:'Kritik malzemeler (1)'}).waitFor();assert.equal(await page.getByText('200 TL',{exact:true}).count(),1);
 const unauthorized=await page.evaluate(async()=>{const paths=['/api/order-cards?order_id=11111111-1111-4111-8111-111111111111','/api/inventory','/api/panel-summary','/api/orders/11111111-1111-4111-8111-111111111111/pdf'];return Promise.all(paths.map(p=>fetch(p).then(r=>r.status)));});assert(unauthorized.every(s=>s===401));
 for(const path of ['siparisler',`siparisler/${orderId}/kartlar`,'stok','ozet']){await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:4582/panel/'+path);await page.getByRole('heading',{level:1}).waitFor();await page.waitForTimeout(300);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${path} overflow390`);await page.setViewportSize({width:320,height:740});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),`${path} overflow320`);await page.screenshot({path:`/tmp/dokunuver-business-${path.split('/').at(-1)}.png`,fullPage:true});}
 const pdf=await context.request.get('http://127.0.0.1:4582/api/orders/'+orderId+'/pdf',{headers:{Authorization:'Bearer test-admin'}});assert.equal(pdf.status(),200);writeFileSync('/tmp/dokunuver-business-browser.pdf',await pdf.body());assert.deepEqual(errors,[]);
 console.log('Browser PASS: payment, real PDF download, card pairing/quota/unlink, stock ledger/critical summary, admin auth and mobile320/390');
 next.kill();await new Promise(r=>next.once('exit',r));start(true);await ready();const before=writes;
 for(const path of ['/api/orders','/api/order-cards','/api/inventory'])assert.equal((await fetch('http://127.0.0.1:4582'+path,{method:'POST',headers:{Authorization:'Bearer test-admin','Content-Type':'application/json'},body:'{}'})).status,403);
 assert.equal(writes,before);console.log('Preview writes blocked PASS');
}catch(e){console.error(e);console.error(logs.slice(-3000));process.exitCode=1;}finally{if(browser)await browser.close();next?.kill();await new Promise(r=>server.close(r));}
