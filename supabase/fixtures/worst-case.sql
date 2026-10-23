-- Données « pire cas » pour tester l'interface (break-ui). Base locale uniquement, jamais en production.
-- Appliquer : psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/fixtures/worst-case.sql
-- Revenir aux données de démo : supabase db reset
-- Compte : pire@carrure.test / carrure-demo. Chaque valeur est réaliste ou à la limite fixée par le schéma.

begin;

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000ff', 'authenticated', 'authenticated',
  'pire@carrure.test', extensions.crypt('carrure-demo', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Aleksandra Wiśniewska-Kowalczyk de La Rochefoucauld-Montmorency"}', now() - interval '3 years', now(), '', '', '', '');

insert into auth.identities (user_id, provider_id, identity_data, provider, created_at, updated_at)
values ('00000000-0000-4000-8000-0000000000ff', '00000000-0000-4000-8000-0000000000ff',
  '{"sub":"00000000-0000-4000-8000-0000000000ff","email":"pire@carrure.test","email_verified":true}', 'email', now(), now());

insert into public.measurements (user_id, height_cm, weight_kg, age, chest_cm, waist_cm, preferred_fit)
values ('00000000-0000-4000-8000-0000000000ff', 198, 131, 67, 132, 128, 'regular');

-- Adresse : 200 caractères sur la ligne 1, la plus longue commune de France (45 caractères).
insert into public.addresses (user_id, recipient, line1, line2, postal_code, city, is_default)
values ('00000000-0000-4000-8000-0000000000ff',
  'Aleksandra Wiśniewska-Kowalczyk de La Rochefoucauld-Montmorency',
  left('Résidence Les Jardins de la Cité Internationale Universitaire, Bâtiment C, escalier 4, 7e étage, porte gauche au fond du couloir, 17 boulevard Jourdan, chez Monsieur et Madame Bartholomew-Fitzgerald', 200),
  'Interphone 4B7, code portail 2580A, laisser au gardien si absent',
  '51290', 'Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson', true);

-- Un article au nom long (120 caractères au plus), cher, avec une taille épuisée et une taille à une pièce.
insert into public.products (slug, name, description, category, fit, color, material, price_cents, image_url, size_chart_id)
select 'costume-flanelle-craie-pire-cas',
  'Costume trois-pièces en flanelle de laine peignée gris anthracite à fines rayures craie, revers en pointe',
  'Fixture de test.', 'suit', 'regular', 'Gris anthracite à rayures craie', 'Flanelle 100 % laine peignée Super 130s, doublure cupro',
  189000, '/products/costume-trois-pieces-bleu-nuit.jpg', size_chart_id
from public.products where slug = 'costume-laine-marine';

insert into public.product_variants (product_id, size_label, sku, stock)
select p.id, s.label, 'PIRE-' || s.label, s.stock
from public.products p, (values ('44', 3), ('50', 0), ('52', 1), ('58', 10)) as s (label, stock)
where p.slug = 'costume-flanelle-craie-pire-cas';

-- Panier : 10 pièces de l'article cher, une ligne épuisée, une ligne au-dessus du stock, puis le reste du catalogue.
insert into public.carts (user_id) values ('00000000-0000-4000-8000-0000000000ff');

insert into public.cart_items (cart_id, variant_id, quantity, added_at)
select c.id, v.id, q.quantity, now() + q.n * interval '1 second'
from public.carts c
join (values ('PIRE-58', 10, 1), ('PIRE-50', 1, 2), ('PIRE-52', 3, 3)) as q (sku, quantity, n) on true
join public.product_variants v on v.sku = q.sku
where c.user_id = '00000000-0000-4000-8000-0000000000ff';

insert into public.cart_items (cart_id, variant_id, quantity, added_at)
select c.id, v.id, 1, now() + (3 + row_number() over ()) * interval '1 second'
from public.carts c, (
  select distinct on (product_id) id, product_id from public.product_variants where stock > 0 and sku not like 'PIRE-%' order by product_id, stock desc
) v
where c.user_id = '00000000-0000-4000-8000-0000000000ff';

-- Historique : 120 commandes. La plus récente a 10 lignes de 10 pièces, une adresse au maximum et un retour.
do $$
declare
  v_order uuid;
begin
  for i in 1 .. 120 loop
    insert into public.orders (user_id, status, total_cents, ship_recipient, ship_line1, ship_line2, ship_postal_code, ship_city, ship_country, created_at)
    select '00000000-0000-4000-8000-0000000000ff', (array['paid', 'shipped', 'delivered', 'cancelled'])[1 + i % 4]::public.order_status, 1,
      a.recipient, a.line1, a.line2, a.postal_code, a.city, 'FR', now() - (i || ' days')::interval
    from public.addresses a where a.user_id = '00000000-0000-4000-8000-0000000000ff'
    returning id into v_order;

    insert into public.order_items (order_id, variant_id, product_name, size_label, unit_price_cents, quantity)
    select v_order, v.id, p.name, v.size_label, p.price_cents, case when i = 1 then 10 else 1 end
    from public.product_variants v join public.products p on p.id = v.product_id
    where v.sku = 'PIRE-58' or (i = 1 and v.id in (select distinct on (product_id) id from public.product_variants where sku not like 'PIRE-%' order by product_id limit 9));

    update public.orders o set total_cents = (select sum(unit_price_cents * quantity) from public.order_items where order_id = o.id)
    where o.id = v_order;
  end loop;
end $$;

update public.orders set status = 'delivered', created_at = now() - interval '3 hours'
where id = (select id from public.orders where user_id = '00000000-0000-4000-8000-0000000000ff' order by created_at desc limit 1);

insert into public.returns (order_item_id, user_id, reason, quantity, comment)
select oi.id, o.user_id, 'too_small', 10, left(repeat('La veste tire aux épaules et les manches remontent quand je lève les bras. ', 10), 500)
from public.order_items oi join public.orders o on o.id = oi.order_id
where o.id = (select id from public.orders where user_id = '00000000-0000-4000-8000-0000000000ff' order by created_at desc limit 1)
  and oi.size_label = '58';

-- Avis : 1 000 caractères avec une adresse web sans espace, et un avis d'une lettre.
insert into public.reviews (product_id, user_id, rating, fit_feedback, comment)
select p.id, '00000000-0000-4000-8000-0000000000ff', 1, 'small',
  left('Commandé pour le mariage de mon frère. Tissu superbe, mais la veste tire aux épaules malgré la taille conseillée. Voir mes photos : https://photos.example.com/albums/mariage-2026-10-17/costume-flanelle-gris-anthracite-rayures-craie-revers-pointe-essayage-final-IMG_20261017_142233.jpg ' || repeat('Je reste fidèle à la marque, mais je recommande de prendre une taille au-dessus. ', 12), 1000)
from public.products p where p.slug in ('costume-flanelle-craie-pire-cas', 'chemise-oxford-blanche');

insert into public.reviews (product_id, user_id, rating, comment)
select p.id, u.id, 5, 'Ok'
from public.products p, public.profiles u join auth.users au on au.id = u.id
where p.slug = 'costume-flanelle-craie-pire-cas' and au.email = 'client1@carrure.test';

commit;
