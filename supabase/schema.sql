-- ============================================================
-- Doctor Profile Template — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`)
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Clinics / Hospitals ----------
create table if not exists clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  city text,
  created_at timestamptz not null default now()
);

-- ---------- Doctors ----------
create table if not exists doctors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  full_name text not null,
  credentials text,                  -- e.g. "MD, DM Cardiology"
  designation text,                  -- e.g. "Director & HOD, Interventional Cardiology"
  specialties text[] not null default '{}',
  experience_years int,
  photo_url text,
  bio text,
  phone text,
  whatsapp text,
  email text,
  created_at timestamptz not null default now()
);

-- ---------- Doctor <-> Clinic (a doctor can practice at multiple clinics) ----------
create table if not exists doctor_clinics (
  doctor_id uuid references doctors(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete cascade,
  primary key (doctor_id, clinic_id)
);

-- ---------- Work experience timeline ----------
create table if not exists doctor_experience (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  role text not null,
  organization text not null,
  period text not null,              -- free text, e.g. "2012 - Present"
  sort_order int not null default 0
);

-- ---------- Education & training ----------
create table if not exists doctor_education (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  qualification text not null,
  institution text,
  year text,
  sort_order int not null default 0
);

-- ---------- Available appointment slots ----------
create table if not exists appointment_slots (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete cascade,
  slot_date date not null,
  slot_time time not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  unique (doctor_id, clinic_id, slot_date, slot_time)
);

-- ---------- Appointments (booked) ----------
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references appointment_slots(id) on delete set null,
  doctor_id uuid references doctors(id) on delete cascade,
  clinic_id uuid references clinics(id) on delete cascade,
  patient_name text not null,
  patient_phone text not null,
  patient_email text,
  reason text,
  status text not null default 'confirmed', -- confirmed | cancelled | completed
  token_number int,
  created_at timestamptz not null default now()
);

-- ---------- Callback / lead capture requests ----------
create table if not exists callback_requests (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete set null,
  full_name text not null,
  phone text not null,
  whatsapp_opt_in boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------- Blog posts ----------
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  doctor_id uuid references doctors(id) on delete set null,
  slug text unique not null,
  title text not null,
  excerpt text,
  cover_image_url text,
  tags text[] default '{}',
  published_at timestamptz default now()
);

-- ---------- Helpful indexes ----------
create index if not exists idx_slots_doctor_date on appointment_slots (doctor_id, slot_date);
create index if not exists idx_appointments_doctor on appointments (doctor_id);
create index if not exists idx_blog_doctor on blog_posts (doctor_id);

-- ============================================================
-- Row Level Security
-- Public can READ doctor/clinic/slot/blog data.
-- Public can INSERT appointments & callback_requests (booking a slot),
-- but cannot read other patients' appointment data.
-- ============================================================

alter table doctors enable row level security;
alter table clinics enable row level security;
alter table doctor_clinics enable row level security;
alter table doctor_experience enable row level security;
alter table doctor_education enable row level security;
alter table appointment_slots enable row level security;
alter table appointments enable row level security;
alter table callback_requests enable row level security;
alter table blog_posts enable row level security;

create policy "public read doctors" on doctors for select using (true);
create policy "public read clinics" on clinics for select using (true);
create policy "public read doctor_clinics" on doctor_clinics for select using (true);
create policy "public read experience" on doctor_experience for select using (true);
create policy "public read education" on doctor_education for select using (true);
create policy "public read slots" on appointment_slots for select using (true);
create policy "public read blog" on blog_posts for select using (true);

-- Anyone can book an available slot (insert an appointment).
create policy "public insert appointments" on appointments for insert with check (true);

-- Anyone can submit a callback request.
create policy "public insert callback" on callback_requests for insert with check (true);

-- Allow updating a slot to mark it booked (needed at booking time).
create policy "public update slot booking" on appointment_slots for update using (true) with check (true);

-- ============================================================
-- Seed data — replace with your own doctor's details
-- ============================================================

insert into clinics (id, name, address, city)
values ('00000000-0000-0000-0000-000000000001', 'EasyMyCare Clinic', 'Dwarka', 'New Delhi')
on conflict (id) do nothing;

insert into doctors (
  id, slug, full_name, credentials, designation, specialties,
  experience_years, photo_url, bio, phone, whatsapp, email
) values (
  '00000000-0000-0000-0000-000000000002',
  'dr-shivesh-kumar',
  'Dr. Shivesh Kumar',
  'MD, DM Cardiology',
  'Consultant Cardiologist',
  array['Cardiology', 'Interventional Cardiology', 'Heart Failure'],
  14,
  null,
  'Dr. Shivesh Kumar is a Consultant Cardiologist with 14+ years of clinical experience, founder of EMC Digitals, and lead of EasyMyCare Clinic.',
  null,
  null,
  'drshivesh@gmail.com'
) on conflict (id) do nothing;

insert into doctor_clinics (doctor_id, clinic_id)
values ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into doctor_experience (doctor_id, role, organization, period, sort_order) values
  ('00000000-0000-0000-0000-000000000002', 'Founder & Consultant Cardiologist', 'EasyMyCare Clinic', '2020 - Present', 1),
  ('00000000-0000-0000-0000-000000000002', 'Consultant Cardiologist', 'Prior Practice', '2012 - 2020', 2)
on conflict do nothing;

insert into doctor_education (doctor_id, qualification, institution, year, sort_order) values
  ('00000000-0000-0000-0000-000000000002', 'DM Cardiology', 'Medical Institute', '2012', 1),
  ('00000000-0000-0000-0000-000000000002', 'MD (General Medicine)', 'Medical College', '2009', 2),
  ('00000000-0000-0000-0000-000000000002', 'HEMP', 'IIM Calcutta', '2023', 3)
on conflict do nothing;
