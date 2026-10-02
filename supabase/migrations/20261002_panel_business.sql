begin;
alter table public.panel_orders add column if not exists paid_amount numeric(14,2) not null default 0;
alter table public.panel_orders add column if not exists payment_note text not null default '';
alter table public.panel_orders add column if not exists payment_status text generated always as
 (case when paid_amount>=total then 'paid' when paid_amount>0 then 'partial' else 'unpaid' end) stored;
do $$ begin
 if not exists(select 1 from pg_constraint where conname='panel_orders_payment_check' and conrelid='public.panel_orders'::regclass) then
 alter table public.panel_orders add constraint panel_orders_payment_check check(paid_amount>=0 and paid_amount<=total and char_length(payment_note)<=500);end if;
end $$;
create index if not exists panel_orders_payment_idx on public.panel_orders(payment_status,order_no desc);
create table if not exists public.panel_order_cards(
 kind text not null check(kind in ('iban','smart')),code text not null check(code~'^[A-Z0-9]{6}$'),
 order_id uuid not null references public.panel_orders(id) on delete restrict,
 product_id text not null,created_at timestamptz not null default now(),
 primary key(kind,code)
);
alter table public.panel_order_cards enable row level security;
revoke all on public.panel_order_cards from public,anon,authenticated,service_role;
grant select on public.panel_order_cards to service_role;
create index if not exists panel_order_cards_order_idx on public.panel_order_cards(order_id);
create or replace view public.panel_available_cards as
 select 'iban'::text kind,c.code,c.business_name,c.status,c.active,c.batch_code,c.created_at,'iban'::text product_type
 from public.iban_cards c where c.status in ('stock','assigned','locked') and not exists(select 1 from public.panel_order_cards l where l.kind='iban' and l.code=c.code)
 union all
 select 'smart'::text kind,c.code,c.business_name,c.status,c.active,c.batch_code,c.created_at,c.product_type
 from public.smart_links c where c.status in ('stock','assigned','locked') and not exists(select 1 from public.panel_order_cards l where l.kind='smart' and l.code=c.code);
revoke all on public.panel_available_cards from public,anon,authenticated;
grant select on public.panel_available_cards to service_role;
create or replace function public.panel_order_card_change(p_order_id uuid,p_revision bigint,p_kind text,p_product_id text,p_codes text[],p_attach boolean) returns bigint
language plpgsql security definer set search_path=pg_catalog,public as $$
declare ord public.panel_orders;target text;expected text;card record;found_count integer=0;capacity integer;used integer;
begin
 if p_kind is null or p_kind not in ('iban','smart') or p_attach is null or p_codes is null or cardinality(p_codes) not between 1 and 100 or
 (select count(distinct c) from unnest(p_codes)c)<>cardinality(p_codes) or exists(select 1 from unnest(p_codes)c where c is null or c!~'^[A-Z0-9]{6}$') then raise exception 'Invalid card selection';end if;
 select * into ord from public.panel_orders where id=p_order_id for update;
 if not found or ord.revision<>p_revision then raise exception 'Order revision conflict';end if;
 target=case when p_kind='iban' then 'iban_cards' else 'smart_links' end;
 expected=case p_product_id when 'iban' then 'iban' when 'google-yorum' then 'google' when 'instagram' then 'instagram' when 'whatsapp' then 'whatsapp' when 'ilan' then 'ilan' end;
 if p_attach then
  if ord.status='cancelled' or expected is null or (p_kind='iban')<>(expected='iban') then raise exception 'Order product unavailable';end if;
  select coalesce(sum((i->>'quantity')::integer),0) into capacity from jsonb_array_elements(ord.items)i where i->>'product_id'=p_product_id;
  select count(*) into used from public.panel_order_cards where order_id=p_order_id and product_id=p_product_id;
  if used+cardinality(p_codes)>capacity then raise exception 'Order quantity exceeded';end if;
  for card in execute format('select to_jsonb(c) data from public.%I c where code=any($1) order by code for update',target) using p_codes loop
   found_count=found_count+1;
   if coalesce(card.data->>'status','') not in ('stock','assigned','locked') or (p_kind='smart' and card.data->>'product_type' is distinct from expected) then raise exception 'Card type or status mismatch';end if;
  end loop;
  if found_count<>cardinality(p_codes) then raise exception 'Missing card';end if;
  if exists(select 1 from public.panel_order_cards where kind=p_kind and code=any(p_codes)) then raise exception 'Card already linked';end if;
  insert into public.panel_order_cards(kind,code,order_id,product_id) select p_kind,c,p_order_id,p_product_id from unnest(p_codes)c;
 else
  delete from public.panel_order_cards where order_id=p_order_id and kind=p_kind and code=any(p_codes);
  get diagnostics found_count=row_count;
  if found_count<>cardinality(p_codes) then raise exception 'Missing order link';end if;
 end if;
 update public.panel_orders set revision=revision+1,updated_at=now() where id=p_order_id;
 return ord.revision+1;
end $$;
revoke all on function public.panel_order_card_change(uuid,bigint,text,text,text[],boolean) from public,anon,authenticated;
grant execute on function public.panel_order_card_change(uuid,bigint,text,text,text[],boolean) to service_role;
create or replace function public.panel_order_card_guard() returns trigger
language plpgsql security definer set search_path=pg_catalog,public as $$
declare linked record;capacity integer;
begin
 for linked in select product_id,count(*) n from public.panel_order_cards where order_id=NEW.id group by product_id loop
  select coalesce(sum((i->>'quantity')::integer),0) into capacity from jsonb_array_elements(NEW.items)i where i->>'product_id'=linked.product_id;
  if capacity<linked.n then raise exception 'Unlink cards before reducing product quantity';end if;
 end loop;
 return NEW;
end $$;
drop trigger if exists panel_order_card_guard on public.panel_orders;
create trigger panel_order_card_guard before update of items on public.panel_orders for each row execute function public.panel_order_card_guard();
revoke all on function public.panel_order_card_guard() from public,anon,authenticated;
create or replace function public.panel_linked_card_guard() returns trigger
language plpgsql security definer set search_path=pg_catalog,public as $$
declare k text;linked boolean;
begin
 k=case when TG_TABLE_NAME='iban_cards' then 'iban' else 'smart' end;
 select exists(select 1 from public.panel_order_cards where kind=k and code=OLD.code) into linked;
 if linked then
  if TG_OP='DELETE' then raise exception 'Card linked to order';end if;
  if NEW.code<>OLD.code or (k='smart' and to_jsonb(NEW)->>'product_type' is distinct from to_jsonb(OLD)->>'product_type') then raise exception 'Card linked to order';end if;
 end if;
 if TG_OP='DELETE' then return OLD;else return NEW;end if;
end $$;
do $$ declare t text;begin foreach t in array array['iban_cards','smart_links'] loop
 execute format('drop trigger if exists panel_linked_card_guard on public.%I',t);
 execute format('create trigger panel_linked_card_guard before update or delete on public.%I for each row execute function public.panel_linked_card_guard()',t);
end loop;end $$;
revoke all on function public.panel_linked_card_guard() from public,anon,authenticated;
create table if not exists public.panel_inventory(
 id uuid primary key default gen_random_uuid(),name text not null check(char_length(name) between 1 and 100),
 category text not null check(category in ('card','stand','nfc','packaging','other')),
 unit text not null check(unit in ('adet','paket','metre')),
 quantity numeric(14,2) not null default 0 check(quantity>=0),
 low_stock_threshold numeric(12,2) not null default 0 check(low_stock_threshold>=0),
 active boolean not null default true,revision bigint not null default 1,
 created_at timestamptz not null default now(),updated_at timestamptz not null default now()
);
create table if not exists public.panel_stock_moves(
 id uuid primary key,inventory_id uuid not null references public.panel_inventory(id) on delete restrict,
 delta numeric(12,2) not null check(delta<>0),balance numeric(14,2) not null check(balance>=0),
 note text not null check(char_length(note) between 1 and 200),actor_id text,created_at timestamptz not null default now()
);
alter table public.panel_inventory enable row level security;alter table public.panel_stock_moves enable row level security;
revoke all on public.panel_inventory,public.panel_stock_moves from public,anon,authenticated,service_role;
grant select,insert,update on public.panel_inventory to service_role;
grant select on public.panel_stock_moves to service_role;
create index if not exists panel_stock_moves_item_idx on public.panel_stock_moves(inventory_id,created_at desc);
create or replace function public.panel_stock_change(p_id uuid,p_inventory_id uuid,p_delta numeric,p_note text) returns public.panel_inventory
language plpgsql security definer set search_path=pg_catalog,public as $$
declare item public.panel_inventory;prior public.panel_stock_moves;actor text;
begin
 if p_id is null or p_delta is null or p_delta=0 or abs(p_delta)>1000000 or p_delta<>round(p_delta,2) or p_note is null or char_length(trim(p_note)) not between 1 and 200 then raise exception 'Invalid stock movement';end if;
 select * into item from public.panel_inventory where id=p_inventory_id for update;
 if not found or not item.active then raise exception 'Inventory unavailable';end if;
 select * into prior from public.panel_stock_moves where id=p_id;
 if found then
  if prior.inventory_id<>p_inventory_id or prior.delta<>p_delta or prior.note<>trim(p_note) then raise exception 'Movement token reused';end if;
  return item;
 end if;
 if item.quantity+p_delta<0 then raise exception 'Insufficient stock';end if;
 actor=coalesce(nullif(current_setting('request.headers',true),''),'{}')::jsonb->>'x-panel-actor';
 update public.panel_inventory set quantity=quantity+p_delta,revision=revision+1,updated_at=now() where id=p_inventory_id returning * into item;
 insert into public.panel_stock_moves(id,inventory_id,delta,balance,note,actor_id) values(p_id,p_inventory_id,p_delta,item.quantity,trim(p_note),actor);
 return item;
end $$;
revoke all on function public.panel_stock_change(uuid,uuid,numeric,text) from public,anon,authenticated;
grant execute on function public.panel_stock_change(uuid,uuid,numeric,text) to service_role;
do $$ declare t text;begin foreach t in array array['panel_order_cards','panel_inventory','panel_stock_moves'] loop
 execute format('drop trigger if exists panel_history on public.%I',t);
 execute format('create trigger panel_history after insert or update or delete on public.%I for each row execute function public.panel_record_change()',t);
end loop;end $$;
create or replace function public.panel_record_change() returns trigger
language plpgsql security definer set search_path=pg_catalog,public as $$
declare before_row jsonb;after_row jsonb;item jsonb;changed jsonb;actor text;headers jsonb;
begin
 before_row=case when TG_OP='INSERT' then '{}'::jsonb else to_jsonb(OLD) end;
 after_row=case when TG_OP='DELETE' then '{}'::jsonb else to_jsonb(NEW) end;
 if TG_OP='UPDATE' and before_row=after_row then return NEW;end if;
 item=case when TG_OP='DELETE' then before_row else after_row end;
 select coalesce(jsonb_agg(key),'[]'::jsonb) into changed from jsonb_object_keys(before_row||after_row)key
 where key not in ('created_at','updated_at','revision') and (before_row->key) is distinct from (after_row->key);
 if TG_OP='UPDATE' and changed='[]'::jsonb then return NEW;end if;
 headers=coalesce(nullif(current_setting('request.headers',true),''),'{}')::jsonb;actor=headers->>'x-panel-actor';
 insert into public.panel_events(entity,ref,action,actor_id,details)
 values(TG_TABLE_NAME,case when TG_TABLE_NAME='panel_order_cards' then item->>'order_id' else coalesce(item->>'code',item->>'id') end,lower(TG_OP),actor,
 jsonb_strip_nulls(jsonb_build_object('fields',changed,'status',item->'status','active',item->'active','locked',item->'locked','order_no',item->'order_no',
 'card_code',case when TG_TABLE_NAME='panel_order_cards' then item->'code' else null end,'card_kind',case when TG_TABLE_NAME='panel_order_cards' then item->'kind' else null end)));
 if TG_OP='DELETE' then return OLD;else return NEW;end if;
end $$;
create or replace function public.panel_business_summary() returns jsonb
language sql security definer set search_path=pg_catalog,public as $$
 select jsonb_build_object(
 'orders',jsonb_build_object('pending',(select count(*) from public.panel_orders where status in ('new','preparing','ready')),
 'shipped',(select count(*) from public.panel_orders where status='shipped'),
 'unpaid',(select count(*) from public.panel_orders where status<>'cancelled' and paid_amount<total),
 'remaining',(select coalesce(sum(total-paid_amount),0) from public.panel_orders where status<>'cancelled')),
 'queue',coalesce((select jsonb_agg(o) from (select id,order_no,customer_name,status,created_at from public.panel_orders where status in ('new','preparing','ready') order by created_at limit 10)o),'[]'::jsonb),
 'low_stock',coalesce((select jsonb_agg(i) from (select id,name,quantity,unit,low_stock_threshold from public.panel_inventory where active and quantity<=low_stock_threshold order by quantity limit 10)i),'[]'::jsonb),
 'low_stock_count',(select count(*) from public.panel_inventory where active and quantity<=low_stock_threshold),
 'card_stock',jsonb_build_object('iban',(select count(*) from public.panel_available_cards where kind='iban' and status='stock'),
 'smart',coalesce((select jsonb_object_agg(product_type,n) from (select product_type,count(*) n from public.panel_available_cards where kind='smart' and status='stock' group by product_type)c),'{}'::jsonb)))
 $$;
revoke all on function public.panel_business_summary() from public,anon,authenticated;
grant execute on function public.panel_business_summary() to service_role;
notify pgrst,'reload schema';
commit;
