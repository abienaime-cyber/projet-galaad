-- Données de démonstration : marque, produits, clients et commandes fictifs.

insert into public.size_charts (name, category) values
  ('Chemises Carrure', 'shirt'),
  ('Costumes Carrure', 'suit');

insert into public.size_chart_rows (size_chart_id, label, sort_order, chest_min, chest_max)
select c.id, r.label, r.sort_order, r.chest_min, r.chest_max
from public.size_charts c,
  (values
    ('S', 1, 88, 96),
    ('M', 2, 96, 104),
    ('L', 3, 104, 112),
    ('XL', 4, 112, 120),
    ('XXL', 5, 120, 128),
    ('3XL', 6, 128, 136)
  ) as r (label, sort_order, chest_min, chest_max)
where c.name = 'Chemises Carrure';

-- Taille française de veste : environ la moitié du tour de poitrine.
insert into public.size_chart_rows (size_chart_id, label, sort_order, chest_min, chest_max, waist_min, waist_max)
select c.id, (44 + 2 * i)::text, i + 1, 86 + 4 * i, 90 + 4 * i, 74 + 4 * i, 78 + 4 * i
from public.size_charts c, generate_series(0, 7) as i
where c.name = 'Costumes Carrure';

insert into public.products (slug, name, description, category, fit, color, material, price_cents, image_url, size_chart_id)
select p.slug, p.name, p.description, p.category::public.product_category, p.fit::public.fit,
  p.color, p.material, p.price_cents, '/products/' || p.slug || '.jpg', c.id
from (values
  ('chemise-oxford-blanche', 'Chemise Oxford blanche', 'La chemise qui va avec tout. Coton Oxford épais, col boutonné, se porte avec ou sans veste.', 'shirt', 'regular', 'Blanc', 'Coton Oxford', 6900),
  ('chemise-oxford-bleu-ciel', 'Chemise Oxford bleu ciel', 'Le même Oxford, en bleu ciel. Un peu moins formel que le blanc, aussi net.', 'shirt', 'regular', 'Bleu ciel', 'Coton Oxford', 6900),
  ('chemise-popeline-blanche-ajustee', 'Chemise popeline blanche ajustée', 'Popeline lisse et coupe près du corps, pour le costume du lundi matin.', 'shirt', 'slim', 'Blanc', 'Popeline de coton', 7900),
  ('chemise-popeline-rayee-bleue', 'Chemise popeline rayures bleues', 'Fines rayures bleues sur fond blanc. Col italien qui tient sous une cravate.', 'shirt', 'regular', 'Rayé bleu et blanc', 'Popeline de coton', 7900),
  ('chemise-lin-bleu-ciel', 'Chemise en lin bleu ciel', 'Lin lavé bleu ciel, coupe ample, faite pour les journées chaudes. Le froissé fait partie du charme.', 'shirt', 'loose', 'Bleu ciel', 'Lin', 8900),
  ('chemise-lin-blanche', 'Chemise en lin blanche', 'Lin blanc et coupe ample. Ouverte sur un t-shirt ou boutonnée le soir.', 'shirt', 'loose', 'Blanc', 'Lin', 8900),
  ('chemise-flanelle-carreaux', 'Chemise flanelle à carreaux', 'Flanelle brossée douce au toucher, carreaux bleus et marine. Pour l''hiver.', 'shirt', 'regular', 'Carreaux bleu et marine', 'Flanelle de coton', 7500),
  ('chemise-denim-indigo', 'Chemise denim indigo', 'Denim léger teint indigo. Elle se patine au fil des lavages.', 'shirt', 'regular', 'Indigo', 'Denim de coton léger', 8500),
  ('chemise-twill-rose-pale', 'Chemise twill rose pâle', 'Twill à la main douce, rose très discret. Coupe ajustée.', 'shirt', 'slim', 'Rose pâle', 'Twill de coton', 7900),
  ('chemise-noire-stretch', 'Chemise noire en coton stretch', 'Coton légèrement stretch, coupe ajustée. Sobre, se porte sans cravate.', 'shirt', 'slim', 'Noir', 'Coton stretch', 7500),
  ('chemise-vichy-bleue', 'Chemise vichy bleue', 'Petits carreaux vichy bleus. Le classique du week-end.', 'shirt', 'regular', 'Vichy bleu', 'Coton', 6900),
  ('chemise-petits-carreaux', 'Chemise à petits carreaux', 'Carreaux si fins qu''ils se lisent bleu gris à un mètre. Coupe ajustée.', 'shirt', 'slim', 'Petits carreaux bleus', 'Coton fil à fil', 8900),
  ('chemise-smoking-blanche', 'Chemise de smoking blanche', 'Popeline blanche, poignets mousquetaires. Se porte avec un nœud papillon pour les soirées habillées.', 'shirt', 'slim', 'Blanc', 'Popeline de coton', 11900),
  ('chemise-chambray', 'Chemise chambray', 'Chambray bleu délavé, plus léger que le denim. Se porte toute l''année.', 'shirt', 'regular', 'Bleu délavé', 'Chambray de coton', 7500),
  ('surchemise-carreaux-ecrus', 'Surchemise à carreaux écrus', 'Laine mélangée épaisse, grands carreaux écru et noir, coupe ample. Se porte comme une veste légère.', 'shirt', 'loose', 'Carreaux écru et noir', 'Laine mélangée', 9900),
  ('chemise-fil-a-fil-bleue', 'Chemise fil à fil bleue', 'Tissage fil à fil qui donne un bleu chiné. La chemise de bureau par excellence.', 'shirt', 'regular', 'Bleu', 'Coton fil à fil', 7900),
  ('chemise-maille-marine', 'Chemise en maille piquée marine', 'Maille piquée souple comme un polo, col de chemise. Ne se repasse pas.', 'shirt', 'regular', 'Bleu marine', 'Maille piquée de coton', 6500),
  ('chemise-carreaux-noir-blanc', 'Chemise à carreaux noir et blanc', 'Carreaux graphiques noir et blanc sur un coton souple. Ouverte sur un t-shirt ou boutonnée.', 'shirt', 'regular', 'Carreaux noir et blanc', 'Coton', 7900),
  ('costume-laine-marine', 'Costume laine marine', 'Le premier costume à avoir. Laine vierge, deux boutons, pantalon à pinces plates.', 'suit', 'regular', 'Bleu marine', 'Laine vierge', 39900),
  ('costume-gris-anthracite', 'Costume gris anthracite', 'Gris foncé, sérieux sans être triste. Convient aux entretiens comme aux mariages.', 'suit', 'regular', 'Gris anthracite', 'Laine vierge', 39900),
  ('costume-ajuste-noir', 'Costume ajusté noir', 'Coupe près du corps et laine légèrement stretch pour garder l''aisance.', 'suit', 'slim', 'Noir', 'Laine stretch', 44900),
  ('costume-flanelle-gris-chine', 'Costume flanelle gris chiné', 'Flanelle de laine chaude et mate. Le costume d''automne.', 'suit', 'regular', 'Gris chiné', 'Flanelle de laine', 49900),
  ('costume-lin-beige', 'Costume en lin beige', 'Lin beige, veste déstructurée, coupe ample. Pour les mariages d''été.', 'suit', 'loose', 'Beige', 'Lin', 34900),
  ('costume-prince-de-galles', 'Costume prince-de-galles', 'Carreaux prince-de-galles gris rehaussés d''un fil bleu. Un classique anglais.', 'suit', 'regular', 'Gris et bleu', 'Laine', 54900),
  ('costume-croise-gris-bleu', 'Costume croisé gris bleu', 'Veste croisée six boutons. Plus formel, très structuré aux épaules.', 'suit', 'regular', 'Gris bleu', 'Laine vierge', 59900),
  ('smoking-noir-revers-satin', 'Smoking noir revers satin', 'Revers en satin, bande de satin sur le pantalon. Pour les soirées black tie.', 'suit', 'slim', 'Noir', 'Laine et satin', 69900),
  ('costume-tweed-marron', 'Costume tweed marron', 'Tweed de laine robuste aux reflets roux. Pour la campagne ou la ville en hiver.', 'suit', 'regular', 'Marron', 'Tweed de laine', 54900),
  ('costume-trois-pieces-bleu-nuit', 'Costume trois pièces bleu nuit', 'Veste, gilet et pantalon en laine bleu nuit. Le gilet se porte aussi seul.', 'suit', 'regular', 'Bleu nuit', 'Laine vierge', 64900),
  ('costume-vert-sapin', 'Costume vert sapin', 'Laine vert sapin, gilet assorti, coupe ample. Se dépareille facilement.', 'suit', 'loose', 'Vert sapin', 'Laine', 32900),
  ('costume-rayure-tennis', 'Costume rayure tennis', 'Fines rayures claires sur fond bleu marine. Coupe ajustée.', 'suit', 'slim', 'Marine rayé', 'Laine', 52900)
) as p (slug, name, description, category, fit, color, material, price_cents)
join public.size_charts c on c.category = p.category::public.product_category;

-- Stock déterministe entre 0 et 10, avec environ une variante sur quatre en rupture.
insert into public.product_variants (product_id, size_label, sku, stock)
select p.id, r.label, upper(p.slug || '-' || r.label),
  greatest(((p.n * 7 + r.sort_order * 5) % 13) - 2, 0)
from (select *, row_number() over (order by slug) as n from public.products) p
join public.size_chart_rows r on r.size_chart_id = p.size_chart_id;

-- Comptes de démonstration ---------------------------------------------------
-- client@carrure.test et admin@carrure.test se connectent avec le mot de passe « carrure-demo ».
-- Mot de passe public, fait pour la démo : à changer avant toute mise en ligne réelle.

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new)
select '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email,
  extensions.crypt('carrure-demo', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', u.full_name),
  now() - u.age, now() - u.age, '', '', '', ''
from (values
  ('00000000-0000-4000-8000-000000000001'::uuid, 'client@carrure.test', 'Client démo', interval '90 days'),
  ('00000000-0000-4000-8000-000000000002'::uuid, 'admin@carrure.test', 'Admin démo', interval '120 days')
) as u (id, email, full_name, age);

insert into auth.identities (user_id, provider_id, identity_data, provider, created_at, updated_at)
select id, id::text, jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true), 'email', now(), now()
from auth.users where email in ('client@carrure.test', 'admin@carrure.test');

update public.profiles set role = 'admin' where id = '00000000-0000-4000-8000-000000000002';
update public.profiles p set created_at = u.created_at from auth.users u where u.id = p.id;

insert into public.measurements (user_id, height_cm, weight_kg, age, chest_cm, preferred_fit)
values ('00000000-0000-4000-8000-000000000001', 180, 78, 42, 100, 'regular');

insert into public.addresses (user_id, recipient, line1, postal_code, city, is_default)
values ('00000000-0000-4000-8000-000000000001', 'Client démo', '12 rue des Tailleurs', '75002', 'Paris', true);

-- Clients fictifs sans mot de passe : ils ne servent qu'à remplir l'historique des ventes.
insert into auth.users (instance_id, id, aud, role, email, raw_user_meta_data, created_at, updated_at)
select '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
  'client' || i || '@carrure.test', jsonb_build_object('full_name', 'Client ' || i),
  now() - (i * 7 || ' days')::interval, now()
from generate_series(1, 12) as i;

update public.profiles p set created_at = u.created_at from auth.users u where u.id = p.id;

-- Historique de ventes de démonstration --------------------------------------
-- Environ 60 commandes sur 80 jours, tirées au sort avec une graine fixe pour rester reproductibles.
-- Le stock affiché en boutique n'est pas décrémenté par cet historique.

do $$
declare
  v_customer record;
  v_order uuid;
  v_day int;
  v_lines int;
begin
  perform setseed(0.42);
  for v_customer in
    select p.id, p.created_at from public.profiles p join auth.users u on u.id = p.id
    where u.email like 'client_%@carrure.test'
  loop
    for n in 1 .. 2 + floor(random() * 6)::int loop
      v_day := floor(random() * least(80, extract(day from now() - v_customer.created_at)))::int;
      v_lines := 1 + floor(random() * 3)::int;

      insert into public.orders (user_id, status, total_cents, ship_recipient, ship_line1, ship_postal_code, ship_city, ship_country, created_at)
      values (v_customer.id, case when v_day > 10 then 'delivered' else 'shipped' end::public.order_status, 1,
        'Client', '1 avenue de la Démo', '69001', 'Lyon', 'FR', now() - (v_day || ' days')::interval)
      returning id into v_order;

      insert into public.order_items (order_id, variant_id, product_name, size_label, unit_price_cents, quantity)
      select distinct on (v.id) v_order, v.id, p.name, v.size_label, p.price_cents, 1
      from (select id from public.product_variants order by random() limit v_lines) pick
      join public.product_variants v on v.id = pick.id
      join public.products p on p.id = v.product_id;

      update public.orders set total_cents = (
        select sum(unit_price_cents * quantity) from public.order_items where order_id = v_order
      ) where id = v_order;
    end loop;
  end loop;

  -- Une ligne sur six revient, surtout pour une question de taille.
  insert into public.returns (order_item_id, user_id, reason, quantity, status, created_at)
  select oi.id, o.user_id,
    (array['too_small', 'too_large', 'too_small', 'too_large', 'damaged', 'changed_mind'])[1 + floor(random() * 6)::int]::public.return_reason,
    1, 'accepted', o.created_at + interval '5 days'
  from public.order_items oi join public.orders o on o.id = oi.order_id
  where o.status = 'delivered' and random() < 0.17;
end;
$$;

-- La commande livrée du client démo, pour montrer l'historique et les retours.
do $$
declare
  v_order uuid;
begin
  insert into public.orders (user_id, status, total_cents, ship_recipient, ship_line1, ship_postal_code, ship_city, ship_country, created_at)
  values ('00000000-0000-4000-8000-000000000001', 'delivered', 46800, 'Client démo', '12 rue des Tailleurs', '75002', 'Paris', 'FR', now() - interval '20 days')
  returning id into v_order;

  insert into public.order_items (order_id, variant_id, product_name, size_label, unit_price_cents, quantity)
  select v_order, v.id, p.name, v.size_label, p.price_cents, 1
  from public.product_variants v join public.products p on p.id = v.product_id
  where (p.slug, v.size_label) in (('costume-laine-marine', '50'), ('chemise-oxford-blanche', 'L'));
end;
$$;
