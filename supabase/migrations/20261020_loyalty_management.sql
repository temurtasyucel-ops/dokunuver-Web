begin;
alter table public.loyalty_campaigns add column revision bigint not null default 1;
alter table public.loyalty_members add column display_name text not null default 'Personel' check(char_length(display_name) between 1 and 80);
update public.loyalty_members set display_name='İşletme sahibi' where role='owner';
create index loyalty_customer_page_idx on public.loyalty_customers(business_id,created_at desc,id desc);
create index loyalty_customer_user_idx on public.loyalty_customers(user_id,business_id);
create index loyalty_rewards_customer_idx on public.loyalty_rewards(business_id,customer_id,redeemed_at);
create table public.loyalty_admin_events (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.loyalty_businesses(id),
 actor_id uuid not null references auth.users(id), action text not null, ref uuid not null,
 details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
alter table public.loyalty_admin_events enable row level security;
revoke all on public.loyalty_admin_events from public,anon,authenticated,service_role;
grant select on public.loyalty_admin_events to authenticated;
create policy loyalty_admin_event_read on public.loyalty_admin_events for select to authenticated using(public.loyalty_role(business_id)='owner');

-- Owner RLS can read staff rows; return only the caller's memberships for the business switcher.
create function public.loyalty_my_businesses() returns jsonb language sql stable security definer set search_path=pg_catalog,public as $$
 select coalesce(jsonb_agg(jsonb_build_object('id',b.id,'slug',b.slug,'name',b.name,'role',m.role) order by b.name),'[]'::jsonb)
 from public.loyalty_members m join public.loyalty_businesses b on b.id=m.business_id
 where m.user_id=auth.uid() and m.active and b.active
$$;
revoke all on function public.loyalty_my_businesses() from public,anon,service_role;
grant execute on function public.loyalty_my_businesses() to authenticated;

create function public.loyalty_campaign_save(p_business uuid,p_id uuid,p_revision bigint,p_data jsonb) returns uuid
language plpgsql security definer set search_path=pg_catalog,public as $$
declare prior public.loyalty_campaigns; locked boolean; campaign_name text=trim(p_data->>'name');
 reward_name text=trim(p_data->>'reward'); goal integer=(p_data->>'target')::integer;
 day_limit integer=(p_data->>'daily_limit')::integer; enabled boolean=(p_data->>'active')::boolean;
begin
 if public.loyalty_role(p_business) is distinct from 'owner' then raise exception 'OWNER_REQUIRED'; end if;
 if p_id is null or p_revision is null or p_revision<0 or coalesce(char_length(campaign_name),0) not between 2 and 80 or
 coalesce(char_length(reward_name),0) not between 2 and 100 or goal is null or goal not between 2 and 30 or day_limit is null or day_limit not between 1 and 20 or enabled is null then raise exception 'INVALID_CAMPAIGN'; end if;
 -- Serializes creates and existing-campaign edits within this tenant.
 perform 1 from public.loyalty_businesses where id=p_business for update;
 select * into prior from public.loyalty_campaigns where id=p_id for update;
 if found then
  if prior.business_id<>p_business then raise exception 'CAMPAIGN_UNAVAILABLE'; end if;
  if p_revision=0 and prior.name=campaign_name and prior.reward=reward_name and prior.target=goal and prior.daily_limit=day_limit and prior.active=enabled then return p_id; end if;
  if prior.revision<>p_revision then raise exception 'REVISION_CONFLICT'; end if;
  locked=exists(select 1 from public.loyalty_stamps where business_id=p_business and campaign_id=p_id);
  if locked and (prior.reward<>reward_name or prior.target<>goal) then raise exception 'CAMPAIGN_TERMS_LOCKED'; end if;
  update public.loyalty_campaigns set name=campaign_name,reward=reward_name,target=goal,daily_limit=day_limit,active=enabled,revision=revision+1 where id=p_id;
 else
  if p_revision<>0 then raise exception 'CAMPAIGN_UNAVAILABLE'; end if;
  insert into public.loyalty_campaigns(id,business_id,name,reward,target,daily_limit,active) values(p_id,p_business,campaign_name,reward_name,goal,day_limit,enabled);
 end if;
 insert into public.loyalty_admin_events(business_id,actor_id,action,ref,details)
 values(p_business,auth.uid(),'campaign_saved',p_id,jsonb_build_object('name',campaign_name,'target',goal,'active',enabled,'daily_limit',day_limit));
 return p_id;
end $$;
revoke all on function public.loyalty_campaign_save(uuid,uuid,bigint,jsonb) from public,anon,service_role;
grant execute on function public.loyalty_campaign_save(uuid,uuid,bigint,jsonb) to authenticated;

-- Adds/reactivates existing confirmed Auth accounts; never sends email or creates credentials.
create function public.loyalty_staff_save(p_business uuid,p_email text,p_name text,p_active boolean) returns uuid
language plpgsql security definer set search_path=pg_catalog,public as $$
declare target_user uuid; existing_role text; label text=trim(p_name);
begin
 if public.loyalty_role(p_business) is distinct from 'owner' then raise exception 'OWNER_REQUIRED'; end if;
 if p_active is null or coalesce(char_length(trim(p_email)),0) not between 3 and 254 or coalesce(char_length(label),0) not between 1 and 80 then raise exception 'INVALID_STAFF'; end if;
 perform 1 from public.loyalty_businesses where id=p_business for update;
 select id into target_user from auth.users where lower(email)=lower(trim(p_email)) and email_confirmed_at is not null;
 if target_user is null then raise exception 'STAFF_ACCOUNT_REQUIRED'; end if;
 select role into existing_role from public.loyalty_members where business_id=p_business and user_id=target_user for update;
 if existing_role='owner' then raise exception 'OWNER_MEMBERSHIP_PROTECTED'; end if;
 insert into public.loyalty_members(business_id,user_id,role,active,display_name) values(p_business,target_user,'staff',p_active,label)
 on conflict(business_id,user_id) do update set active=excluded.active,display_name=excluded.display_name;
 insert into public.loyalty_admin_events(business_id,actor_id,action,ref,details) values(p_business,auth.uid(),'staff_saved',target_user,jsonb_build_object('name',label,'active',p_active));
 return target_user;
end $$;
revoke all on function public.loyalty_staff_save(uuid,text,text,boolean) from public,anon,service_role;
grant execute on function public.loyalty_staff_save(uuid,text,text,boolean) to authenticated;

create function public.loyalty_customer_page(p_business uuid,p_search text default '',p_segment text default 'all',p_page integer default 1,p_size integer default 25) returns jsonb
language plpgsql stable security definer set search_path=pg_catalog,public as $$
declare result jsonb;
begin
 if public.loyalty_role(p_business) is null then raise exception 'STAFF_REQUIRED'; end if;
 if p_search is null or char_length(p_search)>100 or p_segment is null or p_segment not in ('all','near','reward','inactive','consented') or p_page is null or p_page not between 1 and 100000 or p_size is null or p_size not between 1 and 100 then raise exception 'INVALID_PAGE'; end if;
 with matching as (
  select c.* from public.loyalty_customers c where c.business_id=p_business
  and (trim(p_search)='' or strpos(lower(c.name||' '||c.phone),lower(trim(p_search)))>0)
  and (p_segment='all' or
   (p_segment='consented' and c.marketing_opt_in) or
   (p_segment='inactive' and coalesce(c.last_visit_at,c.created_at)<=now()-interval '30 days') or
   (p_segment='reward' and exists(select 1 from public.loyalty_rewards r where r.business_id=p_business and r.customer_id=c.id and r.redeemed_at is null)) or
   (p_segment='near' and exists(select 1 from public.loyalty_balances b join public.loyalty_campaigns p on p.id=b.campaign_id and p.business_id=b.business_id where b.business_id=p_business and b.customer_id=c.id and p.active and b.stamps=p.target-1)))
 ), page_rows as (
  select c.id,c.name,c.phone,c.marketing_opt_in,c.created_at,c.last_visit_at,
   coalesce((select jsonb_agg(jsonb_build_object('campaign_id',b.campaign_id,'campaign_name',p.name,'target',p.target,'stamps',b.stamps,'total_stamps',b.total_stamps) order by p.name)
    from public.loyalty_balances b join public.loyalty_campaigns p on p.id=b.campaign_id and p.business_id=b.business_id where b.business_id=p_business and b.customer_id=c.id),'[]'::jsonb) balances
  from matching c order by c.created_at desc,c.id desc limit p_size offset (p_page-1)*p_size
 ) select jsonb_build_object('total',(select count(*) from matching),'page',p_page,'size',p_size,'customers',coalesce((select jsonb_agg(p) from page_rows p),'[]'::jsonb)) into result;
 return result;
end $$;
revoke all on function public.loyalty_customer_page(uuid,text,text,integer,integer) from public,anon,service_role;
grant execute on function public.loyalty_customer_page(uuid,text,text,integer,integer) to authenticated;

create function public.loyalty_dashboard(p_business uuid) returns jsonb
language plpgsql stable security definer set search_path=pg_catalog,public as $$
declare result jsonb; member_role text=public.loyalty_role(p_business);
begin
 if member_role is null then raise exception 'STAFF_REQUIRED'; end if;
 select jsonb_build_object(
 'stats',jsonb_build_object('customers',(select count(*) from public.loyalty_customers where business_id=p_business),
  'pending',(select count(*) from public.loyalty_requests where business_id=p_business and status='pending' and expires_at>now()),
  'rewards',(select count(*) from public.loyalty_rewards where business_id=p_business and redeemed_at is null)),
 'campaigns',coalesce((select jsonb_agg(row) from (select p.*,exists(select 1 from public.loyalty_stamps h where h.business_id=p_business and h.campaign_id=p.id) terms_locked from public.loyalty_campaigns p where p.business_id=p_business order by p.name)row),'[]'::jsonb),
 'requests',coalesce((select jsonb_agg(row) from (select q.*,c.name customer_name,c.phone customer_phone from public.loyalty_requests q join public.loyalty_customers c on c.id=q.customer_id and c.business_id=q.business_id where q.business_id=p_business and q.status='pending' and q.expires_at>now() order by q.created_at limit 100)row),'[]'::jsonb),
 'rewards',coalesce((select jsonb_agg(row) from (select r.*,c.name customer_name from public.loyalty_rewards r join public.loyalty_customers c on c.id=r.customer_id and c.business_id=r.business_id where r.business_id=p_business and r.redeemed_at is null order by r.earned_at limit 100)row),'[]'::jsonb),
 'reward_history',coalesce((select jsonb_agg(row) from (select r.*,c.name customer_name,coalesce(m.display_name,'İşletme sahibi') actor_name from public.loyalty_rewards r join public.loyalty_customers c on c.id=r.customer_id and c.business_id=r.business_id left join public.loyalty_members m on m.business_id=r.business_id and m.user_id=r.redeemed_by where r.business_id=p_business order by r.earned_at desc limit 100)row),'[]'::jsonb),
 'stamps',coalesce((select jsonb_agg(row) from (select h.*,c.name customer_name,coalesce(m.display_name,'Personel') actor_name from public.loyalty_stamps h join public.loyalty_customers c on c.id=h.customer_id and c.business_id=h.business_id left join public.loyalty_members m on m.business_id=h.business_id and m.user_id=h.actor_id where h.business_id=p_business order by h.created_at desc limit 100)row),'[]'::jsonb),
 'members',case when member_role='owner' then coalesce((select jsonb_agg(row) from (select m.user_id,m.role,m.active,m.display_name,u.email from public.loyalty_members m join auth.users u on u.id=m.user_id where m.business_id=p_business order by m.role,m.display_name)row),'[]'::jsonb) else '[]'::jsonb end,
 'admin_events',case when member_role='owner' then coalesce((select jsonb_agg(row) from (select e.action,e.details,e.created_at,coalesce(m.display_name,'İşletme sahibi') actor_name from public.loyalty_admin_events e left join public.loyalty_members m on m.business_id=e.business_id and m.user_id=e.actor_id where e.business_id=p_business order by e.created_at desc limit 50)row),'[]'::jsonb) else '[]'::jsonb end
 ) into result;
 return result;
end $$;
revoke all on function public.loyalty_dashboard(uuid) from public,anon,service_role;
grant execute on function public.loyalty_dashboard(uuid) to authenticated;

create or replace function public.loyalty_provision(p_actor uuid,p_slug text,p_name text,p_campaign text,p_reward text,p_target integer) returns uuid
language plpgsql security definer set search_path=pg_catalog,public as $$
declare business uuid;
begin
 if not exists(select 1 from public.site_admins where user_id=p_actor) then raise exception 'ADMIN_REQUIRED'; end if;
 insert into public.loyalty_businesses(slug,name) values(p_slug,p_name) returning id into business;
 insert into public.loyalty_members(business_id,user_id,role,display_name) values(business,p_actor,'owner','İşletme sahibi');
 insert into public.loyalty_campaigns(business_id,name,reward,target) values(business,p_campaign,p_reward,p_target);
 return business;
end $$;
revoke all on function public.loyalty_provision(uuid,text,text,text,text,integer) from public,anon,authenticated;
grant execute on function public.loyalty_provision(uuid,text,text,text,text,integer) to service_role;
notify pgrst,'reload schema';
commit;
