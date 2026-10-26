-- Données de démonstration : catalogue, clients et commandes fictifs.
-- Les produits sont fictifs. Les prix sont ceux de la boutique de démonstration.

insert into public.products (slug, name, description, category, tool_kind, grade, intensity, material, model, image_url)
select p.slug, p.name, p.description, p.category::public.product_category, p.tool_kind::public.tool_kind,
  p.grade::public.matcha_grade, p.intensity, p.material, p.model, '/photos/' || p.model || '.jpg'
from (values
  ('kit-essentiel', 'Kit Essentiel', 'Le strict nécessaire pour un premier matcha : le fouet, la cuillère, le tamis et une boîte de matcha Quotidien. Le bol, vous l''avez sans doute déjà.', 'kit', null, null, null::smallint, 'Bambou, acier inoxydable, matcha', 'kit-essentiel'),
  ('kit-latte', 'Kit Latte', 'Pour le matcha au lait : le fouet, la cuillère, le tamis, un verre double paroi et une boîte de matcha Latte, fait pour tenir face au lait.', 'kit', null, null, null, 'Bambou, acier inoxydable, verre, matcha', 'kit-latte'),
  ('kit-complet', 'Kit Complet', 'Le bol à bec, le fouet de 100 brins et son support, la cuillère, le tamis et une boîte de matcha Cérémonie. Tout pour le matcha pur, fouetté à l''eau.', 'kit', null, null, null, 'Grès, bambou, céramique, acier inoxydable, matcha', 'kit-complet'),
  ('le-coffre', 'Le Coffre', 'Le Kit Complet, la bouilloire à col de cygne, la boîte hermétique et une seconde boîte de matcha. Les petites pièces voyagent dans une valise en aluminium.', 'kit', null, null, null, 'Aluminium, grès, bambou, acier, matcha', 'coffre'),
  ('matcha-ceremonie', 'Matcha Cérémonie', 'Le grade à fouetter à l''eau, sans lait ni sucre. Doux, herbacé, peu d''amertume.', 'matcha', null, 'ceremonie', 2, 'Thé vert moulu, Japon', 'tin-ceremonie'),
  ('matcha-premiere-recolte', 'Matcha Première Récolte', 'Une petite série, à boire pur. Le plus doux de la boutique, vendu en boîte de 20 g.', 'matcha', null, 'ceremonie', 1, 'Thé vert moulu, Japon', 'tin-recolte'),
  ('matcha-quotidien', 'Matcha Quotidien', 'Le matcha de tous les jours : assez doux pour être bu pur, assez franc pour un latte.', 'matcha', null, 'quotidien', 3, 'Thé vert moulu, Japon', 'tin-quotidien'),
  ('matcha-latte', 'Matcha Latte', 'Corsé et un peu amer, exprès : il garde son goût sous le lait, chaud ou glacé.', 'matcha', null, 'latte', 4, 'Thé vert moulu, Japon', 'tin-latte'),
  ('chasen-80', 'Chasen 80 brins', 'Le fouet en bambou taillé d''un seul morceau. 80 brins : il monte une mousse fine en une quinzaine de secondes.', 'tool', 'chasen', null, null, 'Bambou', 'chasen'),
  ('chasen-100', 'Chasen 100 brins', 'Plus de brins, plus fins : une mousse plus serrée. À reposer sur son support après usage.', 'tool', 'chasen', null, null, 'Bambou', 'chasen-100'),
  ('chawan-a-bec', 'Chawan à bec', 'Bol large à bec verseur : on fouette dedans, puis on verse dans la tasse ou sur le lait.', 'tool', 'chawan', null, null, 'Grès émaillé', 'chawan'),
  ('chashaku', 'Chashaku', 'La cuillère en bambou. Une cuillère et demie bombée donne environ 2 g, la dose d''un matcha pur.', 'tool', 'chashaku', null, null, 'Bambou', 'chashaku'),
  ('tamis-inox', 'Tamis inox', 'Se pose sur le bol. Tamiser évite les grumeaux avant de verser l''eau.', 'tool', 'furui', null, null, 'Acier inoxydable', 'furui'),
  ('support-chasen', 'Support de chasen', 'Garde la forme du fouet pendant qu''il sèche. Sans lui, les brins se referment.', 'tool', 'kusenaoshi', null, null, 'Céramique', 'kusenaoshi'),
  ('bouilloire-col-de-cygne', 'Bouilloire col de cygne', 'Bec fin pour verser doucement, thermomètre sur le couvercle pour viser 80 °C. Contenance 0,6 litre, toutes plaques sauf induction.', 'tool', 'kettle', null, null, 'Acier inoxydable, finition noire', 'kettle'),
  ('boite-hermetique', 'Boîte hermétique', 'Double couvercle pour garder le matcha à l''abri de l''air et de la lumière. Contient une boîte de 40 g.', 'tool', 'tin', null, null, 'Acier inoxydable', 'tin'),
  ('verre-double-paroi', 'Verre double paroi', 'Verre de 300 ml pour le latte : la paroi isole, le dégradé vert et blanc se voit.', 'tool', 'glass', null, null, 'Verre borosilicate', 'glass')
) as p (slug, name, description, category, tool_kind, grade, intensity, material, model);

-- Prix et formats. Le stock est fixé à la main : quelques ruptures pour la démo.
insert into public.product_variants (product_id, label, sku, price_cents, matcha_grams, stock, sort_order)
select p.id, v.label, upper(p.slug || '-' || v.sku), v.price_cents, v.grams, v.stock, v.sort_order
from (values
  ('kit-essentiel', 'Unique', 'u', 4900, 30::smallint, 24, 1),
  ('kit-latte', 'Unique', 'u', 5900, 30, 18, 1),
  ('kit-complet', 'Bol bleu acier', 'bleu', 8900, 30, 9, 1),
  ('kit-complet', 'Bol noir mat', 'noir', 8900, 30, 0, 2),
  ('le-coffre', 'Unique', 'u', 16900, 60, 4, 1),
  ('matcha-ceremonie', '30 g', '30', 2400, 30, 40, 1),
  ('matcha-ceremonie', '100 g', '100', 6900, 100, 12, 2),
  ('matcha-premiere-recolte', '20 g', '20', 3200, 20, 3, 1),
  ('matcha-quotidien', '30 g', '30', 1600, 30, 60, 1),
  ('matcha-quotidien', '100 g', '100', 4400, 100, 25, 2),
  ('matcha-latte', '30 g', '30', 1200, 30, 55, 1),
  ('matcha-latte', '100 g', '100', 3200, 100, 0, 2),
  ('chasen-80', 'Unique', 'u', 2200, null, 30, 1),
  ('chasen-100', 'Unique', 'u', 2800, null, 14, 1),
  ('chawan-a-bec', 'Bleu acier', 'bleu', 3400, null, 11, 1),
  ('chawan-a-bec', 'Noir mat', 'noir', 3400, null, 6, 2),
  ('chashaku', 'Unique', 'u', 800, null, 70, 1),
  ('tamis-inox', 'Unique', 'u', 1200, null, 35, 1),
  ('support-chasen', 'Unique', 'u', 1400, null, 0, 1),
  ('bouilloire-col-de-cygne', 'Noir mat', 'noir', 5900, null, 7, 1),
  ('boite-hermetique', 'Unique', 'u', 1500, null, 22, 1),
  ('verre-double-paroi', 'Unique', 'u', 1800, null, 16, 1)
) as v (slug, label, sku, price_cents, grams, stock, sort_order)
join public.products p on p.slug = v.slug;

insert into public.kit_items (kit_id, item_id, quantity, sort_order)
select k.id, i.id, c.quantity, c.sort_order
from (values
  ('kit-essentiel', 'chasen-80', 1, 1), ('kit-essentiel', 'chashaku', 1, 2), ('kit-essentiel', 'tamis-inox', 1, 3),
  ('kit-essentiel', 'matcha-quotidien', 1, 4),
  ('kit-latte', 'chasen-80', 1, 1), ('kit-latte', 'chashaku', 1, 2), ('kit-latte', 'tamis-inox', 1, 3),
  ('kit-latte', 'verre-double-paroi', 1, 4), ('kit-latte', 'matcha-latte', 1, 5),
  ('kit-complet', 'chawan-a-bec', 1, 1), ('kit-complet', 'chasen-100', 1, 2), ('kit-complet', 'support-chasen', 1, 3),
  ('kit-complet', 'chashaku', 1, 4), ('kit-complet', 'tamis-inox', 1, 5), ('kit-complet', 'matcha-ceremonie', 1, 6),
  ('le-coffre', 'chawan-a-bec', 1, 1), ('le-coffre', 'chasen-100', 1, 2), ('le-coffre', 'support-chasen', 1, 3),
  ('le-coffre', 'chashaku', 1, 4), ('le-coffre', 'tamis-inox', 1, 5), ('le-coffre', 'bouilloire-col-de-cygne', 1, 6),
  ('le-coffre', 'boite-hermetique', 1, 7), ('le-coffre', 'matcha-ceremonie', 1, 8), ('le-coffre', 'matcha-quotidien', 1, 9)
) as c (kit, item, quantity, sort_order)
join public.products k on k.slug = c.kit
join public.products i on i.slug = c.item;

-- Comptes de démonstration ---------------------------------------------------
-- client@usucha.test et admin@usucha.test se connectent avec le mot de passe « usucha-demo ».
-- Mot de passe public, fait pour la démo : à changer avant toute mise en ligne réelle.

insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change, email_change_token_new)
select '00000000-0000-0000-0000-000000000000', u.id, 'authenticated', 'authenticated', u.email,
  extensions.crypt('usucha-demo', extensions.gen_salt('bf')), now(),
  '{"provider":"email","providers":["email"]}', jsonb_build_object('full_name', u.full_name),
  now() - u.age, now() - u.age, '', '', '', ''
from (values
  ('00000000-0000-4000-8000-000000000001'::uuid, 'client@usucha.test', 'Client démo', interval '90 days'),
  ('00000000-0000-4000-8000-000000000002'::uuid, 'admin@usucha.test', 'Admin démo', interval '120 days')
) as u (id, email, full_name, age);

insert into auth.identities (user_id, provider_id, identity_data, provider, created_at, updated_at)
select id, id::text, jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true), 'email', now(), now()
from auth.users where email in ('client@usucha.test', 'admin@usucha.test');

update public.profiles set role = 'admin' where id = '00000000-0000-4000-8000-000000000002';
update public.profiles p set created_at = u.created_at from auth.users u where u.id = p.id;

insert into public.taste_profiles (user_id, cups_per_week, drink, taste, experience, owned, cafe_price_cents)
values ('00000000-0000-4000-8000-000000000001', 5, 'latte', 'equilibre', 'decouverte', '{chawan}', 650);

insert into public.addresses (user_id, recipient, line1, postal_code, city, is_default)
values ('00000000-0000-4000-8000-000000000001', 'Client démo', '12 rue du Faubourg', '75002', 'Paris', true);

-- Clients fictifs sans mot de passe : ils ne servent qu'à remplir l'historique des ventes.
insert into auth.users (instance_id, id, aud, role, email, raw_user_meta_data, created_at, updated_at)
select '00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated',
  'client' || i || '@usucha.test', jsonb_build_object('full_name', 'Client ' || i),
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
    where u.email like 'client_%@usucha.test'
  loop
    for n in 1 .. 2 + floor(random() * 6)::int loop
      v_day := floor(random() * least(80, extract(day from now() - v_customer.created_at)))::int;
      v_lines := 1 + floor(random() * 3)::int;

      insert into public.orders (user_id, status, total_cents, ship_recipient, ship_line1, ship_postal_code, ship_city, ship_country, created_at)
      values (v_customer.id, case when v_day > 10 then 'delivered' else 'shipped' end::public.order_status, 1,
        'Client', '1 avenue de la Démo', '69001', 'Lyon', 'FR', now() - (v_day || ' days')::interval)
      returning id into v_order;

      insert into public.order_items (order_id, variant_id, product_name, variant_label, unit_price_cents, quantity)
      select distinct on (v.id) v_order, v.id, p.name, v.label, v.price_cents, 1
      from (select id from public.product_variants order by random() limit v_lines) pick
      join public.product_variants v on v.id = pick.id
      join public.products p on p.id = v.product_id;

      update public.orders set total_cents = (
        select sum(unit_price_cents * quantity) from public.order_items where order_id = v_order
      ) where id = v_order;
    end loop;
  end loop;

  -- Une ligne sur dix revient : casse au transport, goût, ou changement d'avis.
  insert into public.returns (order_item_id, user_id, reason, quantity, status, created_at)
  select oi.id, o.user_id,
    (array['damaged', 'damaged', 'taste', 'not_as_described', 'changed_mind'])[1 + floor(random() * 5)::int]::public.return_reason,
    1, 'accepted', o.created_at + interval '5 days'
  from public.order_items oi join public.orders o on o.id = oi.order_id
  where o.status = 'delivered' and random() < 0.1;
end;
$$;

-- La commande livrée du client démo, pour montrer l'historique et les retours.
do $$
declare
  v_order uuid;
begin
  insert into public.orders (user_id, status, total_cents, ship_recipient, ship_line1, ship_postal_code, ship_city, ship_country, created_at)
  values ('00000000-0000-4000-8000-000000000001', 'delivered', 8100, 'Client démo', '12 rue du Faubourg', '75002', 'Paris', 'FR', now() - interval '20 days')
  returning id into v_order;

  insert into public.order_items (order_id, variant_id, product_name, variant_label, unit_price_cents, quantity)
  select v_order, v.id, p.name, v.label, v.price_cents, 1
  from public.product_variants v join public.products p on p.id = v.product_id
  where (p.slug, v.label) in (('kit-essentiel', 'Unique'), ('matcha-latte', '100 g'));
end;
$$;
