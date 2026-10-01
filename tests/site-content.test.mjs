import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_CONTENT, validateContent, effectivePrice, isLive, priceSummary} from '../lib/site-content.mjs';
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
