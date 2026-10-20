const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','-p','3217','-H','127.0.0.1'],{stdio:'pipe'});
let output='';server.stdout.on('data',b=>output+=b);server.stderr.on('data',b=>output+=b);
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_BIN||'/tmp/loyalty-chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 let ready=false;for(let i=0;i<100;i++){try{if((await fetch('http://127.0.0.1:3217/sadakat/demo')).ok){ready=true;break;}}catch{}await new Promise(r=>setTimeout(r,200));}
 if(!ready)throw new Error('Preview server did not start: '+output);
 await mkdir('tmp/loyalty',{recursive:true});
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const writes=[];page.on('request',r=>{if(r.method()==='POST')writes.push(r.url());});
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const route of ['/sadakat/demo','/sadakat/isletme/demo','/sadakat/isletme','/sadakat/demo/yonetim']){
   await page.goto('http://127.0.0.1:3217'+route);await page.waitForTimeout(150);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${route} overflows at ${width}`);
   if(route==='/sadakat/isletme/demo'){
    await page.getByRole('button',{name:'Kampanya & personel',exact:true}).click();
    await page.getByRole('button',{name:'Yeni kampanya',exact:true}).click();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`settings overflow at ${width}`);
   }
   if(route==='/sadakat/demo/yonetim'){
    await page.getByRole('button',{name:'Ayarlar · Pink Rose Cafe',exact:true}).click();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`platform settings overflow at ${width}`);
   }
  }
 }
 await page.setViewportSize({width:390,height:844});await page.goto('http://127.0.0.1:3217/sadakat/demo');
 await page.getByRole('button',{name:'Alışverişim için damga iste'}).click();
 await page.getByRole('button',{name:'Damga durumunu yenile'}).waitFor();
 assert.equal(await page.getByRole('button',{name:'Alışverişim için damga iste'}).count(),0);
 await page.getByRole('checkbox').check();assert(await page.getByRole('checkbox').isChecked());
 await page.getByRole('checkbox').uncheck();assert(!(await page.getByRole('checkbox').isChecked()));
 await page.screenshot({path:'tmp/loyalty/customer-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://127.0.0.1:3217/sadakat/isletme/demo');
 await page.getByRole('button',{name:'Alışverişi doğrula · +1'}).click();
 assert.equal(await page.getByRole('button',{name:'Alışverişi doğrula · +1'}).count(),0);
 assert.equal(await page.getByRole('button',{name:'Ödülü teslim ettim'}).count(),2);
 await page.getByRole('button',{name:'Ödülü teslim ettim'}).first().click();
 assert.equal(await page.getByRole('button',{name:'Ödülü teslim ettim'}).count(),1);
 await page.getByRole('button',{name:'Müşteriler',exact:true}).click();
 await page.getByLabel('Müşteri grubu').selectOption('consented');
 await page.getByText('Deniz Örnek',{exact:true}).waitFor();
 assert.equal(await page.getByText('Ece Örnek',{exact:true}).count(),0);
 await page.screenshot({path:'tmp/loyalty/business-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'İşlem geçmişi',exact:true}).click();await page.getByText('Demo işletme sahibi',{exact:false}).waitFor();
 await page.getByRole('button',{name:'Kampanya & personel',exact:true}).click();
 await page.getByRole('button',{name:'Düzenle · Cookie molası',exact:true}).click();
 assert(await page.getByLabel('Ödül açıklaması').isDisabled());assert(await page.getByLabel('Hedef damga sayısı').isDisabled());
 await page.getByLabel('Günlük damga sınırı').fill('2');await page.getByRole('button',{name:'Kampanyayı kaydet',exact:true}).click();
 await page.getByText('Günde en fazla 2 damga',{exact:false}).waitFor();
 await page.getByRole('button',{name:'Yeni kampanya',exact:true}).click();
 await page.getByLabel('Kampanya adı',{exact:true}).fill('Kahve molası');await page.getByLabel('Ödül açıklaması').fill('1 filtre kahve');
 await page.getByLabel('Hedef damga sayısı').fill('7');await page.getByRole('button',{name:'Kampanyayı kaydet',exact:true}).click();
 await page.getByRole('button',{name:'Düzenle · Kahve molası',exact:true}).waitFor();
 await page.getByLabel('Personelin adı').fill('Yeni kasiyer');await page.getByLabel('Hesabın e-posta adresi').fill('kasiyer@example.com');
 await page.getByRole('button',{name:'Personeli yetkilendir',exact:true}).click();await page.getByText('Yeni kasiyer',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Erişimi kapat',exact:true}).first().click();await page.getByText('Personel · erişimi kapalı',{exact:true}).waitFor();
 await page.getByText('Son 50 yönetim işlemi',{exact:true}).click();await page.getByText('Personel erişimi güncellendi',{exact:true}).first().waitFor();
 await page.screenshot({path:'tmp/loyalty/settings-desktop.png',fullPage:true});
 await page.goto('http://127.0.0.1:3217/sadakat/demo/yonetim');
 await page.getByRole('button',{name:'Ayarlar · Pink Rose Cafe',exact:true}).click();
 await page.getByLabel('Paket',{exact:true}).selectOption('standard');
 await page.getByLabel('Aylık doğrulama SMS limiti',{exact:true}).fill('75');
 await page.getByRole('checkbox',{name:'İşletme aktif',exact:true}).uncheck();
 await page.getByRole('button',{name:'İşletme ayarlarını kaydet',exact:true}).click();
 await page.getByText('Duraklatılmış · Standart',{exact:true}).waitFor();
 await page.getByLabel('İşletme ara').fill('pink');await page.getByText('1 işletme bulundu',{exact:true}).waitFor();
 await page.getByLabel('İşletme durumu').selectOption('active');await page.getByText('0 işletme bulundu',{exact:true}).waitFor();
 await page.getByLabel('İşletme durumu').selectOption('paused');await page.getByText('1 işletme bulundu',{exact:true}).waitFor();
 await page.getByRole('button',{name:'Ayarlar · Pink Rose Cafe',exact:true}).click();
 assert.equal(await page.getByLabel('Aylık doğrulama SMS limiti',{exact:true}).inputValue(),'75');
 await page.getByRole('checkbox',{name:'İşletme aktif',exact:true}).check();
 await page.getByRole('button',{name:'İşletme ayarlarını kaydet',exact:true}).click();
 await page.getByLabel('İşletme durumu').selectOption('all');await page.getByText('Aktif · Standart',{exact:true}).waitFor();
 await page.screenshot({path:'tmp/loyalty/platform-desktop.png',fullPage:true});
 assert.deepEqual(errors,[]);assert.deepEqual(writes,[]);
 console.log('PASS: 320/390/768/1440 no overflow incl. platform; customer/cashier/campaign/staff flows; platform plan/quota, pause/resume and search/filter; demos make no POST requests.');
}finally{await browser.close();server.kill('SIGTERM');}
