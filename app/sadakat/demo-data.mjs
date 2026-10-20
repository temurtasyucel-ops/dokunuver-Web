export const demoBusiness={id:'demo',name:'Pink Rose Cafe',slug:'demo',campaigns:[{id:'cookie',name:'Cookie molası',reward:'1 cookie ikramı',target:5}]};
export function demoData(){
 const now=Date.now();const ago=n=>new Date(now-n*86400000).toISOString();
 return {
  customers:[{id:'a',name:'Deniz Örnek',phone:'+905000000001',marketing_opt_in:true,created_at:ago(50),last_visit_at:ago(1)},{id:'b',name:'Ece Örnek',phone:'+905000000002',marketing_opt_in:false,created_at:ago(60),last_visit_at:ago(36)},{id:'c',name:'Ali Örnek',phone:'+905000000003',marketing_opt_in:true,created_at:ago(20),last_visit_at:ago(2)}],
  balances:[{customer_id:'a',campaign_id:'cookie',stamps:4,total_stamps:4,target:5},{customer_id:'b',campaign_id:'cookie',stamps:2,total_stamps:2,target:5},{customer_id:'c',campaign_id:'cookie',stamps:1,total_stamps:6,target:5}],
  requests:[{id:'r1',customer_id:'a',campaign_id:'cookie',status:'pending',expires_at:new Date(now+300000).toISOString()}],
  rewards:[{id:'w1',customer_id:'c',campaign_id:'cookie',label:'1 cookie ikramı',earned_at:ago(2),redeemed_at:null}],
  stamps:[]
 };
}
