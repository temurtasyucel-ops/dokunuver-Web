import test from 'node:test';
import assert from 'node:assert/strict';
import {parsePlatformSettings,parsePlatformQuery} from '../lib/loyalty-platform.mjs';
const valid={business_id:'00000000-0000-4000-8000-000000000001',revision:1,plan:'pilot',monthly_sms_limit:0,active:true};
test('platform configuration accepts explicit zero quota and strips caller actor/provider fields',()=>{
 assert.deepEqual(parsePlatformSettings({...valid,p_actor:'forged',sms_enabled:true}),valid);
 assert.equal(parsePlatformSettings({...valid,monthly_sms_limit:1000000,plan:'advanced'}).monthly_sms_limit,1000000);
});
test('platform configuration rejects unsafe IDs, unsupported plans, unbounded/fractional quotas and revisions',()=>{
 for(const patch of [{business_id:'bad'},{revision:0},{revision:1.5},{revision:Number.MAX_SAFE_INTEGER+1},{plan:'__proto__'},{plan:'unlimited'},{monthly_sms_limit:-1},{monthly_sms_limit:1.1},{monthly_sms_limit:1000001},{monthly_sms_limit:'50'},{active:'true'}])assert.throws(()=>parsePlatformSettings({...valid,...patch}));
 assert.throws(()=>parsePlatformSettings(null));
});
test('platform list query validates filters and page bounds',()=>{
 assert.deepEqual(parsePlatformQuery(new URLSearchParams()),{search:'',state:'all',page:1});
 assert.equal(parsePlatformQuery(new URLSearchParams('state=paused&page=2&search=cafe')).page,2);
 for(const q of ['page=0','page=1.1','page=100001','state=deleted','search='+'x'.repeat(101)])assert.throws(()=>parsePlatformQuery(new URLSearchParams(q)));
});
