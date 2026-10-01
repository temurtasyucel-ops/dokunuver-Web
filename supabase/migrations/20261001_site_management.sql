begin;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;
grant select on public.site_admins to service_role;

create table if not exists public.site_content (
  id integer primary key check (id = 1),
  content jsonb not null,
  revision bigint not null default 1 check (revision > 0),
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
revoke all on public.site_content from anon, authenticated;
grant select, update on public.site_content to service_role;

insert into public.site_content (id, content)
values (1, '{"settings":{"stand_price":50,"shipping_text":"Kargo alıcıya aittir.","hero_image":"/images/dokunuver-icon.png"},"banner":{"enabled":false,"title":"","text":"","image":"","starts_at":null,"ends_at":null},"products":[{"id":"google-yorum","title":"Google Yorum Kartı","description":"Müşterilerinizi Google yorum sayfanıza NFC veya QR ile kolayca yönlendirin.","image":"/images/google-yorum-nfc.png","price":250,"campaign":{"enabled":false,"price":null,"label":"","starts_at":null,"ends_at":null}},{"id":"instagram","title":"Instagram Kartı","description":"Instagram profilinizi müşterilerinizle NFC veya QR üzerinden kolayca paylaşın.","image":"/images/instagram-nfc.png","price":250,"campaign":{"enabled":false,"price":null,"label":"","starts_at":null,"ends_at":null}},{"id":"whatsapp","title":"WhatsApp Kartı","description":"Müşterilerinizin numaranızı kaydetmeden WhatsApp bağlantınıza ulaşmasını kolaylaştırın.","image":"/images/whatsapp-nfc.png","price":250,"campaign":{"enabled":false,"price":null,"label":"","starts_at":null,"ends_at":null}},{"id":"iban","title":"IBAN Kartı","description":"Doğrulanmış banka, hesap sahibi ve IBAN bilgilerinizi NFC veya QR üzerinden kolayca paylaşın.","image":"/images/iban-nfc.png","price":250,"campaign":{"enabled":false,"price":null,"label":"","starts_at":null,"ends_at":null}},{"id":"ilan","title":"İlan Kartı","description":"İlan bağlantınızı NFC veya QR ile müşterilerinize doğrudan ulaştırın.","image":"/images/ilan-nfc.png","price":250,"campaign":{"enabled":false,"price":null,"label":"","starts_at":null,"ends_at":null}}]}'::jsonb)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 3145728, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- Site media is public to view. Uploads are handled by the authenticated backend.
-- No browser write policies are created. Existing IBAN/Smart Link tables are untouched.
commit;
