import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3218','-H','127.0.0.1'],{stdio:'pipe'});let output='';server.stdout.on('data',x=>output+=x);server.stderr.on('data',x=>output+=x);
let browser;
try{
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||undefined,headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:3218/m/demo')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}if(!ready)throw new Error(output);
 await mkdir('tmp/menu',{recursive:true});const context=await browser.newContext();const page=await context.newPage();const errors=[],writes=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(['POST','PATCH','PUT'].includes(r.method()))writes.push(r.url());});
 const base='http://127.0.0.1:3218';
 for(const width of [320,390,768,1440]){await page.setViewportSize({width,height:950});for(const route of ['/m/demo','/m/demo/menu','/menu-panel','/menu-panel/demo']){await page.goto(base+route);await page.waitForTimeout(100);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`overflow: ${width} ${route}`);}}
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/m/demo');await page.getByRole('link',{name:'Menüye git'}).waitFor();
 const primary=await page.getByRole('link',{name:'Menüye git'}).boundingBox(),google=await page.getByRole('link',{name:'Google’da bizi bul'}).boundingBox();assert(google.y>=primary.y+primary.height);
 await page.screenshot({path:'tmp/menu/landing-mobile.png',fullPage:true});await page.getByRole('link',{name:'Menüye git'}).click();
 await page.getByRole('button',{name:'İmza Latte detayları'}).waitFor();await page.getByRole('button',{name:'Kahveler',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Çikolatalı Cookie detayları'}).count(),0);
 await page.getByLabel('Menüde ara').fill('Filtre');assert.equal(await page.getByRole('button',{name:'İmza Latte detayları'}).count(),0);await page.getByRole('button',{name:'Filtre Kahve detayları'}).click();await page.getByRole('dialog').waitFor();await page.getByText('Alerjen bilgisi',{exact:true}).waitFor();await page.keyboard.press('Escape');assert.equal(await page.getByRole('dialog').count(),0);
 await page.getByLabel('Menüde ara').fill('bulunmayan');await page.getByText('Bu aramaya uygun ürün bulunamadı.',{exact:true}).waitFor();
 await page.goto(base+'/menu-panel/demo');await page.getByRole('button',{name:'İmza Latte düzenle'}).click();await page.getByLabel('Fiyat (₺)',{exact:true}).fill('165,50');await page.getByLabel('Tükendi olarak işaretle').check();
 await page.getByRole('button',{name:'Taslağı kaydet',exact:true}).click();await page.getByText('Taslak kaydedildi.',{exact:false}).waitFor();
 // Saving a draft never changes the customer menu.
 const customer=await page.context().newPage();await customer.goto(base+'/m/demo/menu');await customer.getByRole('button',{name:'İmza Latte detayları'}).click();assert((await customer.getByRole('dialog').innerText()).includes('145'));await customer.close();
 await page.getByRole('button',{name:'Menüyü yayınla',exact:true}).click();await page.getByText('Demo menü yayınlandı.',{exact:false}).waitFor();
 await page.getByRole('button',{name:'Kategoriler',exact:false}).first().click();await page.getByLabel('Yeni kategori adı').fill('Atıştırmalıklar');await page.getByRole('button',{name:'Kategori ekle',exact:true}).click();
 await page.getByRole('button',{name:'Ürünler',exact:false}).first().click();await page.getByRole('button',{name:'+ Ürün ekle',exact:true}).click();await page.getByLabel('Ürün adı',{exact:true}).fill('Yeni Sandviç');await page.getByLabel('Ürün kategorisi',{exact:true}).selectOption({label:'Atıştırmalıklar'});await page.getByLabel('Fiyat (₺)',{exact:true}).fill('250');await page.getByLabel('Ürün açıklaması').fill('Taze malzemelerle.');
 await page.getByRole('button',{name:'Menüyü yayınla',exact:true}).click();await page.getByText('Demo menü yayınlandı.',{exact:false}).waitFor();
 await page.getByRole('button',{name:'İşletme sayfası',exact:false}).first().click();await page.getByLabel('Instagram bağlantısı').fill('https://www.instagram.com/ornekkafe/');await page.getByRole('button',{name:'Menüyü yayınla',exact:true}).click();await page.getByText('Demo menü yayınlandı.',{exact:false}).waitFor();
 await page.setViewportSize({width:1440,height:1000});await page.getByRole('button',{name:'Ürünler',exact:false}).first().click();await page.screenshot({path:'tmp/menu/editor-desktop.png',fullPage:true});
 await page.goto(base+'/m/demo/menu');await page.getByRole('button',{name:'İmza Latte detayları'}).click();const dialog=page.getByRole('dialog');assert((await dialog.innerText()).includes('165,50'));assert((await dialog.innerText()).includes('Tükendi'));await page.getByRole('button',{name:'Detayı kapat'}).click();await page.getByRole('button',{name:'Yeni Sandviç detayları'}).waitFor();
 await page.screenshot({path:'tmp/menu/menu-desktop.png',fullPage:true});await page.goto(base+'/m/demo');assert.equal(await page.getByRole('link',{name:'Instagram',exact:true}).getAttribute('href'),'https://www.instagram.com/ornekkafe/');
 assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);console.log('PASS: responsive landing/menu/editor, links below menu button, search/categories, accessible modal, draft/live separation, demo publication, price/sold-out/new category/product/social editing; no real writes.');
}finally{await browser?.close();server.kill('SIGTERM');}
