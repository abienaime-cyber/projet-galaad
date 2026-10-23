-- Paniers, commandes, retours et avis (partie B), plus les vues du tableau de bord admin.

create type public.order_status as enum ('paid', 'shipped', 'delivered', 'cancelled');
create type public.return_reason as enum ('too_small', 'too_large', 'not_as_described', 'damaged', 'changed_mind');
create type public.return_status as enum ('requested', 'accepted', 'refused', 'refunded');
create type public.size_feedback as enum ('small', 'true_to_size', 'large');

-- Panier : un par client, persistant en base -------------------------------

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  cart_id uuid not null references public.carts (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete cascade,
  quantity smallint not null check (quantity between 1 and 10),
  added_at timestamptz not null default now(),
  primary key (cart_id, variant_id)
);

create index cart_items_variant_id_idx on public.cart_items (variant_id);

-- Commandes ----------------------------------------------------------------

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number bigint generated always as identity unique,
  -- restrict : une commande reste dans la comptabilité même si le compte disparaît.
  user_id uuid not null references public.profiles (id) on delete restrict,
  status public.order_status not null default 'paid',
  total_cents integer not null check (total_cents > 0),
  -- Copie de l'adresse au moment de l'achat : modifier son carnet d'adresses ne réécrit pas l'historique.
  ship_recipient text not null check (char_length(ship_recipient) between 1 and 120),
  ship_line1 text not null check (char_length(ship_line1) between 1 and 200),
  ship_line2 text check (char_length(ship_line2) <= 200),
  ship_postal_code text not null check (ship_postal_code ~ '^[0-9A-Za-z -]{3,10}$'),
  ship_city text not null check (char_length(ship_city) between 1 and 100),
  ship_country text not null check (ship_country ~ '^[A-Z]{2}$'),
  created_at timestamptz not null default now()
);

create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index orders_created_at_idx on public.orders (created_at);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  variant_id uuid not null references public.product_variants (id) on delete restrict,
  -- Nom et prix figés : la fiche produit peut changer après la vente.
  product_name text not null,
  size_label text not null,
  unit_price_cents integer not null check (unit_price_cents > 0),
  quantity smallint not null check (quantity between 1 and 10),
  unique (order_id, variant_id)
);

create index order_items_variant_id_idx on public.order_items (variant_id);

-- Retours : un par ligne de commande, avec un motif obligatoire.
create table public.returns (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null unique references public.order_items (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reason public.return_reason not null,
  quantity smallint not null check (quantity >= 1),
  comment text check (char_length(comment) <= 500),
  status public.return_status not null default 'requested',
  created_at timestamptz not null default now()
);

create index returns_user_id_idx on public.returns (user_id);
create index returns_reason_idx on public.returns (reason);

-- Le retour doit porter sur une ligne achetée par le même client, sans dépasser la quantité.
create function public.check_return() returns trigger
language plpgsql set search_path = '' as $$
begin
  if not exists (
    select 1
    from public.order_items oi
    join public.orders o on o.id = oi.order_id
    where oi.id = new.order_item_id
      and o.user_id = new.user_id
      and o.status <> 'cancelled'
      and new.quantity <= oi.quantity
  ) then
    raise exception 'Retour impossible pour cette ligne de commande' using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger returns_check
  before insert or update of order_item_id, user_id, quantity on public.returns
  for each row execute function public.check_return();

-- Avis : un par client et par produit, réservé aux acheteurs (voir la politique RLS).
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  fit_feedback public.size_feedback,
  comment text check (char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

create index reviews_user_id_idx on public.reviews (user_id);

-- Le client a-t-il acheté ce produit ? security definer : lit les commandes sans repasser par leur RLS.
create function public.has_purchased(p_product_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.orders o
    join public.order_items oi on oi.order_id = o.id
    join public.product_variants v on v.id = oi.variant_id
    where o.user_id = (select auth.uid()) and o.status <> 'cancelled' and v.product_id = p_product_id
  );
$$;

-- Panier ---------------------------------------------------------------------

-- Ajoute (ou cumule) une taille au panier du client connecté. RLS appliquée (security invoker).
create function public.add_to_cart(p_variant_id uuid, p_quantity smallint default 1) returns void
language plpgsql set search_path = '' as $$
declare
  v_cart uuid;
begin
  insert into public.carts (user_id) values ((select auth.uid()))
  on conflict (user_id) do update set updated_at = now()
  returning id into v_cart;

  insert into public.cart_items (cart_id, variant_id, quantity)
  values (v_cart, p_variant_id, p_quantity)
  on conflict (cart_id, variant_id)
  do update set quantity = least(public.cart_items.quantity + excluded.quantity, 10);
end;
$$;

-- Commande anti-survente -------------------------------------------------------
--
-- Tout se passe dans une seule transaction :
-- 1. on verrouille (FOR UPDATE) les variantes du panier, triées par id pour éviter les interblocages ;
--    une commande concurrente sur la même taille attend la fin de celle-ci ;
-- 2. on vérifie le stock sous verrou, puis on le décrémente ;
-- 3. la contrainte CHECK (stock >= 0) reste le dernier filet de sécurité.
-- Si une étape échoue, rien n'est écrit : ni commande, ni décrément.
create function public.place_order(p_address_id uuid) returns uuid
language plpgsql security definer set search_path = '' as $$
declare
  v_user uuid := (select auth.uid());
  v_cart uuid;
  v_address public.addresses%rowtype;
  v_order uuid;
  v_short text;
begin
  if v_user is null then
    raise exception 'Connexion requise' using errcode = '42501';
  end if;

  select * into v_address from public.addresses where id = p_address_id and user_id = v_user;
  if not found then
    raise exception 'Adresse introuvable' using errcode = 'P0002';
  end if;

  select id into v_cart from public.carts where user_id = v_user;

  perform 1
  from public.product_variants v
  join public.cart_items ci on ci.variant_id = v.id
  where ci.cart_id = v_cart
  order by v.id
  for update of v;
  if not found then
    raise exception 'Panier vide' using errcode = 'P0002';
  end if;

  select string_agg(p.name || ' (' || v.size_label || ')', ', ') into v_short
  from public.cart_items ci
  join public.product_variants v on v.id = ci.variant_id
  join public.products p on p.id = v.product_id
  where ci.cart_id = v_cart and (v.stock < ci.quantity or not p.is_active);
  if v_short is not null then
    raise exception 'Stock insuffisant : %', v_short using errcode = 'P0001', hint = 'stock';
  end if;

  insert into public.orders (user_id, total_cents, ship_recipient, ship_line1, ship_line2, ship_postal_code, ship_city, ship_country)
  select v_user, sum(p.price_cents * ci.quantity), v_address.recipient, v_address.line1, v_address.line2,
    v_address.postal_code, v_address.city, v_address.country
  from public.cart_items ci
  join public.product_variants v on v.id = ci.variant_id
  join public.products p on p.id = v.product_id
  where ci.cart_id = v_cart
  returning id into v_order;

  insert into public.order_items (order_id, variant_id, product_name, size_label, unit_price_cents, quantity)
  select v_order, v.id, p.name, v.size_label, p.price_cents, ci.quantity
  from public.cart_items ci
  join public.product_variants v on v.id = ci.variant_id
  join public.products p on p.id = v.product_id
  where ci.cart_id = v_cart;

  update public.product_variants v
  set stock = v.stock - ci.quantity
  from public.cart_items ci
  where ci.cart_id = v_cart and ci.variant_id = v.id;

  delete from public.cart_items where cart_id = v_cart;
  return v_order;
end;
$$;

revoke execute on function public.place_order(uuid) from public, anon;
grant execute on function public.place_order(uuid) to authenticated;

-- RLS ----------------------------------------------------------------------------

alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.returns enable row level security;
alter table public.reviews enable row level security;

create policy "carts: le sien" on public.carts
  for all to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "cart_items: ceux de son panier" on public.cart_items
  for all to authenticated
  using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())))
  with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = (select auth.uid())));

-- Pas de politique d'insertion : une commande ne naît que par place_order().
create policy "orders: lecture des siennes ou admin" on public.orders
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "orders: statut modifié par l'admin" on public.orders
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "order_items: lecture des siennes ou admin" on public.order_items
  for select to authenticated using (
    exists (select 1 from public.orders o where o.id = order_id and (o.user_id = (select auth.uid()) or (select public.is_admin())))
  );

create policy "returns: lecture des siens ou admin" on public.returns
  for select to authenticated using (user_id = (select auth.uid()) or (select public.is_admin()));
create policy "returns: demande par le client" on public.returns
  for insert to authenticated with check (user_id = (select auth.uid()) and status = 'requested');
create policy "returns: traitement par l'admin" on public.returns
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "reviews: lecture publique" on public.reviews
  for select to anon, authenticated using (true);
create policy "reviews: création par un acheteur" on public.reviews
  for insert to authenticated with check (user_id = (select auth.uid()) and (select public.has_purchased(product_id)));
create policy "reviews: modification des siens" on public.reviews
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "reviews: suppression des siens" on public.reviews
  for delete to authenticated using (user_id = (select auth.uid()));

-- Tableau de bord admin ----------------------------------------------------------
--
-- Vues en security_invoker : la RLS de l'appelant s'applique. Un admin voit tout ;
-- un client qui interrogerait ces vues ne verrait que ses propres commandes.
-- Les commandes annulées ne comptent pas.

create view public.admin_kpis with (security_invoker = true) as
with sold as (
  select coalesce(sum(oi.quantity), 0) as units
  from public.order_items oi join public.orders o on o.id = oi.order_id
  where o.status <> 'cancelled'
), wrong_size as (
  select coalesce(sum(r.quantity), 0) as units
  from public.returns r
  where r.reason in ('too_small', 'too_large') and r.status <> 'refused'
)
select
  coalesce(sum(o.total_cents), 0)::bigint as revenue_cents,
  count(o.id)::int as orders_count,
  coalesce(round(avg(o.total_cents)), 0)::int as average_basket_cents,
  (select count(*) from public.profiles p where p.role = 'customer' and p.created_at > now() - interval '30 days')::int
    as new_customers_30d,
  (select units from sold)::int as units_sold,
  (select units from wrong_size)::int as wrong_size_returns,
  case when (select units from sold) = 0 then 0
    else round(100.0 * (select units from wrong_size) / (select units from sold), 1) end as wrong_size_return_rate
from public.orders o
where o.status <> 'cancelled';

create view public.admin_top_products with (security_invoker = true) as
select p.slug, p.name, sum(oi.quantity)::int as units, sum(oi.quantity * oi.unit_price_cents)::bigint as revenue_cents
from public.order_items oi
join public.orders o on o.id = oi.order_id
join public.product_variants v on v.id = oi.variant_id
join public.products p on p.id = v.product_id
where o.status <> 'cancelled'
group by p.slug, p.name
order by units desc, revenue_cents desc;

create view public.admin_sizes_sold with (security_invoker = true) as
select p.category, oi.size_label, sum(oi.quantity)::int as units
from public.order_items oi
join public.orders o on o.id = oi.order_id
join public.product_variants v on v.id = oi.variant_id
join public.products p on p.id = v.product_id
where o.status <> 'cancelled'
group by p.category, oi.size_label
order by units desc;

create view public.admin_returns_by_reason with (security_invoker = true) as
select reason, count(*)::int as returns, sum(quantity)::int as units
from public.returns
where status <> 'refused'
group by reason
order by units desc;

revoke all on public.admin_kpis, public.admin_top_products, public.admin_sizes_sold, public.admin_returns_by_reason from anon;

revoke execute on function public.add_to_cart(uuid, smallint) from public, anon;
grant execute on function public.add_to_cart(uuid, smallint) to authenticated;
