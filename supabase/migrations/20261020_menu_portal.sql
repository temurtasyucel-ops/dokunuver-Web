begin;
-- Independent of loyalty. A site administrator assigns a verified existing Auth account.
create table public.menu_businesses (
 id uuid primary key default gen_random_uuid(),slug text not null unique check(slug ~ '^[a-z0-9][a-z0-9-]{2,59}$' and slug not in ('demo','menu')),
 name text not null check(char_length(name) between 1 and 100),active boolean not null default true,created_at timestamptz not null default now()
);
create table public.menu_members(business_id uuid not null references public.menu_businesses(id),user_id uuid not null references auth.users(id),primary key(business_id,user_id));
create table public.menu_documents (
 business_id uuid primary key references public.menu_businesses(id),draft jsonb not null,published jsonb,
 revision bigint not null default 1,updated_at timestamptz not null default now(),published_at timestamptz,
 check(jsonb_typeof(draft)='object' and octet_length(draft::text)<=350000),
 check(published is null or (jsonb_typeof(published)='object' and octet_length(published::text)<=350000))
);
create table public.menu_events(id uuid primary key default gen_random_uuid(),business_id uuid not null references public.menu_businesses(id),actor_id uuid not null references auth.users(id),action text not null,created_at timestamptz not null default now());
alter table public.menu_businesses enable row level security;
alter table public.menu_members enable row level security;
alter table public.menu_documents enable row level security;
alter table public.menu_events enable row level security;
revoke all on public.menu_businesses,public.menu_members,public.menu_documents,public.menu_events from public,anon,authenticated,service_role;
create function public.menu_public(p_slug text) returns jsonb language sql stable security definer set search_path=pg_catalog,public as $$
 select jsonb_build_object('slug',b.slug,'document',d.published,'published_at',d.published_at) from public.menu_businesses b join public.menu_documents d on d.business_id=b.id where b.slug=p_slug and b.active and d.published is not null
$$;
create function public.menu_owned(p_actor uuid,p_business uuid default null) returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
begin
 if p_actor is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_business is null then return (select coalesce(jsonb_agg(jsonb_build_object('id',b.id,'slug',b.slug,'name',b.name,'active',b.active) order by b.name),'[]'::jsonb) from public.menu_businesses b join public.menu_members m on m.business_id=b.id where m.user_id=p_actor); end if;
 if not exists(select 1 from public.menu_members where business_id=p_business and user_id=p_actor) then raise exception 'MENU_ACCESS_REQUIRED'; end if;
 return (select jsonb_build_object('id',b.id,'slug',b.slug,'active',b.active,'draft',d.draft,'revision',d.revision,'published_at',d.published_at,'updated_at',d.updated_at) from public.menu_businesses b join public.menu_documents d on d.business_id=b.id where b.id=p_business);
end $$;
create function public.menu_save(p_actor uuid,p_business uuid,p_revision bigint,p_draft jsonb,p_published jsonb default null) returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
declare d public.menu_documents;
begin
 if not exists(select 1 from public.menu_members where business_id=p_business and user_id=p_actor) then raise exception 'MENU_ACCESS_REQUIRED'; end if;
 perform 1 from public.menu_businesses where id=p_business and active for update;
 if not found then raise exception 'BUSINESS_PAUSED'; end if;
 select * into d from public.menu_documents where business_id=p_business for update;
 if p_revision is null or d.revision<>p_revision then raise exception 'REVISION_CONFLICT'; end if;
 if p_draft is null or jsonb_typeof(p_draft->'profile') is distinct from 'object' or jsonb_typeof(p_draft->'categories') is distinct from 'array' or jsonb_typeof(p_draft->'items') is distinct from 'array' then raise exception 'INVALID_DOCUMENT'; end if;
 if p_published is not null and (jsonb_typeof(p_published->'items') is distinct from 'array' or jsonb_array_length(p_published->'items')=0) then raise exception 'INVALID_PUBLICATION'; end if;
 update public.menu_documents set draft=p_draft,published=coalesce(p_published,published),revision=revision+1,updated_at=now(),published_at=case when p_published is not null then now() else published_at end where business_id=p_business;
 update public.menu_businesses set name=p_draft->'profile'->>'name' where id=p_business;
 insert into public.menu_events(business_id,actor_id,action) values(p_business,p_actor,case when p_published is null then 'draft_saved' else 'published' end);
 return public.menu_owned(p_actor,p_business);
end $$;
create function public.menu_admin_list(p_actor uuid) returns jsonb language plpgsql security definer set search_path=pg_catalog,public as $$
begin
 if not exists(select 1 from public.site_admins where user_id=p_actor) then raise exception 'ADMIN_REQUIRED'; end if;
 return (select coalesce(jsonb_agg(jsonb_build_object('id',b.id,'slug',b.slug,'name',b.name,'active',b.active,'published_at',d.published_at) order by b.created_at desc),'[]'::jsonb) from public.menu_businesses b join public.menu_documents d on d.business_id=b.id);
end $$;
create function public.menu_provision(p_actor uuid,p_slug text,p_name text,p_email text,p_document jsonb) returns uuid language plpgsql security definer set search_path=pg_catalog,public as $$
declare owner_id uuid; bid uuid;
begin
 if not exists(select 1 from public.site_admins where user_id=p_actor) then raise exception 'ADMIN_REQUIRED'; end if;
 select id into owner_id from auth.users where lower(email)=lower(trim(p_email)) and email_confirmed_at is not null;
 if owner_id is null then raise exception 'VERIFIED_OWNER_REQUIRED'; end if;
 insert into public.menu_businesses(slug,name) values(p_slug,p_name) returning id into bid;
 insert into public.menu_members values(bid,owner_id);
 insert into public.menu_documents(business_id,draft) values(bid,p_document);
 insert into public.menu_events(business_id,actor_id,action) values(bid,p_actor,'created');
 return bid;
end $$;
create function public.menu_set_active(p_actor uuid,p_business uuid,p_active boolean) returns boolean language plpgsql security definer set search_path=pg_catalog,public as $$
begin
 if not exists(select 1 from public.site_admins where user_id=p_actor) then raise exception 'ADMIN_REQUIRED'; end if;
 if p_active is null then raise exception 'INVALID_STATE'; end if;
 update public.menu_businesses set active=p_active where id=p_business;
 if not found then raise exception 'BUSINESS_MISSING'; end if;
 insert into public.menu_events(business_id,actor_id,action) values(p_business,p_actor,case when p_active then 'resumed' else 'paused' end);return true;
end $$;
revoke all on function public.menu_public(text) from public;
grant execute on function public.menu_public(text) to anon,authenticated;
revoke all on function public.menu_owned(uuid,uuid),public.menu_save(uuid,uuid,bigint,jsonb,jsonb),public.menu_admin_list(uuid),public.menu_provision(uuid,text,text,text,jsonb),public.menu_set_active(uuid,uuid,boolean) from public,anon,authenticated;
grant execute on function public.menu_owned(uuid,uuid),public.menu_save(uuid,uuid,bigint,jsonb,jsonb),public.menu_admin_list(uuid),public.menu_provision(uuid,text,text,text,jsonb),public.menu_set_active(uuid,uuid,boolean) to service_role;
-- Supabase Storage exists in hosted Supabase; local SQL tests may omit that schema.
do $$ begin
 if to_regclass('storage.buckets') is not null then
  execute $storage$insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('menu-media','menu-media',true,3145728,array['image/png','image/jpeg','image/webp']) on conflict(id) do nothing$storage$;
 end if;
end $$;
commit;
