import {test} from 'node:test';
import assert from 'node:assert/strict';
import {aesCmac,verifyNfcProof,parseNfcProof,nfcKeyConfig} from '../lib/loyalty-nfc.mjs';
const b=h=>Buffer.from(h,'hex');
test('NIST AES-CMAC empty, full and partial blocks',()=>{
 const key=b('2b7e151628aed2a6abf7158809cf4f3c');
 for(const [m,mac] of [['','bb1d6929e95937287fa37d129b756746'],['6bc1bee22e409f96e93d7e117393172a','070a16b46b4d4144f79bdd9dd04a287c'],['6bc1bee22e409f96e93d7e117393172aae2d8a571e03ac9c9eb76fac45af8e5130c81c46a35ce411','dfa66747de9ae63030ca32611497c827']])assert.equal(aesCmac(key,b(m)).toString('hex'),mac);
});
const proof={tag:'secure-test-tag01',e:'EF963FF7828658A599F3041510671E88',c:'94EED9EE65337086'};
const config={uid:'04DE5F1EACC040',metaKey:'0'.repeat(32),fileKey:'0'.repeat(32)};
test('NXP AN12196 table 4 encrypted PICC and SDMMAC reference vector',()=>assert.deepEqual(verifyNfcProof(proof,config),{uid:config.uid,counter:61}));
test('reject tampering, wrong UID/key and malformed lengths',()=>{
 for(const p of [{...proof,c:'04EED9EE65337086'},{...proof,e:'FF963FF7828658A599F3041510671E88'}])assert.throws(()=>verifyNfcProof(p,config));
 assert.throws(()=>verifyNfcProof(proof,{...config,uid:'04DE5F1EACC041'}));
 assert.throws(()=>verifyNfcProof(proof,{...config,fileKey:'1'.repeat(32)}));
 for(const p of [{...proof,c:'a'}, {...proof,tag:'../x'}, {...proof,e:[]},null])assert.throws(()=>parseNfcProof(p));
});
test('disabled by default and factory-zero keys cannot be enabled',()=>{
 assert.throws(()=>nfcKeyConfig('test',{}),/NFC_DISABLED/);
 assert.throws(()=>nfcKeyConfig('test',{LOYALTY_SECURE_NFC_ENABLED:'true',LOYALTY_NFC_KEYS_JSON:JSON.stringify({test:config})}),/NFC_DISABLED/);
 assert.throws(()=>nfcKeyConfig('__proto__',{LOYALTY_SECURE_NFC_ENABLED:'true'}),/NFC_DISABLED/);
});
import {handleNfcClaim} from '../lib/loyalty-nfc-handler.mjs';
const req=(body=proof,token='customer')=>new Request('https://example.test/api/loyalty/nfc',{method:'POST',headers:{...(token?{Authorization:`Bearer ${token}`}:{})},body:JSON.stringify(body)});
test('API disabled, missing session and unverified phone cannot reach database',async()=>{
 const database=()=>{throw new Error('must not call database')};
 assert.equal((await handleNfcClaim(req(),{database,env:{}})).status,503);
 const env={LOYALTY_SECURE_NFC_ENABLED:'true'};
 assert.equal((await handleNfcClaim(req(proof,''),{database,env})).status,401);
 assert.equal((await handleNfcClaim(req(),{database,env,fetchImpl:async()=>Response.json({}, {status:401})})).status,401);
 assert.equal((await handleNfcClaim(req(),{database,env,fetchImpl:async()=>Response.json({id:'user'})})).status,403);
});
test('API verifies cryptography before claim; forged actor/counter never reach SQL',async()=>{
 const env={LOYALTY_SECURE_NFC_ENABLED:'true',LOYALTY_NFC_KEYS_JSON:JSON.stringify({test:{...config,metaKey:'1'.repeat(32),fileKey:'2'.repeat(32)}})};
 const calls=[];const database=async(path,user,opts)=>{calls.push(path);return {uid:config.uid,key_ref:'test'};};
 const result=await handleNfcClaim(req({...proof,actor:'attacker',counter:999999}),{database,env,fetchImpl:async()=>Response.json({id:'verified-user',phone_confirmed_at:'2026-01-01'})});
 assert.equal(result.status,409);assert.deepEqual(calls,['rpc/loyalty_nfc_lookup']);
 assert.equal(result.headers.get('cache-control'),'no-store');
});
import {createCipheriv} from 'node:crypto';
test('API successful verified read binds actor and counter to verified values',async()=>{
 const cfg={uid:config.uid,metaKey:'1'.repeat(32),fileKey:'2'.repeat(32)},counter=b('3d0000');
 const enc=createCipheriv('aes-128-cbc',b(cfg.metaKey),Buffer.alloc(16));enc.setAutoPadding(false);
 const e=Buffer.concat([enc.update(Buffer.concat([b('c7'),b(cfg.uid),counter,b('da5cf60941')])),enc.final()]).toString('hex');
 const session=aesCmac(b(cfg.fileKey),Buffer.concat([b('3cc300010080'),b(cfg.uid),counter]));
 const c=Buffer.from(aesCmac(session,Buffer.alloc(0)).filter((_,i)=>i%2)).toString('hex');
 const calls=[];const database=async(path,user,opts)=>{calls.push({path,user,body:JSON.parse(opts.body)});return path.endsWith('lookup')?{uid:cfg.uid,key_ref:'test'}:{ok:true,slug:'pink-rose'};};
 const result=await handleNfcClaim(req({...proof,e,c,p_actor:'attacker',counter:999}),{database,env:{LOYALTY_SECURE_NFC_ENABLED:'true',LOYALTY_NFC_KEYS_JSON:JSON.stringify({test:cfg})},fetchImpl:async()=>Response.json({id:'verified-user',phone_confirmed_at:'2026-01-01'})});
 assert.equal(result.status,200);assert.deepEqual(calls[1].body,{p_actor:'verified-user',p_tag:proof.tag,p_uid:cfg.uid,p_counter:61});
 assert.deepEqual(await result.json(),{ok:true,slug:'pink-rose'});
});
