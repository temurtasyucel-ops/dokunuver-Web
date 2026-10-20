begin;
alter table public.loyalty_businesses add constraint loyalty_reserved_nfc_slug check(slug <> 'dokun');
-- Trusted provisioning only. No keys are stored in public tables. Disabled by default.
create table public.loyalty_nfc_tags (
 id text primary key check(id ~ '^[-a-zA-Z0-9_]{16,48}$'),
 business_id uuid not null references public.loyalty_businesses(id),
 campaign_id uuid not null,
 uid text not null unique check(uid ~ '^[0-9A-F]{14}$'),
 key_ref text not null unique check(char_length(key_ref) between 1 and 80),
 active boolean not null default false,
 last_counter integer not null default -1 check(last_counter between -1 and 16777215),
 cooldown_seconds integer not null default 3600 check(cooldown_seconds between 60 and 86400),
 foreign key(business_id,campaign_id) references public.loyalty_campaigns(business_id,id)
);
create table public.loyalty_nfc_reads (
 tag_id text not null references public.loyalty_nfc_tags(id), counter integer not null,
 customer_id uuid not null references public.loyalty_customers(id), request_id uuid not null unique references public.loyalty_requests(id),
 created_at timestamptz not null default now(),primary key(tag_id,counter)
);
create index loyalty_nfc_customer_history on public.loyalty_nfc_reads(customer_id,created_at desc);
alter table public.loyalty_nfc_tags enable row level security;
alter table public.loyalty_nfc_reads enable row level security;
revoke all on public.loyalty_nfc_tags,public.loyalty_nfc_reads from public,anon,authenticated,service_role;
-- Only a service-side verifier may read the nonsecret registry.
create function public.loyalty_nfc_lookup(p_tag text) returns jsonb
language sql security definer set search_path=pg_catalog,public as $$
 select jsonb_build_object('uid',uid,'key_ref',key_ref) from public.loyalty_nfc_tags where id=p_tag and active
$$;
create function public.loyalty_nfc_claim(p_actor uuid,p_tag text,p_uid text,p_counter integer) returns jsonb
language plpgsql security definer set search_path=pg_catalog,public as $$
declare tag public.loyalty_nfc_tags; customer public.loyalty_customers; campaign public.loyalty_campaigns;
 bal public.loyalty_balances; rid uuid;
begin
 if p_actor is null then raise exception 'AUTH_REQUIRED'; end if;
 select * into tag from public.loyalty_nfc_tags where id=p_tag and active for update;
 if not found or tag.uid is distinct from p_uid or p_counter is null or p_counter not between 0 and 16777215 then raise exception 'INVALID_NFC'; end if;
 if not exists(select 1 from public.loyalty_businesses where id=tag.business_id and active) then raise exception 'BUSINESS_UNAVAILABLE'; end if;
 select * into customer from public.loyalty_customers where business_id=tag.business_id and user_id=p_actor for update;
 if not found then raise exception 'CUSTOMER_REQUIRED'; end if;
 if not exists(select 1 from auth.users where id=p_actor and phone_confirmed_at is not null) then raise exception 'PHONE_VERIFICATION_REQUIRED'; end if;
 if p_counter<=tag.last_counter then raise exception 'NFC_ALREADY_USED'; end if;
 select * into campaign from public.loyalty_campaigns where id=tag.campaign_id and business_id=tag.business_id and active for update;
 if not found then raise exception 'CAMPAIGN_UNAVAILABLE'; end if;
 -- Count all stamp channels, so switching tags or using staff approval cannot bypass limits.
 if exists(select 1 from public.loyalty_stamps where business_id=tag.business_id and customer_id=customer.id and campaign_id=campaign.id
  and created_at>now()-make_interval(secs=>tag.cooldown_seconds)) then raise exception 'NFC_COOLDOWN'; end if;
 if (select count(*) from public.loyalty_stamps where business_id=tag.business_id and customer_id=customer.id and campaign_id=campaign.id
  and created_at>=date_trunc('day',now() at time zone 'Europe/Istanbul') at time zone 'Europe/Istanbul')>=campaign.daily_limit then raise exception 'DAILY_LIMIT'; end if;
 insert into public.loyalty_balances(business_id,customer_id,campaign_id) values(tag.business_id,customer.id,campaign.id) on conflict do nothing;
 select * into bal from public.loyalty_balances where business_id=tag.business_id and customer_id=customer.id and campaign_id=campaign.id for update;
 insert into public.loyalty_requests(business_id,customer_id,campaign_id,status,actor_id,decided_at)
 values(tag.business_id,customer.id,campaign.id,'approved',p_actor,now()) returning id into rid;
 insert into public.loyalty_stamps(business_id,customer_id,campaign_id,request_id,actor_id) values(tag.business_id,customer.id,campaign.id,rid,p_actor);
 if bal.stamps+1>=campaign.target then insert into public.loyalty_rewards(business_id,customer_id,campaign_id,label) values(tag.business_id,customer.id,campaign.id,campaign.reward); end if;
 update public.loyalty_balances set stamps=(bal.stamps+1)%campaign.target,total_stamps=total_stamps+1 where business_id=tag.business_id and customer_id=customer.id and campaign_id=campaign.id;
 update public.loyalty_customers set last_visit_at=now() where id=customer.id;
 insert into public.loyalty_nfc_reads(tag_id,counter,customer_id,request_id) values(tag.id,p_counter,customer.id,rid);
 update public.loyalty_nfc_tags set last_counter=p_counter where id=tag.id;
 return jsonb_build_object('ok',true,'business_id',tag.business_id,'slug',(select slug from public.loyalty_businesses where id=tag.business_id));
end $$;
revoke all on function public.loyalty_nfc_lookup(text),public.loyalty_nfc_claim(uuid,text,text,integer) from public,anon,authenticated;
grant execute on function public.loyalty_nfc_lookup(text),public.loyalty_nfc_claim(uuid,text,text,integer) to service_role;
commit;
