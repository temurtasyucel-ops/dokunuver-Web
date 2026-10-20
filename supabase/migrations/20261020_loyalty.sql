begin;

create table public.loyalty_businesses (
 id uuid primary key default gen_random_uuid(), slug text not null unique check(slug ~ '^[a-z0-9][a-z0-9-]{2,59}$'),
 name text not null check(char_length(name) between 2 and 100), active boolean not null default true, created_at timestamptz not null default now()
);
create table public.loyalty_members (
 business_id uuid not null references public.loyalty_businesses(id), user_id uuid not null references auth.users(id),
 role text not null check(role in ('owner','staff')), active boolean not null default true, primary key(business_id,user_id)
);
create table public.loyalty_campaigns (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.loyalty_businesses(id),
 name text not null check(char_length(name) between 2 and 80), reward text not null check(char_length(reward) between 2 and 100),
 target integer not null check(target between 2 and 30), daily_limit integer not null default 1 check(daily_limit between 1 and 20),
 active boolean not null default true, unique(business_id,id)
);
create table public.loyalty_customers (
 id uuid primary key default gen_random_uuid(), business_id uuid not null references public.loyalty_businesses(id),
 user_id uuid not null references auth.users(id), phone text not null, name text not null check(char_length(name) between 1 and 80),
 marketing_opt_in boolean not null default false, created_at timestamptz not null default now(), last_visit_at timestamptz,
 unique(business_id,user_id), unique(business_id,id)
);
create table public.loyalty_consents (
 id uuid primary key default gen_random_uuid(), business_id uuid not null, customer_id uuid not null,
 allowed boolean not null, text_version text not null, consent_text text not null, channel text not null check(channel='whatsapp'),
 actor_id uuid not null references auth.users(id), created_at timestamptz not null default now(),
 foreign key(business_id,customer_id) references public.loyalty_customers(business_id,id)
);
create table public.loyalty_balances (
 business_id uuid not null, customer_id uuid not null, campaign_id uuid not null,
 stamps integer not null default 0 check(stamps>=0), total_stamps integer not null default 0 check(total_stamps>=0),
 primary key(business_id,customer_id,campaign_id),
 foreign key(business_id,customer_id) references public.loyalty_customers(business_id,id),
 foreign key(business_id,campaign_id) references public.loyalty_campaigns(business_id,id)
);
create table public.loyalty_requests (
 id uuid primary key default gen_random_uuid(), business_id uuid not null, customer_id uuid not null, campaign_id uuid not null,
 status text not null default 'pending' check(status in ('pending','approved','rejected','expired')),
 created_at timestamptz not null default now(), expires_at timestamptz not null default now()+interval '5 minutes',
 decided_at timestamptz, actor_id uuid references auth.users(id),
 foreign key(business_id,customer_id) references public.loyalty_customers(business_id,id),
 foreign key(business_id,campaign_id) references public.loyalty_campaigns(business_id,id), unique(business_id,id)
);
create unique index loyalty_one_pending on public.loyalty_requests(business_id,customer_id,campaign_id) where status='pending';
create index loyalty_request_queue on public.loyalty_requests(business_id,status,created_at);
create table public.loyalty_stamps (
 id uuid primary key default gen_random_uuid(), business_id uuid not null, customer_id uuid not null, campaign_id uuid not null,
 request_id uuid not null unique, actor_id uuid not null references auth.users(id), created_at timestamptz not null default now(),
 foreign key(business_id,customer_id) references public.loyalty_customers(business_id,id),
 foreign key(business_id,campaign_id) references public.loyalty_campaigns(business_id,id),
 foreign key(business_id,request_id) references public.loyalty_requests(business_id,id)
);
create index loyalty_stamp_daily on public.loyalty_stamps(business_id,customer_id,campaign_id,created_at);
create table public.loyalty_rewards (
 id uuid primary key default gen_random_uuid(), business_id uuid not null, customer_id uuid not null, campaign_id uuid not null,
 label text not null, earned_at timestamptz not null default now(), redeemed_at timestamptz, redeemed_by uuid references auth.users(id),
 foreign key(business_id,customer_id) references public.loyalty_customers(business_id,id),
 foreign key(business_id,campaign_id) references public.loyalty_campaigns(business_id,id)
);

create function public.loyalty_role(p_business uuid) returns text language sql stable security definer set search_path=pg_catalog,public as $$
 select m.role from public.loyalty_members m join public.loyalty_businesses b on b.id=m.business_id
 where m.business_id=p_business and m.user_id=auth.uid() and m.active and b.active
$$;
revoke all on function public.loyalty_role(uuid) from public,anon;
grant execute on function public.loyalty_role(uuid) to authenticated;

do $$ declare t text; begin
 foreach t in array array['loyalty_businesses','loyalty_members','loyalty_campaigns','loyalty_customers','loyalty_consents','loyalty_balances','loyalty_requests','loyalty_stamps','loyalty_rewards'] loop
  execute format('alter table public.%I enable row level security',t);
  execute format('revoke all on public.%I from public,anon,authenticated,service_role',t);
  execute format('grant select on public.%I to authenticated',t);
 end loop;
end $$;
create policy loyalty_business_read on public.loyalty_businesses for select to authenticated using(public.loyalty_role(id) is not null);
create policy loyalty_member_read on public.loyalty_members for select to authenticated using(user_id=auth.uid() or public.loyalty_role(business_id)='owner');
create policy loyalty_campaign_read on public.loyalty_campaigns for select to authenticated using(public.loyalty_role(business_id) is not null or exists(select 1 from public.loyalty_customers c where c.business_id=loyalty_campaigns.business_id and c.user_id=auth.uid()));
create policy loyalty_customer_read on public.loyalty_customers for select to authenticated using(user_id=auth.uid() or public.loyalty_role(business_id) is not null);
do $$ declare t text; begin
 foreach t in array array['loyalty_consents','loyalty_balances','loyalty_requests','loyalty_stamps','loyalty_rewards'] loop
  execute format('create policy loyalty_read on public.%I for select to authenticated using(public.loyalty_role(business_id) is not null or exists(select 1 from public.loyalty_customers c where c.id=customer_id and c.business_id=%I.business_id and c.user_id=auth.uid()))',t,t);
 end loop;
end $$;

-- Only public campaign information, never customer identifiers or phone numbers.
create function public.loyalty_public(p_slug text) returns jsonb language sql stable security definer set search_path=pg_catalog,public as $$
 select jsonb_build_object('id',b.id,'name',b.name,'slug',b.slug,'campaigns',coalesce((select jsonb_agg(jsonb_build_object('id',c.id,'name',c.name,'reward',c.reward,'target',c.target)) from public.loyalty_campaigns c where c.business_id=b.id and c.active),'[]'::jsonb))
 from public.loyalty_businesses b where b.slug=p_slug and b.active
$$;
revoke all on function public.loyalty_public(text) from public;
grant execute on function public.loyalty_public(text) to anon,authenticated;

create function public.loyalty_action(p_business uuid,p_action text,p_data jsonb default '{}'::jsonb) returns jsonb
language plpgsql security definer set search_path=pg_catalog,public as $$
declare actor uuid=auth.uid(); member_role text; customer public.loyalty_customers; campaign public.loyalty_campaigns;
 req public.loyalty_requests; reward_row public.loyalty_rewards; bal public.loyalty_balances;
 verified_phone text; opt boolean; consent_message text='Bu işletmeden WhatsApp üzerinden kampanya ve duyuru mesajları almak istiyorum.';
begin
 if actor is null then raise exception 'AUTH_REQUIRED'; end if;
 if not exists(select 1 from public.loyalty_businesses where id=p_business and active) then raise exception 'BUSINESS_UNAVAILABLE'; end if;
 member_role=public.loyalty_role(p_business);
 if p_action='register' then
  select phone into verified_phone from auth.users where id=actor and phone_confirmed_at is not null;
  if verified_phone is null or verified_phone='' then raise exception 'PHONE_VERIFICATION_REQUIRED'; end if;
  if coalesce(char_length(trim(p_data->>'name')),0) not between 1 and 80 then raise exception 'INVALID_NAME'; end if;
  opt=coalesce((p_data->>'marketing_opt_in')::boolean,false);
  insert into public.loyalty_customers(business_id,user_id,phone,name) values(p_business,actor,verified_phone,trim(p_data->>'name'))
   on conflict(business_id,user_id) do nothing;
  select * into customer from public.loyalty_customers where business_id=p_business and user_id=actor for update;
  -- An existing membership is never opted in by repeating the registration request.
  if not exists(select 1 from public.loyalty_consents where customer_id=customer.id) then
   update public.loyalty_customers set marketing_opt_in=opt where id=customer.id;
   insert into public.loyalty_consents(business_id,customer_id,allowed,text_version,consent_text,channel,actor_id)
    values(p_business,customer.id,opt,'whatsapp-v1',consent_message,'whatsapp',actor);
  end if;
  return jsonb_build_object('ok',true);
 elsif p_action='consent' then
  select * into customer from public.loyalty_customers where business_id=p_business and user_id=actor for update;
  if not found or not (p_data ? 'allowed') then raise exception 'CUSTOMER_REQUIRED'; end if;
  opt=(p_data->>'allowed')::boolean;
  if opt is null then raise exception 'INVALID_CONSENT'; end if;
  if customer.marketing_opt_in is distinct from opt then
   update public.loyalty_customers set marketing_opt_in=opt where id=customer.id;
   insert into public.loyalty_consents(business_id,customer_id,allowed,text_version,consent_text,channel,actor_id)
    values(p_business,customer.id,opt,'whatsapp-v1',consent_message,'whatsapp',actor);
  end if;
  return jsonb_build_object('ok',true);
 elsif p_action='request_stamp' then
  select * into customer from public.loyalty_customers where business_id=p_business and user_id=actor for update;
  if not found then raise exception 'CUSTOMER_REQUIRED'; end if;
  select * into campaign from public.loyalty_campaigns where id=(p_data->>'campaign_id')::uuid and business_id=p_business and active;
  if not found then raise exception 'CAMPAIGN_UNAVAILABLE'; end if;
  update public.loyalty_requests set status='expired' where customer_id=customer.id and campaign_id=campaign.id and status='pending' and expires_at<=now();
  select * into req from public.loyalty_requests where customer_id=customer.id and campaign_id=campaign.id and status='pending';
  if not found then
   insert into public.loyalty_requests(business_id,customer_id,campaign_id) values(p_business,customer.id,campaign.id) returning * into req;
  end if;
  return jsonb_build_object('id',req.id,'expires_at',req.expires_at);
 elsif p_action in ('approve','reject') then
  if member_role is null then raise exception 'STAFF_REQUIRED'; end if;
  select * into req from public.loyalty_requests where id=(p_data->>'request_id')::uuid and business_id=p_business;
  if not found then raise exception 'REQUEST_UNAVAILABLE'; end if;
  -- Same lock order as request creation: customer first, then request.
  perform 1 from public.loyalty_customers where id=req.customer_id and business_id=p_business for update;
  select * into req from public.loyalty_requests where id=req.id and business_id=p_business for update;
  if req.status='approved' and p_action='approve' then return jsonb_build_object('ok',true,'already_processed',true); end if;
  if req.status<>'pending' then raise exception 'REQUEST_UNAVAILABLE'; end if;
  if req.expires_at<=now() then raise exception 'REQUEST_EXPIRED'; end if;
  if p_action='reject' then
   update public.loyalty_requests set status='rejected',actor_id=actor,decided_at=now() where id=req.id;
   return jsonb_build_object('ok',true);
  end if;
  select * into campaign from public.loyalty_campaigns where id=req.campaign_id and business_id=p_business and active for update;
  if not found then raise exception 'CAMPAIGN_UNAVAILABLE'; end if;
  insert into public.loyalty_balances(business_id,customer_id,campaign_id) values(p_business,req.customer_id,req.campaign_id) on conflict do nothing;
  select * into bal from public.loyalty_balances where business_id=p_business and customer_id=req.customer_id and campaign_id=req.campaign_id for update;
  if (select count(*) from public.loyalty_stamps where business_id=p_business and customer_id=req.customer_id and campaign_id=req.campaign_id
    and created_at>=date_trunc('day',now() at time zone 'Europe/Istanbul') at time zone 'Europe/Istanbul')>=campaign.daily_limit then raise exception 'DAILY_LIMIT'; end if;
  insert into public.loyalty_stamps(business_id,customer_id,campaign_id,request_id,actor_id) values(p_business,req.customer_id,req.campaign_id,req.id,actor);
  if bal.stamps+1>=campaign.target then
   insert into public.loyalty_rewards(business_id,customer_id,campaign_id,label) values(p_business,req.customer_id,req.campaign_id,campaign.reward);
  end if;
  update public.loyalty_balances set stamps=(bal.stamps+1)%campaign.target,total_stamps=total_stamps+1 where business_id=p_business and customer_id=req.customer_id and campaign_id=req.campaign_id;
  update public.loyalty_customers set last_visit_at=now() where id=req.customer_id;
  update public.loyalty_requests set status='approved',actor_id=actor,decided_at=now() where id=req.id;
  return jsonb_build_object('ok',true);
 elsif p_action='redeem' then
  if member_role is distinct from 'owner' then raise exception 'OWNER_REQUIRED'; end if;
  select * into reward_row from public.loyalty_rewards where id=(p_data->>'reward_id')::uuid and business_id=p_business for update;
  if not found then raise exception 'REWARD_UNAVAILABLE'; end if;
  if reward_row.redeemed_at is not null then return jsonb_build_object('ok',true,'already_processed',true); end if;
  update public.loyalty_rewards set redeemed_at=now(),redeemed_by=actor where id=reward_row.id;
  return jsonb_build_object('ok',true);
 else raise exception 'UNKNOWN_ACTION';
 end if;
end $$;
revoke all on function public.loyalty_action(uuid,text,jsonb) from public,anon,service_role;
grant execute on function public.loyalty_action(uuid,text,jsonb) to authenticated;

-- DOKUNUVER administrator provisioning. No anonymous business creation.
create function public.loyalty_provision(p_actor uuid,p_slug text,p_name text,p_campaign text,p_reward text,p_target integer) returns uuid
language plpgsql security definer set search_path=pg_catalog,public as $$
declare business uuid;
begin
 if not exists(select 1 from public.site_admins where user_id=p_actor) then raise exception 'ADMIN_REQUIRED'; end if;
 insert into public.loyalty_businesses(slug,name) values(p_slug,p_name) returning id into business;
 insert into public.loyalty_members(business_id,user_id,role) values(business,p_actor,'owner');
 insert into public.loyalty_campaigns(business_id,name,reward,target) values(business,p_campaign,p_reward,p_target);
 return business;
end $$;
revoke all on function public.loyalty_provision(uuid,text,text,text,text,integer) from public,anon,authenticated;
grant execute on function public.loyalty_provision(uuid,text,text,text,text,integer) to service_role;
notify pgrst,'reload schema';
commit;
