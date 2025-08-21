-- Profiles table
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid,
  full_name text,
  email text unique,
  phone text,
  address jsonb default '{}'::jsonb,
  household jsonb default '{}'::jsonb,
  role text default 'user' check (role in ('user','partner','admin')),
  plan text default 'free' check (plan in ('free','pro','partner')),
  status text default 'active' check (status in ('active','inactive','suspended')),
  notifications jsonb default '{}'::jsonb,
  consents jsonb default '{}'::jsonb,
  beta boolean default false,
  avatar jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Plans lookup
create table if not exists public.plans (
  code text primary key,
  name text not null,
  limits jsonb default '{}'::jsonb
);

insert into public.plans (code,name,limits) values
  ('free','Gratis', '{"docs":100, "file_mb":10, "rules":1}'),
  ('pro','Pro', '{"docs":"unlimited", "file_mb":50, "rules":"many"}'),
  ('partner','Partner', '{"docs":"unlimited", "file_mb":50, "rules":"many", "partner_tools":true}')
on conflict (code) do nothing;

-- RLS
alter table public.profiles enable row level security;

-- For demo purposes, allow all operations (remove in production)
create policy if not exists "demo_all_access" on public.profiles
  for all using (true);

-- Production policies (commented out for demo)
-- create policy if not exists "profile_read_own" on public.profiles
--   for select using (auth.uid() = auth_id);
-- create policy if not exists "profile_upsert_own" on public.profiles
--   for insert with check (auth.uid() = auth_id);
-- create policy if not exists "profile_update_own" on public.profiles
--   for update using (auth.uid() = auth_id);


