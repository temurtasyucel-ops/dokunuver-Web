export const LOYALTY_PLANS={pilot:'Pilot',standard:'Standart',advanced:'Gelişmiş'};
export function parsePlatformQuery(params){
 const search=params.get('search')||'',state=params.get('state')||'all';
 const page=Number(params.get('page')||1);
 if(search.length>100||!['all','active','paused'].includes(state)||!Number.isInteger(page)||page<1||page>100000)throw new Error('Arama ve sayfa bilgilerini kontrol edin.');
 return {search,state,page};
}
export function parsePlatformSettings(body){
 if(!body||typeof body!=='object'||typeof body.business_id!=='string'||!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.business_id)||
 !Number.isSafeInteger(body.revision)||body.revision<1||!Object.hasOwn(LOYALTY_PLANS,body.plan)||!Number.isInteger(body.monthly_sms_limit)||body.monthly_sms_limit<0||body.monthly_sms_limit>1000000||typeof body.active!=='boolean')throw new Error('Paket ve SMS limiti alanlarını kontrol edin.');
 return {business_id:body.business_id,revision:body.revision,plan:body.plan,monthly_sms_limit:body.monthly_sms_limit,active:body.active};
}
