-- Tests pgTAP de la RLS, des contraintes et de la commande. Lancer : npx supabase test db
begin;
select plan(27);

-- Deux clients et un admin, créés dans la transaction (annulée à la fin).
insert into auth.users (id, email) values
  ('10000000-0000-4000-8000-00000000000a', 'a@test.fr'),
  ('10000000-0000-4000-8000-00000000000b', 'b@test.fr'),
  ('10000000-0000-4000-8000-0000000000ad', 'ad@test.fr');
update public.profiles set role = 'admin' where id = '10000000-0000-4000-8000-0000000000ad';
insert into public.measurements (user_id, height_cm, weight_kg, age)
values ('10000000-0000-4000-8000-00000000000b', 175, 70, 30);
insert into public.addresses (id, user_id, recipient, line1, postal_code, city)
values ('20000000-0000-4000-8000-00000000000a', '10000000-0000-4000-8000-00000000000a', 'A', '1 rue A', '75001', 'Paris');

-- Une variante avec 1 seul article en stock, pour tester la survente.
create temp table t_variant as
  select v.id from public.product_variants v join public.products p on p.id = v.product_id
  where p.slug = 'costume-laine-marine' and v.size_label = '50';
update public.product_variants set stock = 1 where id = (select id from t_variant);
grant select on t_variant to anon, authenticated;

select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity), 0,
  'RLS activée sur toutes les tables de public');

-- Anonyme ------------------------------------------------------------------
set local role anon;
select ok((select count(*) from public.products) > 0, 'anon lit le catalogue');
select is((select count(*)::int from public.profiles), 0, 'anon ne lit aucun profil');
select is((select count(*)::int from public.orders), 0, 'anon ne lit aucune commande');
select throws_ok(
  $$insert into public.products (slug, name, category, color, material, price_cents, size_chart_id)
    select 'x', 'x', 'shirt', 'x', 'x', 1, id from public.size_charts limit 1$$,
  '42501', null, 'anon ne crée pas de produit');
select throws_ok($$select public.add_to_cart((select id from t_variant), 1::smallint)$$, '42501', null,
  'anon n''a pas de panier');
reset role;

-- Client A ----------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-00000000000a';
select is((select count(*)::int from public.profiles), 1, 'A ne voit que son profil');
select is((select count(*)::int from public.measurements), 0, 'A ne voit pas les mensurations de B');
select is((select count(*)::int from public.orders where user_id <> auth.uid()), 0, 'A ne voit que ses commandes');
select throws_ok($$update public.profiles set role = 'admin' where id = auth.uid()$$, '42501', null,
  'A ne peut pas se donner le rôle admin');
select throws_ok(
  $$insert into public.orders (user_id, total_cents, ship_recipient, ship_line1, ship_postal_code, ship_city, ship_country)
    values (auth.uid(), 100, 'A', '1 rue A', '75001', 'Paris', 'FR')$$,
  '42501', null, 'A ne crée pas de commande en direct');
update public.product_variants set stock = 99 where id = (select id from t_variant);
select throws_ok($$insert into public.reviews (product_id, user_id, rating)
    select id, auth.uid(), 5 from public.products where slug = 'costume-tweed-marron'$$,
  '42501', null, 'A ne note pas un produit qu''il n''a pas acheté');

select lives_ok($$select public.add_to_cart((select id from t_variant), 2::smallint)$$, 'A ajoute 2 articles');
select throws_ok($$select public.place_order('20000000-0000-4000-8000-00000000000a')$$, 'P0001', null,
  'la commande est refusée quand le stock (1) est inférieur au panier (2)');
select is((select count(*)::int from public.orders where user_id = auth.uid()), 0, 'aucune commande créée après le refus');

update public.cart_items set quantity = 1;
select lives_ok($$select public.place_order('20000000-0000-4000-8000-00000000000a')$$, 'A commande le dernier article');
select is((select count(*)::int from public.cart_items), 0, 'le panier est vidé');
select lives_ok($$insert into public.reviews (product_id, user_id, rating, fit_feedback)
    select id, auth.uid(), 5, 'true_to_size' from public.products where slug = 'costume-laine-marine'$$,
  'A note un produit acheté');
reset role;

select is((select stock from public.product_variants where id = (select id from t_variant)), 0,
  'le stock est décrémenté, et la mise à jour de A (99) a été ignorée par la RLS');

create temp table t_total as select count(*)::int as n from public.orders;
create temp table t_item as select oi.id from public.order_items oi
  join public.orders o on o.id = oi.order_id where o.user_id = '10000000-0000-4000-8000-00000000000a';
grant select on t_total, t_item to authenticated;

-- Client B ----------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-00000000000b';
select public.add_to_cart((select id from t_variant), 1::smallint);
insert into public.addresses (user_id, recipient, line1, postal_code, city) values (auth.uid(), 'B', '2 rue B', '75002', 'Paris');
select throws_ok($$select public.place_order((select id from public.addresses limit 1))$$, 'P0001', null,
  'B ne peut pas acheter une taille épuisée : pas de survente');
select throws_ok($$insert into public.returns (order_item_id, user_id, reason, quantity)
    select id, auth.uid(), 'too_small', 1 from t_item$$,
  '23514', null, 'B ne peut pas retourner un article de A');
select is((select count(*)::int from public.addresses where user_id <> auth.uid()), 0, 'B ne voit pas l''adresse de A');
reset role;

-- Admin -------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-0000000000ad';
select is((select count(*)::int from public.orders), (select n from t_total), 'l''admin voit toutes les commandes');
select ok((select orders_count from public.admin_kpis) >= 1, 'l''admin lit les KPIs');
reset role;

-- Quota IA ----------------------------------------------------------------
set local role anon;
select throws_ok($$select public.consume_ai_quota()$$, '42501', null, 'un visiteur anonyme ne peut pas appeler l''IA');
reset role;
set local role authenticated;
set local request.jwt.claim.sub = '10000000-0000-4000-8000-00000000000b';
select is((select bool_and(public.consume_ai_quota()) from generate_series(1, 20)), true, 'B a droit à 20 appels par heure');
select is(public.consume_ai_quota(), false, 'le 21e appel de B est refusé');
reset role;

select * from finish();
rollback;
