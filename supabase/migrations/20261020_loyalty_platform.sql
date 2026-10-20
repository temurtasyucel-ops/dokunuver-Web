begin;

-- Package and quota configuration only. No SMS provider or paid sending is enabled here.
create table public.loyalty_business_accounts (
 business_id uuid primary key references public.loyalty_businesses(id),
 plan_code text not null default 'pilot' check(plan_code in ('pilot','standard','advanced')),
 monthly_sms_limit integer not null default 0 check(monthly_sms_limit between 0 and 1000000),
 revision bigint not null default 1, updated_at timestamptz not null default now(), updated_by uuid references auth.users(id)
);
alter table public.loyalty_business_accounts enable row level security;
revoke all on public.loyalty_business_accounts from public,anon,authenticated,service_role;
grant select on public.loyalty_business_accounts to authenticated;
create policy loyalty_account_owner_read on public.loyalty_business_accounts for select to authenticated using(public.loyalty_role(business_id)='owner');
insert into public.loyalty_business_accounts(business_id) select id from public.loyalty_businesses;

create function public.loyalty_account_defaults() returns trigger language plpgsql security definer set search_path=pg_catalog,public as $$
begin
 insert into public.loyalty_business_accounts(business_id) values(NEW.id);
 return NEW;
end $$;
revoke all on function public.loyalty_account_defaults() from public,anon,authenticated,service_role;
create trigger loyalty_account_defaults after insert on public.loyalty_businesses for each row execute function public.loyalty_account_defaults();

create function public.loyalty_platform_list(p_actor uuid,p_search text default '',p_state text default 'all',p_page integer default 1,p_size integer default 25) returns jsonb
language plpgsql stable security definer set search_path=pg_catalog,public as $$
declare result jsonb;
begin
 if not exists(select 1 from public.site_admins where user_id=p_actor) then raise exception 'ADMIN_REQUIRED'; end if;
 if p_search is null or char_length(p_search)>100 or p_state is null or p_state not in ('all','active','paused') or p_page is null or p_page not between 1 and 100000 or p_size is null or p_size not between 1 and 100 then raise exception 'INVALID_PAGE'; end if;
 with matching as (
  select b.*,a.plan_code,a.monthly_sms_limit,a.revision,a.updated_at from public.loyalty_businesses b join public.loyalty_business_accounts a on a.business_id=b.id
  where (trim(p_search)='' or strpos(lower(b.name||' '||b.slug),lower(trim(p_search)))>0)
   and (p_state='all' or (p_state='active' and b.active) or (p_state='paused' and not b.active))
 ), page_rows as (
  select b.*, (select count(*) from public.loyalty_customers c where c.business_id=b.id) customer_count,
   (select count(*) from public.loyalty_campaigns c where c.business_id=b.id and c.active) active_campaigns
  from matching b order by b.created_at desc,b.id desc limit p_size offset (p_page-1)*p_size
 ) select jsonb_build_object('total',(select count(*) from matching),'page',p_page,'size',p_size,
  'businesses',coalesce((select jsonb_agg(b order by b.created_at desc,b.id desc) from page_rows b),'[]'::jsonb),
  'summary',jsonb_build_object('businesses',(select count(*) from public.loyalty_businesses),
   'active',(select count(*) from public.loyalty_businesses where active),'paused',(select count(*) from public.loyalty_businesses where not active))) into result;
 return result;
end $$;
revoke all on function public.loyalty_platform_list(uuid,text,text,integer,integer) from public,anon,authenticated;
grant execute on function public.loyalty_platform_list(uuid,text,text,integer,integer) to service_role;

create function public.loyalty_platform_save(p_actor uuid,p_business uuid,p_revision bigint,p_plan text,p_monthly_sms_limit integer,p_active boolean) returns jsonb
language plpgsql security definer set search_path=pg_catalog,public as $$
declare prior public.loyalty_business_accounts; result jsonb;
begin
 if not exists(select 1 from public.site_admins where user_id=p_actor) then raise exception 'ADMIN_REQUIRED'; end if;
 if p_revision is null or p_revision<1 or p_plan is null or p_plan not in ('pilot','standard','advanced') or p_monthly_sms_limit is null or p_monthly_sms_limit not between 0 and 1000000 or p_active is null then raise exception 'INVALID_ACCOUNT'; end if;
 perform 1 from public.loyalty_businesses where id=p_business for update;
 if not found then raise exception 'BUSINESS_UNAVAILABLE'; end if;
 select * into prior from public.loyalty_business_accounts where business_id=p_business for update;
 if not found then raise exception 'BUSINESS_UNAVAILABLE'; end if;
 if prior.revision<>p_revision then raise exception 'REVISION_CONFLICT'; end if;
 update public.loyalty_business_accounts set plan_code=p_plan,monthly_sms_limit=p_monthly_sms_limit,revision=revision+1,updated_at=now(),updated_by=p_actor where business_id=p_business;
 update public.loyalty_businesses set active=p_active where id=p_business;
 insert into public.loyalty_admin_events(business_id,actor_id,action,ref,details)
  values(p_business,p_actor,'business_settings_saved',p_business,jsonb_build_object('plan',p_plan,'monthly_sms_limit',p_monthly_sms_limit,'active',p_active));
 result=jsonb_build_object('ok',true,'revision',prior.revision+1);
 return result;
end $$;
revoke all on function public.loyalty_platform_save(uuid,uuid,bigint,text,integer,boolean) from public,anon,authenticated;
grant execute on function public.loyalty_platform_save(uuid,uuid,bigint,text,integer,boolean) to service_role;

notify pgrst,'reload schema';
commit;
