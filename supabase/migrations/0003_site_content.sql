-- ---------------------------------------------------------------------------
-- Decha Agency — yönetim paneli için içerik tabloları ve eksik politikalar
-- ---------------------------------------------------------------------------
-- Sitedeki metinler koddaki varsayılanlarıyla kalır; buradaki kayıtlar yalnızca
-- ÜZERİNE YAZAR. Tablolar boşken site bugünkü hâliyle çalışır, veri göçü
-- gerekmez. Bir metni düzenlemek tek satırlık bir upsert'tür.
--
-- Anahtar düzeni: sayfa.bolum.alan  (örn. home.hizmetler.baslik)
-- ---------------------------------------------------------------------------

-- Tekil metinler
create table if not exists public.site_copy (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

-- Diziler: sosyal bağlantılar, istatistikler, süreç adımları, SSS,
-- hakkımızda ilkeleri ve ekip listesi gibi tekrar eden içerik.
create table if not exists public.site_lists (
  key text primary key,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_copy enable row level security;
alter table public.site_lists enable row level security;

-- Tablo yetkileri açıkça veriliyor. Supabase public şemasına varsayılan
-- yetkiler tanımlar ama buna güvenmiyoruz: göç kendi başına eksiksiz olmalı,
-- yoksa varsayılanları değiştirilmiş bir projede tablolar sessizce okunamaz
-- hâle gelir. Asıl daraltmayı RLS politikaları yapar.
grant select on public.site_copy, public.site_lists to anon, authenticated;
grant insert, update, delete on public.site_copy, public.site_lists to authenticated;

-- Herkes okur (site içeriği), yalnızca giriş yapmış yönetici yazar.
-- Mevcut içerik tablolarıyla aynı desen (0001_init.sql).
drop policy if exists site_copy_public_read on public.site_copy;
create policy site_copy_public_read on public.site_copy
  for select to anon, authenticated using (true);

drop policy if exists site_copy_admin_write on public.site_copy;
create policy site_copy_admin_write on public.site_copy
  for all to authenticated using (true) with check (true);

drop policy if exists site_lists_public_read on public.site_lists;
create policy site_lists_public_read on public.site_lists
  for select to anon, authenticated using (true);

drop policy if exists site_lists_admin_write on public.site_lists;
create policy site_lists_admin_write on public.site_lists
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Gelen kutusu için eksik politikalar
-- ---------------------------------------------------------------------------
-- 0001_init.sql bu iki tabloya yalnızca insert (anon) + select (authenticated)
-- verdi. Panelden bir mesajı "okundu" işaretlemek ya da bir toplantıyı iptal
-- etmek için update gerekiyor; silme de yönetici için açılıyor.

drop policy if exists contact_messages_admin_update on public.contact_messages;
create policy contact_messages_admin_update on public.contact_messages
  for update to authenticated using (true) with check (true);

drop policy if exists contact_messages_admin_delete on public.contact_messages;
create policy contact_messages_admin_delete on public.contact_messages
  for delete to authenticated using (true);

drop policy if exists meeting_requests_admin_update on public.meeting_requests;
create policy meeting_requests_admin_update on public.meeting_requests
  for update to authenticated using (true) with check (true);

drop policy if exists meeting_requests_admin_delete on public.meeting_requests;
create policy meeting_requests_admin_delete on public.meeting_requests
  for delete to authenticated using (true);
