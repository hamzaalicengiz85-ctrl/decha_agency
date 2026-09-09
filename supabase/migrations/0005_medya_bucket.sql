-- Görsel deposu: ekip fotoğrafları ve ileride kart görselleri.
--
-- Neden depolama, neden yalnız adres alanı değil: site sahibinin elindeki
-- fotoğrafı bir yere yükleyip adresini kopyalaması gerekiyordu. Panelden
-- doğrudan yükleme, uydurma monogramları gerçek fotoğrafla değiştirmenin
-- tek pratik yolu.
--
-- Güvenlik:
--   okuma  → herkese açık (görsel zaten sitede görünecek)
--   yazma  → yalnız `authenticated`, yani panele girmiş yönetici
--   boyut  → 3 MB, tür → yalnız görsel; aksi hâlde depo dosya sunucusuna döner

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'medya',
  'medya',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- Politikalar (her biri yalnız 'medya' kovasına bakar)
drop policy if exists "medya herkese okunur" on storage.objects;
create policy "medya herkese okunur"
  on storage.objects for select
  using (bucket_id = 'medya');

drop policy if exists "medya yoneticiye yazilir" on storage.objects;
create policy "medya yoneticiye yazilir"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'medya');

drop policy if exists "medya yoneticiye guncellenir" on storage.objects;
create policy "medya yoneticiye guncellenir"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'medya')
  with check (bucket_id = 'medya');

drop policy if exists "medya yoneticiye silinir" on storage.objects;
create policy "medya yoneticiye silinir"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'medya');
