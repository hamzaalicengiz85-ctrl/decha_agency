-- =============================================================
-- Decha Agency — Supabase şeması
-- Supabase Dashboard > SQL Editor içinde bu dosyayı çalıştırın.
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- Hizmetler
-- -------------------------------------------------------------
create table if not exists public.services (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  summary     text,
  icon        text default 'sparkles',
  features    jsonb not null default '[]'::jsonb,
  price_from  numeric,
  order_no    integer not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------
-- Projeler
-- -------------------------------------------------------------
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  client      text,
  category    text,
  year        integer,
  summary     text,
  description text,
  cover_url   text,
  tags        jsonb not null default '[]'::jsonb,
  metrics     jsonb not null default '[]'::jsonb,
  featured    boolean not null default false,
  order_no    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------
-- Referanslar
-- -------------------------------------------------------------
create table if not exists public.testimonials (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  role        text,
  company     text,
  quote       text not null,
  avatar_url  text,
  rating      smallint not null default 5 check (rating between 1 and 5),
  order_no    integer not null default 0,
  created_at  timestamptz not null default now()
);

-- -------------------------------------------------------------
-- Blog yazıları
-- -------------------------------------------------------------
create table if not exists public.posts (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  excerpt       text,
  content       text,
  cover_url     text,
  category      text,
  author        text default 'Decha Ekibi',
  published_at  date not null default current_date,
  created_at    timestamptz not null default now()
);

-- -------------------------------------------------------------
-- İletişim formu mesajları
-- -------------------------------------------------------------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(trim(name)) between 2 and 120),
  email       text not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'),
  phone       text,
  company     text,
  service     text,
  budget      text,
  message     text not null check (char_length(trim(message)) between 10 and 5000),
  status      text not null default 'new' check (status in ('new', 'in_progress', 'done', 'spam')),
  created_at  timestamptz not null default now()
);

create index if not exists projects_featured_idx on public.projects (featured, order_no);
create index if not exists posts_published_idx on public.posts (published_at desc);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- =============================================================
-- Row Level Security
-- İçerik tabloları herkese okunabilir; yazma yalnızca authenticated
-- kullanıcıya (yönetim paneli) açıktır. contact_messages yalnızca
-- INSERT edilebilir, okunamaz — böylece gelen mesajlar dışarı sızmaz.
-- =============================================================
alter table public.services         enable row level security;
alter table public.projects         enable row level security;
alter table public.testimonials     enable row level security;
alter table public.posts            enable row level security;
alter table public.contact_messages enable row level security;

drop policy if exists "services_public_read" on public.services;
create policy "services_public_read" on public.services
  for select to anon, authenticated using (is_active = true);

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all to authenticated using (true) with check (true);

drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects
  for select to anon, authenticated using (true);

drop policy if exists "projects_admin_write" on public.projects;
create policy "projects_admin_write" on public.projects
  for all to authenticated using (true) with check (true);

drop policy if exists "testimonials_public_read" on public.testimonials;
create policy "testimonials_public_read" on public.testimonials
  for select to anon, authenticated using (true);

drop policy if exists "testimonials_admin_write" on public.testimonials;
create policy "testimonials_admin_write" on public.testimonials
  for all to authenticated using (true) with check (true);

drop policy if exists "posts_public_read" on public.posts;
create policy "posts_public_read" on public.posts
  for select to anon, authenticated using (published_at <= current_date);

drop policy if exists "posts_admin_write" on public.posts;
create policy "posts_admin_write" on public.posts
  for all to authenticated using (true) with check (true);

-- Ziyaretçi mesaj gönderebilir ama hiçbir mesajı okuyamaz.
drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert" on public.contact_messages
  for insert to anon, authenticated with check (true);

drop policy if exists "contact_messages_admin_read" on public.contact_messages;
create policy "contact_messages_admin_read" on public.contact_messages
  for select to authenticated using (true);
