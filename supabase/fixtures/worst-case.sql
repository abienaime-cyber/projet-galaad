-- Données « pire cas » pour tester l'interface (break-ui). Base locale uniquement, jamais en production.
-- Appliquer : psql "postgresql://postgres:postgres@localhost:54322/postgres" -f supabase/fixtures/worst-case.sql
-- Revenir aux données de démo : supabase db reset
-- Compte : pire@contrebande.test / contrebande-demo. Chaque valeur est réaliste ou à la limite fixée par le schéma.

begin;

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new)
values ('00000000-0000-0000-0000-000000000000', '00000000-0000-4000-8000-0000000000ff', 'authenticated', 'authenticated',
  'pire@contrebande.test', extensions.crypt('contrebande-demo', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Aleksandra Wiśniewska-Kowalczyk de La Rochefoucauld-Montmorency"}', now() - interval '3 years', now(), '', '', '', '');

insert into auth.identities (user_id, provider_id, identity_data, provider, created_at, updated_at)
values ('00000000-0000-4000-8000-0000000000ff', '00000000-0000-4000-8000-0000000000ff',
  '{"sub":"00000000-0000-4000-8000-0000000000ff","email":"pire@contrebande.test","email_verified":true}', 'email', now(), now());

-- Profil aux bornes : 28 tasses par semaine, tous les ustensiles déjà achetés, café le plus cher accepté.
insert into public.taste_profiles (user_id, cups_per_week, drink, taste, experience, owned, cafe_price_cents)
values ('00000000-0000-4000-8000-0000000000ff', 28, 'les_deux', 'intense', 'habitue',
  '{chawan,chasen,chashaku,furui,kusenaoshi,kettle,tin,glass}', 2000);

-- Adresse : 200 caractères sur la ligne 1, la plus longue commune de France (45 caractères).
insert into public.addresses (user_id, recipient, line1, line2, postal_code, city, is_default)
values ('00000000-0000-4000-8000-0000000000ff',
  'Aleksandra Wiśniewska-Kowalczyk de La Rochefoucauld-Montmorency',
  left('Résidence Les Jardins de la Cité Internationale Universitaire, Bâtiment C, escalier 4, 7e étage, porte gauche au fond du couloir, 17 boulevard Jourdan, chez Monsieur et Madame Bartholomew-Fitzgerald', 200),
  'Interphone 4B7, code portail 2580A, laisser au gardien si absent',
  '51290', 'Saint-Remy-en-Bouzemont-Saint-Genest-et-Isson', true);

-- Un article au nom long (120 caractères au plus), cher, avec un format épuisé et un format à une pièce.
insert into public.products (slug, name, description, category, grade, intensity, material, model, image_url)
values ('matcha-pire-cas',
  'Matcha de cérémonie Okumidori première récolte, ombré trente jours, moulu à la meule de granit, édition limitée',
  'Fixture de test.', 'matcha', 'ceremonie', 1, 'Thé vert moulu à la meule de pierre, Uji, préfecture de Kyoto, Japon',
  'tin-recolte', '/renders/tin-recolte.png');

insert into public.product_variants (product_id, label, sku, price_cents, matcha_grams, stock, sort_order)
select p.id, s.label, 'PIRE-' || s.n, s.price, s.grams, s.stock, s.n
from public.products p, (values
  (1, '20 g', 3, 4900, 20::smallint), (2, '30 g', 0, 6900, 30), (3, '100 g', 1, 18900, 100),
  (4, 'Boîte de 1 kg pour professionnels', 10, 189000, 1000)
) as s (n, label, stock, price, grams)
where p.slug = 'matcha-pire-cas';

-- Panier : 10 pièces de l'article cher, une ligne épuisée, une ligne au-dessus du stock, puis le reste du catalogue.
insert into public.carts (user_id) values ('00000000-0000-4000-8000-0000000000ff');

insert into public.cart_items (cart_id, variant_id, quantity, added_at)
select c.id, v.id, q.quantity, now() + q.n * interval '1 second'
from public.carts c
join (values ('PIRE-4', 10, 1), ('PIRE-2', 1, 2), ('PIRE-3', 3, 3)) as q (sku, quantity, n) on true
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

    insert into public.order_items (order_id, variant_id, product_name, variant_label, unit_price_cents, quantity)
    select v_order, v.id, p.name, v.label, v.price_cents, case when i = 1 then 10 else 1 end
    from public.product_variants v join public.products p on p.id = v.product_id
    where v.sku = 'PIRE-4' or (i = 1 and v.id in (select distinct on (product_id) id from public.product_variants where sku not like 'PIRE-%' order by product_id limit 9));

    update public.orders o set total_cents = (select sum(unit_price_cents * quantity) from public.order_items where order_id = o.id)
    where o.id = v_order;
  end loop;
end $$;

update public.orders set status = 'delivered', created_at = now() - interval '3 hours'
where id = (select id from public.orders where user_id = '00000000-0000-4000-8000-0000000000ff' order by created_at desc limit 1);

insert into public.returns (order_item_id, user_id, reason, quantity, comment)
select oi.id, o.user_id, 'damaged', 10, left(repeat('Le couvercle était enfoncé et la poudre s''est répandue dans le carton à l''ouverture. ', 10), 500)
from public.order_items oi join public.orders o on o.id = oi.order_id
where o.id = (select id from public.orders where user_id = '00000000-0000-4000-8000-0000000000ff' order by created_at desc limit 1)
  and oi.variant_label = 'Boîte de 1 kg pour professionnels';

-- Avis : 1 000 caractères avec une adresse web sans espace, et un avis d'une lettre.
insert into public.reviews (product_id, user_id, rating, comment)
select p.id, '00000000-0000-4000-8000-0000000000ff', 1,
  left('Acheté pour le matin avant le bureau. Belle couleur, mais trop amer pour moi même à 70 °C. Voir mes photos : https://photos.example.com/albums/matcha-2026-10-17/matcha-ceremonie-okumidori-premiere-recolte-bol-mousse-essai-final-IMG_20261017_142233.jpg ' || repeat('Je reste fidèle à la marque, mais je recommande le grade Quotidien pour débuter. ', 12), 1000)
from public.products p where p.slug in ('matcha-pire-cas', 'matcha-quotidien');

insert into public.reviews (product_id, user_id, rating, comment)
select p.id, u.id, 5, 'Ok'
from public.products p, public.profiles u join auth.users au on au.id = u.id
where p.slug = 'matcha-pire-cas' and au.email = 'client1@contrebande.test';

commit;
