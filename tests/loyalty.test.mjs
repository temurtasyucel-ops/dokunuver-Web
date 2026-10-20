import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizePhone,segmentCustomers,loyaltyError,CONSENT_TEXT} from '../lib/loyalty.mjs';
test('TR mobile normalization accepts common inputs without accepting arbitrary URLs or non-mobile numbers',()=>{
 for(const p of ['0532 123 45 67','+90 (532) 123-45-67','5321234567'])assert.equal(normalizePhone(p),'+905321234567');
 for(const p of ['','+15551234567','02321234567','https://905321234567','532123456789'])assert.throws(()=>normalizePhone(p));
});
test('marketing segment includes explicit opt-ins only and is independent of rewards',()=>{
 const customers=[{id:'a',marketing_opt_in:true},{id:'b',marketing_opt_in:false},{id:'c'}];
 assert.deepEqual(segmentCustomers(customers,[],[],'consented').map(c=>c.id),['a']);
 assert.equal(CONSENT_TEXT,'Bu işletmeden WhatsApp üzerinden kampanya ve duyuru mesajları almak istiyorum.');
});
test('customer groups match outstanding rewards, near target and real elapsed days',()=>{
 const now=Date.parse('2026-10-20T09:00:00Z');const customers=[{id:'a',last_visit_at:'2026-10-19T09:00:00Z'},{id:'b',created_at:'2026-09-01T09:00:00Z'}];
 assert.deepEqual(segmentCustomers(customers,[{customer_id:'a',stamps:4,target:5}],[],'near',now).map(c=>c.id),['a']);
 assert.deepEqual(segmentCustomers(customers,[],[{customer_id:'a',redeemed_at:'2026-10-19'},{customer_id:'b',redeemed_at:null}],'reward',now).map(c=>c.id),['b']);
 assert.deepEqual(segmentCustomers(customers,[],[],'inactive',now).map(c=>c.id),['b']);
});
test('database failures show actionable messages without exposing internals',()=>{
 assert.match(loyaltyError({message:'OWNER_REQUIRED'}),/işletme sahibi yetkisi/);
 assert.match(loyaltyError({code:'PGRST202'}),/kurulumu/);
 assert.doesNotMatch(loyaltyError({message:'secret sql query'}),/secret/);
});
