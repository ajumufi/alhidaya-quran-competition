-- Run this entire script in Supabase Dashboard > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  registration_code text unique not null default ('AHQ-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  full_name text not null,
  phone text not null,
  whatsapp text not null,
  email text,
  district text not null,
  institution text not null,
  category text not null,
  transaction_id text not null,
  payment_proof text not null,
  payment_status text not null default 'pending' check (payment_status in ('pending','verified','rejected')),
  created_at timestamptz not null default now()
);

alter table public.registrations enable row level security;

-- Public visitors can submit a registration. They cannot read, update or delete registrations.
create policy "Public can submit registrations"
on public.registrations for insert
to anon, authenticated
with check (
  length(trim(full_name)) between 2 and 120
  and length(trim(phone)) between 10 and 20
  and length(trim(whatsapp)) between 10 and 20
  and length(trim(transaction_id)) between 6 and 80
);

-- Storage bucket for screenshots. Keep files private.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-proofs', 'payment-proofs', false, 5242880, array['image/png','image/jpeg','application/pdf'])
on conflict (id) do nothing;

create policy "Public can upload payment proof"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'payment-proofs');

-- Admin access:
-- Create an admin user in Supabase Authentication > Users.
-- Then use the SQL below to grant access only to that user's UUID:
-- create policy "Admins can read registrations" on public.registrations
-- for select to authenticated using (auth.uid() = 'REPLACE-WITH-ADMIN-USER-UUID'::uuid);
-- create policy "Admins can update registrations" on public.registrations
-- for update to authenticated using (auth.uid() = 'REPLACE-WITH-ADMIN-USER-UUID'::uuid)
-- with check (auth.uid() = 'REPLACE-WITH-ADMIN-USER-UUID'::uuid);
-- create policy "Admins can read payment proofs" on storage.objects
-- for select to authenticated using (
--   bucket_id = 'payment-proofs'
--   and auth.uid() = 'REPLACE-WITH-ADMIN-USER-UUID'::uuid
-- );
