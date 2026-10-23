-- Comptes clients et catalogue (partie A).

create type public.user_role as enum ('customer', 'admin');
create type public.fit as enum ('slim', 'regular', 'loose');
create type public.product_category as enum ('shirt', 'suit');

create function public.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- Comptes ---------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text check (char_length(full_name) <= 120),
  role public.user_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- Le client ne peut modifier que son nom, jamais son rôle.
revoke update on public.profiles from authenticated, anon;
grant update (full_name) on public.profiles to authenticated;

create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- security definer : lit profiles sans repasser par sa propre RLS.
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create table public.measurements (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  height_cm numeric(4, 1) not null check (height_cm between 140 and 220),
  weight_kg numeric(4, 1) not null check (weight_kg between 40 and 200),
  age smallint not null check (age between 16 and 100),
  chest_cm numeric(4, 1) check (chest_cm between 70 and 160),
  waist_cm numeric(4, 1) check (waist_cm between 55 and 160),
  preferred_fit public.fit,
  updated_at timestamptz not null default now()
);

create trigger measurements_updated_at
  before update on public.measurements
  for each row execute function public.set_updated_at();

create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  recipient text not null check (char_length(recipient) between 1 and 120),
  line1 text not null check (char_length(line1) between 1 and 200),
  line2 text check (char_length(line2) <= 200),
  postal_code text not null check (postal_code ~ '^[0-9A-Za-z -]{3,10}$'),
  city text not null check (char_length(city) between 1 and 100),
  country text not null default 'FR' check (country ~ '^[A-Z]{2}$'),
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create index addresses_user_id_idx on public.addresses (user_id);
create unique index addresses_one_default_idx on public.addresses (user_id) where is_default;

-- Catalogue -------------------------------------------------------------

create table public.size_charts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category public.product_category not null,
  unique (id, category)
);

-- Intervalles semi-ouverts [min, max) en cm de tour de corps, comme lib/sizing.ts.
create table public.size_chart_rows (
  id uuid primary key default gen_random_uuid(),
  size_chart_id uuid not null references public.size_charts (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 10),
  sort_order smallint not null,
  chest_min numeric(4, 1) not null,
  chest_max numeric(4, 1) not null,
  waist_min numeric(4, 1),
  waist_max numeric(4, 1),
  unique (size_chart_id, label),
  unique (size_chart_id, sort_order),
  check (chest_min < chest_max),
  check ((waist_min is null) = (waist_max is null)),
  check (waist_min < waist_max)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  category public.product_category not null,
  fit public.fit not null default 'regular',
  color text not null,
  material text not null,
  price_cents integer not null check (price_cents > 0),
  image_url text,
  size_chart_id uuid not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Une chemise ne peut pas pointer vers un tableau de costumes.
  foreign key (size_chart_id, category) references public.size_charts (id, category)
);

create index products_active_category_idx on public.products (category) where is_active;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  size_label text not null,
  sku text not null unique,
  stock integer not null default 0 check (stock >= 0),
  unique (product_id, size_label)
);

-- Une variante doit correspondre à une taille du tableau de son produit.
create function public.check_variant_size() returns trigger
language plpgsql set search_path = '' as $$
begin
  if not exists (
    select 1
    from public.products p
    join public.size_chart_rows r on r.size_chart_id = p.size_chart_id
    where p.id = new.product_id and r.label = new.size_label
  ) then
    raise exception 'Taille % absente du tableau de tailles du produit %', new.size_label, new.product_id;
  end if;
  return new;
end;
$$;

create trigger product_variants_check_size
  before insert or update of product_id, size_label on public.product_variants
  for each row execute function public.check_variant_size();

-- RLS -------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.measurements enable row level security;
alter table public.addresses enable row level security;
alter table public.size_charts enable row level security;
alter table public.size_chart_rows enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;

create policy "profiles: lecture du sien ou admin" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles: modification du sien" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "measurements: lecture des siennes ou admin" on public.measurements
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "measurements: création des siennes" on public.measurements
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "measurements: modification des siennes" on public.measurements
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "measurements: suppression des siennes" on public.measurements
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "addresses: lecture des siennes ou admin" on public.addresses
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "addresses: création des siennes" on public.addresses
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "addresses: modification des siennes" on public.addresses
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "addresses: suppression des siennes" on public.addresses
  for delete to authenticated using (user_id = (select auth.uid()));

-- Catalogue : lecture publique, écriture réservée à l'admin.
create policy "size_charts: lecture publique" on public.size_charts
  for select to anon, authenticated using (true);
create policy "size_charts: écriture admin" on public.size_charts
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "size_chart_rows: lecture publique" on public.size_chart_rows
  for select to anon, authenticated using (true);
create policy "size_chart_rows: écriture admin" on public.size_chart_rows
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "products: lecture des actifs ou admin" on public.products
  for select to anon, authenticated using (is_active or (select public.is_admin()));
create policy "products: écriture admin" on public.products
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "product_variants: lecture publique" on public.product_variants
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = product_id)
  );
create policy "product_variants: écriture admin" on public.product_variants
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
