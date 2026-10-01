import test from 'node:test';
import assert from 'node:assert/strict';
import { requirePanelAdmin } from '../lib/admin-auth.mjs';
const request = token => new Request('https://dokunuver.example/api/panel-session', { headers: token ? { Authorization: `Bearer ${token}` } : {} });
const reply = (value, status=200) => Response.json(value, { status });
async function withBackend(fetchImpl, run) {
 const savedFetch=globalThis.fetch;
 const names=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY','SUPABASE_SECRET_KEY'];
 const saved=names.map(n=>process.env[n]);
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://test.supabase.example';process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='public-test';process.env.SUPABASE_SECRET_KEY='secret-test';
 globalThis.fetch=fetchImpl;
 try { await run(); } finally { globalThis.fetch=savedFetch;names.forEach((n,i)=>saved[i]===undefined?delete process.env[n]:process.env[n]=saved[i]); }
}
test('missing token is rejected without any database request',async()=>{
 await withBackend(()=>{throw new Error('must not fetch')},async()=>assert.equal((await requirePanelAdmin(request())).status,401));
});
test('authenticated ordinary user cannot access management',async()=>{
 await withBackend(async url=>url.includes('/auth/')?reply({id:'ordinary-id'}):reply([]),async()=>{
  const auth=await requirePanelAdmin(request('ordinary'));assert.equal(auth.ok,false);assert.equal(auth.status,403);
 });
});
test('listed admin succeeds and membership is requested with server credentials',async()=>{
 let calls=[];
 await withBackend(async(url,opts)=>{calls.push({url,opts});return url.includes('/auth/')?reply({id:'admin-id'}):reply([{user_id:'admin-id'}]);},async()=>{
  const auth=await requirePanelAdmin(request('admin'));assert.equal(auth.ok,true);assert.equal(auth.user.id,'admin-id');
  assert.match(calls[1].url,/user_id=eq.admin-id/);assert.equal(calls[1].opts.headers.Authorization,'Bearer secret-test');
  assert.ok(calls.every(c=>c.opts.cache==='no-store'));
 });
});
test('expired session returns 401 and does not query membership',async()=>{
 let calls=0;await withBackend(async()=>{calls++;return reply({},401)},async()=>{assert.equal((await requirePanelAdmin(request('expired'))).status,401);assert.equal(calls,1)});
});
test('backend outage fails closed as 503, separate from invalid credentials',async()=>{
 for(const failure of ['auth','membership','network','malformed'])await withBackend(async url=>{
  if(failure==='network')throw new Error('offline');
  if(url.includes('/auth/'))return failure==='auth'?reply({},500):reply({id:'admin-id'});
  return failure==='malformed'?reply({user_id:'admin-id'}):reply({},500);
 },async()=>{const auth=await requirePanelAdmin(request('admin'));assert.equal(auth.ok,false);assert.equal(auth.status,503)});
});
