import test from 'node:test';
import assert from 'node:assert/strict';
import {blankMenu,parseMenuDocument,publishMenu,priceCents,menuLink,menuImage,menuSlug} from '../lib/menu.mjs';
import {saveMenuRequest,menuUser} from '../lib/menu-server.mjs';
const id='00000000-0000-4000-8000-000000000001',base='https://project.supabase.co';
const doc=()=>({...blankMenu('Kafe'),categories:[{id:'coffee',name:'Kahve',visible:true}],items:[{id:'latte',category:'coffee',name:'Latte',description:'Sütlü',price:14500,image:'',visible:true,soldOut:false,featured:false,allergens:'Süt'}]});
test('prices use integer cents and reject ambiguous or negative input',()=>{assert.equal(priceCents('150,50'),15050);assert.equal(priceCents('0'),0);for(const v of ['-1','1e3','1.000,50','150.999','','NaN'])assert.throws(()=>priceCents(v));});
test('document validation strips spoofed metadata and enforces visibility, ids and category membership',()=>{
 const clean=parseMenuDocument({...doc(),actor:'attacker',profile:{...doc().profile,owner:'attacker'}},{business:id,base});assert(!('actor' in clean));assert(!('owner' in clean.profile));
 for(const mutate of [d=>d.items[0].price=-1,d=>d.items[0].price=1.5,d=>d.items[0].category='missing',d=>d.items[0].id='coffee',d=>d.items[0].visible='true',d=>d.profile.name='',d=>d.items[0].name='x'.repeat(101),d=>d.categories=Array(31).fill(d.categories[0])]){const d=doc();mutate(d);assert.throws(()=>parseMenuDocument(d,{business:id,base}));}
});
test('publication excludes hidden items/categories, keeps sold-out information and requires visible products',()=>{
 const d=doc();d.items.push({...d.items[0],id:'hidden',visible:false});d.items[0].soldOut=true;assert.equal(publishMenu(d).items.length,1);assert.equal(publishMenu(d).items[0].soldOut,true);d.categories[0].visible=false;assert.throws(()=>publishMenu(d));
});
test('social links reject javascript, lookalike domains, credentials and unsafe schemes',()=>{
 assert.equal(menuLink('https://maps.app.goo.gl/abc','google'),'https://maps.app.goo.gl/abc');
 for(const url of ['javascript:alert(1)','https://google.com.evil.test','http://google.com','https://me@google.com','https://google.com:444'])assert.throws(()=>menuLink(url,'google'));
 assert.throws(()=>menuLink('https://google.com','instagram'));assert.equal(menuLink('','instagram'),'');assert.throws(()=>menuSlug('demo'));
});
test('image URLs bind to the owner business storage prefix',()=>{
 const good=`${base}/storage/v1/object/public/menu-media/${id}/a.jpg`;assert.equal(menuImage(good,id,base),good);
 for(const url of [good.replace(base,'https://evil.test'),good.replace(id,'other'),good+'?token=x','data:image/svg+xml,bad'])assert.throws(()=>menuImage(url,id,base));
});
test('save API binds actor to verified identity and computes published document',async()=>{
 const calls=[];const req=new Request('https://local/api/menu',{method:'PATCH',body:JSON.stringify({business:id,revision:1,document:doc(),action:'publish',p_actor:'attacker',p_published:{evil:true}})});
 const result=await saveMenuRequest(req,{getUser:async()=>({user:{id:'owner'}}),rpc:async(name,args)=>{calls.push({name,args});return {revision:2};}});assert.equal(result.status,200);assert.equal(calls[0].args.p_actor,'owner');assert.equal(calls[0].args.p_published.items[0].id,'latte');assert(!('evil' in calls[0].args.p_published));
});
test('anonymous and malformed save requests never reach mutation RPC',async()=>{
 let count=0;const rpc=async()=>{count++};const req=body=>new Request('https://local/api/menu',{method:'PATCH',body:JSON.stringify(body)});
 assert.equal((await saveMenuRequest(req({}),{getUser:async()=>({error:'login',status:401}),rpc})).status,401);
 assert.equal((await saveMenuRequest(req({business:id,revision:0}),{getUser:async()=>({user:{id:'owner'}}),rpc})).status,400);assert.equal(count,0);
});
test('tenant session verification rejects absent, expired and unconfirmed sessions',async()=>{
 assert.equal((await menuUser(new Request('https://local'))).status,401);
 const saved=[process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY];process.env.NEXT_PUBLIC_SUPABASE_URL=base;process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='test';
 try{const req=new Request('https://local',{headers:{Authorization:'Bearer test'}});assert.equal((await menuUser(req,async()=>Response.json({}, {status:401}))).status,401);assert.equal((await menuUser(req,async()=>Response.json({id:'owner'}))).status,403);assert.equal((await menuUser(req,async()=>Response.json({id:'owner',email_confirmed_at:'date'}))).user.id,'owner');}finally{saved.forEach((v,i)=>{const key=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'][i];if(v===undefined)delete process.env[key];else process.env[key]=v;});}
});
