// Server-side NTAG 424 DNA: encrypted PICCData, MACInputOffset == MACOffset.
// NXP AN12196 rev 2, sections 3.3 and 3.4.4.2.1. Never import into client code.
import {createCipheriv,createDecipheriv,timingSafeEqual} from 'node:crypto';
const hex=(v,n)=>{if(typeof v!=='string'||!new RegExp(`^[0-9a-fA-F]{${n*2}}$`).test(v))throw new Error('INVALID_NFC');return Buffer.from(v,'hex');};
const xor=(a,b)=>Buffer.from(a.map((x,i)=>x^b[i]));
function block(key,data){const c=createCipheriv('aes-128-ecb',key,null);c.setAutoPadding(false);return Buffer.concat([c.update(data),c.final()]);}
function double(b){const out=Buffer.alloc(16);for(let i=0;i<16;i++)out[i]=((b[i]<<1)|((b[i+1]||0)>>7))&255;if(b[0]&128)out[15]^=0x87;return out;}
export function aesCmac(key,message){
 const k1=double(block(key,Buffer.alloc(16))),k2=double(k1),n=Math.max(1,Math.ceil(message.length/16));
 const full=message.length>0&&message.length%16===0;let last=Buffer.alloc(16);message.copy(last,0,(n-1)*16);if(!full)last[message.length%16]=0x80;
 last=xor(last,full?k1:k2);let state=Buffer.alloc(16);for(let i=0;i<n-1;i++)state=block(key,xor(state,message.subarray(i*16,i*16+16)));return block(key,xor(state,last));
}
export function parseNfcProof(body){
 if(!body||typeof body.tag!=='string'||!/^[-a-zA-Z0-9_]{16,48}$/.test(body.tag))throw new Error('INVALID_NFC');
 hex(body.e,16);hex(body.c,8);return {tag:body.tag,e:body.e,c:body.c};
}
export function verifyNfcProof(proof,config){
 const meta=hex(config.metaKey,16),file=hex(config.fileKey,16),expectedUid=hex(config.uid,7);
 const d=createDecipheriv('aes-128-cbc',meta,Buffer.alloc(16));d.setAutoPadding(false);
 const plain=Buffer.concat([d.update(hex(proof.e,16)),d.final()]);
 if(plain[0]!==0xc7||!timingSafeEqual(plain.subarray(1,8),expectedUid))throw new Error('INVALID_NFC');
 const session=aesCmac(file,Buffer.concat([Buffer.from('3cc300010080','hex'),plain.subarray(1,11)]));
 const mac=Buffer.from(aesCmac(session,Buffer.alloc(0)).filter((_,i)=>i%2===1));
 if(!timingSafeEqual(mac,hex(proof.c,8)))throw new Error('INVALID_NFC');
 return {uid:expectedUid.toString('hex').toUpperCase(),counter:plain.readUIntLE(8,3)};
}
export function nfcKeyConfig(keyRef,env=process.env){
 if(env.LOYALTY_SECURE_NFC_ENABLED!=='true')throw new Error('NFC_DISABLED');
 const keys=JSON.parse(env.LOYALTY_NFC_KEYS_JSON||'{}');
 if(!Object.hasOwn(keys,keyRef))throw new Error('NFC_DISABLED');
 const k=keys[keyRef];for(const v of [k.metaKey,k.fileKey]){hex(v,16);if(/^0+$/.test(v))throw new Error('NFC_DISABLED');}return k;
}
