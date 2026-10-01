import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_CONTENT, validateContent, effectivePrice, isLive, priceSummary, visibleProducts, availableStands, standSummary} from '../lib/site-content.mjs';
const base='https://project.supabase.co';
const draft=()=>structuredClone(DEFAULT_CONTENT);
test('default catalog contains only the five active products',()=>{
 const c=validateContent(draft(),base);assert.equal(c.products.length,5);assert.equal(c.settings.stand_price,50);assert.equal(priceSummary(c.products),'Tekli kartlar 250 TL');
});
test('scheduled discount starts inclusively and ends exclusively',()=>{
 const p=draft().products[0];p.campaign={enabled:true,price:200,label:'Açılış',starts_at:'2026-10-01T12:00:00Z',ends_at:'2026-10-01T13:00:00Z'};
 assert.equal(effectivePrice(p,Date.parse('2026-10-01T11:59:59Z')),250);
 assert.equal(effectivePrice(p,Date.parse('2026-10-01T12:00:00Z')),200);
 assert.equal(effectivePrice(p,Date.parse('2026-10-01T13:00:00Z')),250);
 p.campaign.enabled=false;assert.equal(effectivePrice(p,Date.parse('2026-10-01T12:30:00Z')),250);
});
test('invalid prices, dates and duplicates cannot be published',()=>{
 for(const mutate of [c=>c.products[0].price=-1,c=>c.settings.stand_price='',c=>c.products[0].price=1.001,c=>c.products[0].campaign.enabled=true,c=>c.products[0].campaign.price=251,c=>c.products[0].campaign.starts_at='invalid',c=>c.products[0].campaign={enabled:true,price:200,label:'',starts_at:'2026-10-02',ends_at:'2026-10-01'},c=>c.products[4].id='google-yorum',c=>c.banner.enabled=true]){
  const c=draft();mutate(c);assert.throws(()=>validateContent(c,base));
 }
});
test('only existing image paths and own storage images are accepted',()=>{
 for(const image of ['javascript:alert(1)','https://evil.example/photo.png','//evil.example/photo.png','/images/../evil.png','https://project.supabase.co/storage/v1/object/public/other/photo.png']){
  const c=draft();c.products[0].image=image;assert.throws(()=>validateContent(c,base));
 }
 const c=draft();c.products[0].image=base+'/storage/v1/object/public/site-media/valid.png';assert.equal(validateContent(c,base).products[0].image,c.products[0].image);
});
test('unbounded campaign and banner obey their enabled switches',()=>{
 assert.equal(isLive({enabled:true,starts_at:null,ends_at:null}),true);assert.equal(isLive({enabled:false,starts_at:null,ends_at:null}),false);
});
test('legacy content preserves product order, prices, campaigns and standard stand',()=>{
 const old=draft();old.products.reverse();old.products[0].price=299.99;old.settings.stand_price=75;
 const c=validateContent(old,base);
 assert.deepEqual(c.products.map(p=>p.id),old.products.map(p=>p.id));assert.equal(c.products[0].price,299.99);
 assert.equal(c.catalog_version,2);assert.equal(c.settings.stands[0].price,75);
 assert.ok(c.products.every(p=>p.enabled && p.stand_ids[0]==='masaustu'));
 assert.deepEqual(validateContent(c,base),c);
});
test('custom draft can be saved without an image, but must have an image to go on sale',()=>{
 const c=validateContent(draft(),base);
 c.products.push({...structuredClone(c.products[0]),id:'menu-karti',title:'Menü Kartı',enabled:false,image:''});
 assert.equal(validateContent(c,base).products.length,6);assert.equal(visibleProducts(c).length,5);
 c.products[5].enabled=true;assert.throws(()=>validateContent(c,base));
 c.products[5].image='/images/dokunuver-icon.png';assert.equal(visibleProducts(validateContent(c,base)).length,6);
});
test('wood stand is priced separately and limited to assigned active products',()=>{
 const c=validateContent(draft(),base);
 c.settings.stands.push({id:'ahsap',title:'Ahşap stand',price:125.5,enabled:true,image:''});
 c.products[0].stand_ids.push('ahsap');
 const validated=validateContent(c,base);
 assert.deepEqual(availableStands(validated.products[0],validated.settings).map(s=>s.price),[50,125.5]);
 assert.equal(availableStands(validated.products[1],validated.settings).length,1);
 validated.settings.stands[1].enabled=false;
 assert.equal(availableStands(validated.products[0],validated.settings).length,1);
 assert.equal(standSummary(validated.settings),'Masaüstü stand +50 TL');
});
test('invalid slugs, stand references, duplicate stands and malformed states are rejected',()=>{
 for(const mutate of [c=>c.products[0].id='../bad',c=>c.products[0].id='duo',c=>c.products[0].enabled='yes',c=>c.products[0].stand_ids=['unknown'],c=>c.products[0].stand_ids=['masaustu','masaustu'],c=>c.settings.stands.push(c.settings.stands[0]),c=>c.settings.stands[0].price=1.001,c=>c.catalog_version=3]) {
  const c=validateContent(draft(),base);mutate(c);assert.throws(()=>validateContent(c,base));
 }
});
test('all products and stands can be hidden without invalid prices or empty catalog errors',()=>{
 const c=validateContent(draft(),base);c.products.forEach(p=>p.enabled=false);c.settings.stands.forEach(s=>s.enabled=false);
 const saved=validateContent(c,base);assert.equal(visibleProducts(saved).length,0);assert.equal(priceSummary(visibleProducts(saved)),'Kartlarımız yakında satışta');
 assert.equal(standSummary(saved.settings),'Standsız kullanım');
});
