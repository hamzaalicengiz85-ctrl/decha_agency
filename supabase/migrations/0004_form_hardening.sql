-- =============================================================
-- Form tablolarının sertleştirilmesi
--
-- contact_messages ve meeting_requests'e anonim INSERT açık olmak
-- zorunda (form ziyaretçi tarafından doldurulur). Bu, uzunluğu
-- sınırlanmamış alanları bir kötüye kullanım yüzeyi hâline getiriyor:
-- name/email/message zaten kısıtlı ama phone, company, service ve budget
-- serbest metin ve megabaytlarca veri kabul ediyor.
--
-- Ek olarak site metni tablolarının anahtar ve değer uzunlukları
-- sınırlanıyor; yönetim paneli oturumu ele geçirilse bile tek satırla
-- veritabanını şişirmek mümkün olmasın.
--
-- Göç tekrar çalıştırılabilir: kısıtlar önce düşürülüp yeniden eklenir.
-- =============================================================

alter table public.contact_messages
  drop constraint if exists contact_messages_phone_len,
  drop constraint if exists contact_messages_company_len,
  drop constraint if exists contact_messages_service_len,
  drop constraint if exists contact_messages_budget_len;

alter table public.contact_messages
  add constraint contact_messages_phone_len
    check (phone is null or char_length(phone) <= 32),
  add constraint contact_messages_company_len
    check (company is null or char_length(company) <= 160),
  add constraint contact_messages_service_len
    check (service is null or char_length(service) <= 120),
  add constraint contact_messages_budget_len
    check (budget is null or char_length(budget) <= 60);

-- Anlamsız tarihler kaydedilmesin. Sabit aralık kullanılıyor: CHECK
-- kısıtları IMMUTABLE olmayan current_date'i kabul etmiyor.
alter table public.meeting_requests
  drop constraint if exists meeting_requests_date_range;

alter table public.meeting_requests
  add constraint meeting_requests_date_range
    check (meeting_date between date '2024-01-01' and date '2035-12-31');

alter table public.meeting_requests
  drop constraint if exists meeting_requests_notes_len;

alter table public.meeting_requests
  add constraint meeting_requests_notes_len
    check (notes is null or char_length(notes) <= 2000);

alter table public.site_copy
  drop constraint if exists site_copy_key_len,
  drop constraint if exists site_copy_value_len;

alter table public.site_copy
  add constraint site_copy_key_len check (char_length(key) between 1 and 160),
  add constraint site_copy_value_len check (char_length(value) <= 20000);

alter table public.site_lists
  drop constraint if exists site_lists_key_len,
  drop constraint if exists site_lists_items_len;

alter table public.site_lists
  add constraint site_lists_key_len check (char_length(key) between 1 and 160),
  -- jsonb'nin metin uzunluğu: 200 öğelik bir liste bile bunun çok altında.
  add constraint site_lists_items_len check (char_length(items::text) <= 200000);
