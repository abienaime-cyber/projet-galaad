#!/usr/bin/env bash
# Deux clients commandent au même instant le dernier article d'une taille : un seul doit l'obtenir.
# Lancer après « npx supabase start » : bash supabase/tests/oversell.sh
set -uo pipefail
DB=${DB_URL:-postgresql://postgres:postgres@localhost:54322/postgres}
A=30000000-0000-4000-8000-00000000000a
B=30000000-0000-4000-8000-00000000000b
VARIANT="(select v.id from product_variants v join products p on p.id = v.product_id where p.slug = 'costume-gris-anthracite' and v.size_label = '52')"

initial=$(psql "$DB" -At -c "select stock from product_variants where id = $VARIANT")
cleanup() {
  psql "$DB" -q -c "delete from orders where user_id in ('$A', '$B'); delete from auth.users where id in ('$A', '$B'); update product_variants set stock = $initial where id = $VARIANT;"
}
trap cleanup EXIT

psql "$DB" -q -v ON_ERROR_STOP=1 <<SQL
insert into auth.users (id, email) values ('$A', 'survente-a@test.fr'), ('$B', 'survente-b@test.fr');
insert into addresses (user_id, recipient, line1, postal_code, city)
  values ('$A', 'A', '1 rue A', '75001', 'Paris'), ('$B', 'B', '1 rue B', '75001', 'Paris');
insert into carts (user_id) values ('$A'), ('$B');
insert into cart_items (cart_id, variant_id, quantity) select c.id, $VARIANT, 1 from carts c where c.user_id in ('$A', '$B');
update product_variants set stock = 1 where id = $VARIANT;
SQL

# Chaque session garde son verrou une seconde avant de valider : l'autre attend, puis trouve le stock à 0.
buy() {
  psql "$DB" -At 2>&1 <<SQL
begin;
set local role authenticated;
set local request.jwt.claim.sub = '$1';
select 'commande ' || public.place_order((select id from addresses where user_id = '$1'));
select pg_sleep(1);
commit;
SQL
}
buy "$A" > /tmp/oversell-a.log & buy "$B" > /tmp/oversell-b.log & wait

orders=$(psql "$DB" -At -c "select count(*) from orders where user_id in ('$A', '$B')")
stock=$(psql "$DB" -At -c "select stock from product_variants where id = $VARIANT")
grep -h -E "commande|ERROR" /tmp/oversell-a.log /tmp/oversell-b.log
echo "commandes créées : $orders, stock restant : $stock"
if [ "$orders" = 1 ] && [ "$stock" = 0 ]; then echo "OK : pas de survente"; else echo "ÉCHEC"; exit 1; fi
