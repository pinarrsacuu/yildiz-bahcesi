-- Yıldız Bahçesi — ilk şema
-- Bu dosya Supabase SQL Editor'e yapıştırılıp çalıştırılacak (Faz 1).

create extension if not exists "pgcrypto";

create type event_type as enum (
  'dogum_gunu', 'nisan', 'dugun', 'baby_shower', 'soz', 'diger'
);

create type appointment_status as enum (
  'pending', 'approved', 'rejected', 'completed'
);

create type staff_role as enum ('owner', 'staff');

-- Personel profili (Supabase Auth kullanıcısına bağlı)
create table staff_users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  role staff_role not null default 'staff',
  created_at timestamptz not null default now()
);

-- Randevu talepleri
create table appointment_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  event_type event_type not null,
  guest_count int not null check (guest_count > 0),
  requested_date date not null,
  alternate_date date,
  message text,
  status appointment_status not null default 'pending',
  staff_note text,
  access_token text not null unique default encode(gen_random_bytes(16), 'hex'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Menü / paket içerikleri
create table packages (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('menu', 'paket')),
  title text not null,
  description text not null default '',
  price_info text,
  images text[] not null default '{}',
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Statik site içeriği (Anasayfa / Biz Kimiz / Neler Yapıyoruz)
create table venue_content (
  id uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title text not null default '',
  body text not null default '',
  images text[] not null default '{}',
  updated_at timestamptz not null default now()
);

-- Etkinlikler (QR foto teslim akışının merkezi)
create table events (
  id uuid primary key default gen_random_uuid(),
  appointment_request_id uuid references appointment_requests (id),
  customer_name text not null,
  event_type event_type not null,
  event_date date not null,
  qr_token text not null unique default encode(gen_random_bytes(24), 'hex'),
  qr_image_path text,
  photos_expire_at timestamptz,
  created_by uuid references staff_users (id),
  created_at timestamptz not null default now()
);

create index events_qr_token_idx on events (qr_token);

-- Etkinliğe bağlı fotoğraflar
create table photos (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  storage_path text not null,
  thumbnail_path text,
  uploaded_by uuid references staff_users (id),
  uploaded_at timestamptz not null default now(),
  caption text
);

create index photos_event_id_idx on photos (event_id);

-- updated_at otomatik güncelleme
create function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger appointment_requests_set_updated_at
  before update on appointment_requests
  for each row execute function set_updated_at();

create trigger packages_set_updated_at
  before update on packages
  for each row execute function set_updated_at();

-- Misafirin QR token ile giriş yapmadan sadece kendi etkinliğinin
-- fotoğraflarını görebilmesini sağlayan fonksiyon.
-- Süresi geçmiş etkinliklerde (photos_expire_at < now()) boş sonuç döner.
create function get_event_photos(token text)
returns table (
  photo_id uuid,
  storage_path text,
  thumbnail_path text,
  caption text,
  uploaded_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select p.id, p.storage_path, p.thumbnail_path, p.caption, p.uploaded_at
  from photos p
  join events e on e.id = p.event_id
  where e.qr_token = token
    and (e.photos_expire_at is null or e.photos_expire_at > now())
  order by p.uploaded_at asc;
$$;

-- Row Level Security
alter table staff_users enable row level security;
alter table appointment_requests enable row level security;
alter table packages enable row level security;
alter table venue_content enable row level security;
alter table events enable row level security;
alter table photos enable row level security;

-- staff_users: sadece giriş yapmış personel kendi kaydını ve diğer personeli görebilir
create policy staff_users_select on staff_users
  for select using (auth.uid() is not null);

-- appointment_requests: herkes (anonim müşteri) yeni talep oluşturabilir,
-- sadece personel listeyi görüp güncelleyebilir
create policy appointment_requests_insert on appointment_requests
  for insert with check (true);

create policy appointment_requests_staff_select on appointment_requests
  for select using (auth.uid() is not null);

create policy appointment_requests_staff_update on appointment_requests
  for update using (auth.uid() is not null);

-- packages / venue_content: herkes aktif içeriği okuyabilir, sadece personel düzenler
create policy packages_public_select on packages
  for select using (is_active = true or auth.uid() is not null);

create policy packages_staff_write on packages
  for insert with check (auth.uid() is not null);

create policy packages_staff_update on packages
  for update using (auth.uid() is not null);

create policy packages_staff_delete on packages
  for delete using (auth.uid() is not null);

create policy venue_content_public_select on venue_content
  for select using (true);

create policy venue_content_staff_write on venue_content
  for insert with check (auth.uid() is not null);

create policy venue_content_staff_update on venue_content
  for update using (auth.uid() is not null);

-- events / photos: doğrudan tablo erişimi sadece personele açık.
-- Misafir erişimi yalnızca get_event_photos(token) fonksiyonu üzerinden.
create policy events_staff_all on events
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

create policy photos_staff_all on photos
  for all using (auth.uid() is not null) with check (auth.uid() is not null);

-- Storage bucket'ları
insert into storage.buckets (id, name, public)
values
  ('package-images', 'package-images', true),
  ('venue-content', 'venue-content', true),
  ('qr-codes', 'qr-codes', true),
  ('event-photos', 'event-photos', false)
on conflict (id) do nothing;

create policy "package-images herkese açık okuma"
  on storage.objects for select
  using (bucket_id = 'package-images');

create policy "package-images personel yazma"
  on storage.objects for insert
  with check (bucket_id = 'package-images' and auth.uid() is not null);

create policy "venue-content herkese açık okuma"
  on storage.objects for select
  using (bucket_id = 'venue-content');

create policy "venue-content personel yazma"
  on storage.objects for insert
  with check (bucket_id = 'venue-content' and auth.uid() is not null);

create policy "qr-codes herkese açık okuma"
  on storage.objects for select
  using (bucket_id = 'qr-codes');

create policy "qr-codes personel yazma"
  on storage.objects for insert
  with check (bucket_id = 'qr-codes' and auth.uid() is not null);

create policy "event-photos sadece personel"
  on storage.objects for all
  using (bucket_id = 'event-photos' and auth.uid() is not null)
  with check (bucket_id = 'event-photos' and auth.uid() is not null);
