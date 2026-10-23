-- Vérifie la RLS et les contraintes par rôle (anon, client, admin). Lancer après auth_stub, migrations et seed.
-- Chaque ERROR attendue prouve qu'une écriture interdite est bloquée.
\set ON_ERROR_STOP 0
insert into auth.users (id, email, raw_user_meta_data) values
 ('00000000-0000-0000-0000-00000000000a','a@x.fr','{"full_name":"Alice"}'),
 ('00000000-0000-0000-0000-00000000000b','b@x.fr','{}'),
 ('00000000-0000-0000-0000-0000000000ad','admin@x.fr','{}');
update profiles set role='admin' where id='00000000-0000-0000-0000-0000000000ad';
update products set is_active=false where slug='costume-tweed-marron';

\echo '--- anon'
set role anon;
select 'anon voit produits', count(*) from products;
select 'anon voit variantes', count(*) from product_variants;
select 'anon voit profils', count(*) from profiles;
insert into products (slug,name,category,color,material,price_cents,size_chart_id) select 'x','x','shirt','x','x',1,id from size_charts limit 1;
reset role;

\echo '--- client A'
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000a';
select 'A voit profils', count(*), max(full_name) from profiles;
update profiles set role='admin' where id='00000000-0000-0000-0000-00000000000a';
update profiles set full_name='Alice M.' where id='00000000-0000-0000-0000-00000000000a';
insert into measurements (user_id,height_cm,weight_kg,age) values ('00000000-0000-0000-0000-00000000000a',180,75,30);
insert into measurements (user_id,height_cm,weight_kg,age) values ('00000000-0000-0000-0000-00000000000b',180,75,30);
insert into measurements (user_id,height_cm,weight_kg,age) values ('00000000-0000-0000-0000-00000000000a',300,75,30);
insert into addresses (user_id,recipient,line1,postal_code,city,is_default) values ('00000000-0000-0000-0000-00000000000a','Alice','1 rue X','75001','Paris',true);
insert into addresses (user_id,recipient,line1,postal_code,city,is_default) values ('00000000-0000-0000-0000-00000000000a','Alice','2 rue Y','75002','Paris',true);
update product_variants set stock=99;
select 'A voit le tweed inactif', count(*) from products where slug='costume-tweed-marron';
reset role;

\echo '--- client B'
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-00000000000b';
select 'B voit mesures', count(*) from measurements;
select 'B voit adresses', count(*) from addresses;
delete from addresses;
reset role;

\echo '--- admin'
set role authenticated; set request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000ad';
select 'admin voit profils', count(*) from profiles;
select 'admin voit mesures', count(*) from measurements;
select 'admin voit tweed', count(*) from products where slug='costume-tweed-marron';
insert into products (slug,name,category,color,material,price_cents,size_chart_id) select 'chemise-test','Test','shirt','x','x',100,id from size_charts where category='shirt' returning slug;
insert into products (slug,name,category,color,material,price_cents,size_chart_id) select 'mauvais-tableau','Test','shirt','x','x',100,id from size_charts where category='suit';
insert into product_variants (product_id,size_label,sku) select id,'48','CHEMISE-TEST-48' from products where slug='chemise-test';
insert into product_variants (product_id,size_label,sku) select id,'M','CHEMISE-TEST-M' from products where slug='chemise-test' returning sku;
update products set name='Renommé' where slug='chemise-test' returning updated_at > created_at as updated_at_bouge;
reset role;
select 'stock inchangé par A', max(stock) from product_variants;
select 'role A', role, full_name from profiles where id='00000000-0000-0000-0000-00000000000a';
