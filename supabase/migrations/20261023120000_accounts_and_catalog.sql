-- Comptes clients, profil de goût et catalogue (partie A).

create type public.user_role as enum ('customer', 'admin');
create type public.product_category as enum ('kit', 'matcha', 'tool');
-- Ustensiles : ce qu'un client peut déjà avoir chez lui, et ce que contient un kit.
create type public.tool_kind as enum ('chawan', 'chasen', 'chashaku', 'furui', 'kusenaoshi', 'kettle', 'tin', 'glass');
create type public.matcha_grade as enum ('ceremonie', 'quotidien', 'latte');
create type public.drink_style as enum ('pur', 'latte', 'les_deux');
create type public.taste_pref as enum ('doux', 'equilibre', 'intense');
create type public.experience as enum ('decouverte', 'habitue');

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

-- Profil de goût : la base du calcul de recommandation (lib/reco.ts).
create table public.taste_profiles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  cups_per_week smallint not null check (cups_per_week between 1 and 28),
  drink public.drink_style not null,
  taste public.taste_pref not null,
  experience public.experience not null default 'decouverte',
  owned public.tool_kind[] not null default '{}',
  -- Prix payé en coffee shop, donné par le client : sert seulement au calcul d'économie.
  cafe_price_cents integer check (cafe_price_cents between 100 and 2000),
  updated_at timestamptz not null default now()
);

create trigger taste_profiles_updated_at
  before update on public.taste_profiles
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

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  category public.product_category not null,
  tool_kind public.tool_kind,
  grade public.matcha_grade,
  -- Intensité du matcha, de 1 (doux) à 5 (corsé).
  intensity smallint check (intensity between 1 and 5),
  material text not null,
  -- Clé du modèle 3D (components/three) et du rendu dans public/renders.
  model text not null check (model ~ '^[a-z0-9-]+$'),
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Un ustensile a un type, un matcha a un grade et une intensité, un kit n'a ni l'un ni l'autre.
  check ((category = 'tool') = (tool_kind is not null)),
  check ((category = 'matcha') = (grade is not null)),
  check ((category = 'matcha') = (intensity is not null))
);

create index products_active_category_idx on public.products (category) where is_active;

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- Variante : un format (30 g, 100 g) ou un coloris. Le prix est porté par la variante.
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  label text not null check (char_length(label) between 1 and 40),
  sku text not null unique,
  price_cents integer not null check (price_cents > 0),
  -- Grammes de matcha livrés avec la variante (boîte seule ou dans un kit).
  matcha_grams smallint check (matcha_grams between 1 and 1000),
  stock integer not null default 0 check (stock >= 0),
  sort_order smallint not null default 0,
  unique (product_id, label)
);

create index product_variants_product_id_idx on public.product_variants (product_id);

-- Composition d'un kit : des ustensiles et un matcha du catalogue.
create table public.kit_items (
  kit_id uuid not null references public.products (id) on delete cascade,
  item_id uuid not null references public.products (id) on delete restrict,
  quantity smallint not null default 1 check (quantity between 1 and 10),
  sort_order smallint not null default 0,
  primary key (kit_id, item_id),
  check (kit_id <> item_id)
);

create index kit_items_item_id_idx on public.kit_items (item_id);

-- Un kit ne contient que des ustensiles et du matcha, jamais un autre kit.
create function public.check_kit_item() returns trigger
language plpgsql set search_path = '' as $$
begin
  if (select category from public.products where id = new.kit_id) <> 'kit' then
    raise exception 'Le produit % n''est pas un kit', new.kit_id using errcode = 'check_violation';
  end if;
  if (select category from public.products where id = new.item_id) = 'kit' then
    raise exception 'Un kit ne peut pas contenir un autre kit' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger kit_items_check
  before insert or update on public.kit_items
  for each row execute function public.check_kit_item();

-- RLS -------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.taste_profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.kit_items enable row level security;

create policy "profiles: lecture du sien ou admin" on public.profiles
  for select to authenticated using (id = (select auth.uid()) or (select public.is_admin()));
create policy "profiles: modification du sien" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "taste_profiles: lecture du sien ou admin" on public.taste_profiles
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "taste_profiles: création du sien" on public.taste_profiles
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "taste_profiles: modification du sien" on public.taste_profiles
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "taste_profiles: suppression du sien" on public.taste_profiles
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

create policy "kit_items: lecture publique" on public.kit_items
  for select to anon, authenticated using (
    exists (select 1 from public.products p where p.id = kit_id)
  );
create policy "kit_items: écriture admin" on public.kit_items
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
