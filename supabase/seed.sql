-- Données de démonstration : marque et produits fictifs.

insert into public.size_charts (name, category) values
  ('Chemises Galaad', 'shirt'),
  ('Costumes Galaad', 'suit');

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
where c.name = 'Chemises Galaad';

-- Taille française de veste : environ la moitié du tour de poitrine.
insert into public.size_chart_rows (size_chart_id, label, sort_order, chest_min, chest_max, waist_min, waist_max)
select c.id, (44 + 2 * i)::text, i + 1, 86 + 4 * i, 90 + 4 * i, 74 + 4 * i, 78 + 4 * i
from public.size_charts c, generate_series(0, 7) as i
where c.name = 'Costumes Galaad';

insert into public.products (slug, name, description, category, fit, color, material, price_cents, size_chart_id)
select p.slug, p.name, p.description, p.category::public.product_category, p.fit::public.fit,
  p.color, p.material, p.price_cents, c.id
from (values
  ('chemise-oxford-blanche', 'Chemise Oxford blanche', 'La chemise qui va avec tout. Coton Oxford épais, col boutonné, se porte avec ou sans veste.', 'shirt', 'regular', 'Blanc', 'Coton Oxford', 6900),
  ('chemise-oxford-bleu-ciel', 'Chemise Oxford bleu ciel', 'Le même Oxford, en bleu ciel. Un peu moins formel que le blanc, aussi net.', 'shirt', 'regular', 'Bleu ciel', 'Coton Oxford', 6900),
  ('chemise-popeline-blanche-ajustee', 'Chemise popeline blanche ajustée', 'Popeline lisse et coupe près du corps, pour le costume du lundi matin.', 'shirt', 'slim', 'Blanc', 'Popeline de coton', 7900),
  ('chemise-popeline-rayee-bleue', 'Chemise popeline rayures bleues', 'Fines rayures bleues sur fond blanc. Col italien qui tient sous une cravate.', 'shirt', 'regular', 'Rayé bleu et blanc', 'Popeline de coton', 7900),
  ('chemise-lin-sable', 'Chemise en lin sable', 'Lin lavé, coupe ample, faite pour les journées chaudes. Le froissé fait partie du charme.', 'shirt', 'loose', 'Sable', 'Lin', 8900),
  ('chemise-lin-blanche', 'Chemise en lin blanche', 'Lin blanc et coupe ample. Ouverte sur un t-shirt ou boutonnée le soir.', 'shirt', 'loose', 'Blanc', 'Lin', 8900),
  ('chemise-flanelle-carreaux', 'Chemise flanelle à carreaux', 'Flanelle brossée douce au toucher, carreaux vert et marine. Pour l''hiver.', 'shirt', 'regular', 'Carreaux vert et marine', 'Flanelle de coton', 7500),
  ('chemise-denim-indigo', 'Chemise denim indigo', 'Denim léger teint indigo. Elle se patine au fil des lavages.', 'shirt', 'regular', 'Indigo', 'Denim de coton léger', 8500),
  ('chemise-twill-rose-pale', 'Chemise twill rose pâle', 'Twill à la main douce, rose très discret. Coupe ajustée.', 'shirt', 'slim', 'Rose pâle', 'Twill de coton', 7900),
  ('chemise-col-mao-noire', 'Chemise col mao noire', 'Col officier et coton légèrement stretch. Sobre, sans cravate.', 'shirt', 'slim', 'Noir', 'Coton stretch', 7500),
  ('chemise-vichy-bleue', 'Chemise vichy bleue', 'Petits carreaux vichy bleus. Le classique du week-end.', 'shirt', 'regular', 'Vichy bleu', 'Coton', 6900),
  ('chemise-micro-pied-de-poule', 'Chemise micro pied-de-poule', 'Motif pied-de-poule si fin qu''il se lit gris à un mètre. Coupe ajustée.', 'shirt', 'slim', 'Gris', 'Coton fil à fil', 8900),
  ('chemise-smoking-plastron', 'Chemise de smoking à plastron', 'Plastron plissé, poignets mousquetaires. Pour les soirées habillées.', 'shirt', 'slim', 'Blanc', 'Popeline de coton', 11900),
  ('chemise-chambray', 'Chemise chambray', 'Chambray bleu délavé, plus léger que le denim. Se porte toute l''année.', 'shirt', 'regular', 'Bleu délavé', 'Chambray de coton', 7500),
  ('surchemise-velours-camel', 'Surchemise velours côtelé camel', 'Velours côtelé épais, coupe ample. Se porte comme une veste légère.', 'shirt', 'loose', 'Camel', 'Velours côtelé', 9900),
  ('chemise-fil-a-fil-bleue', 'Chemise fil à fil bleue', 'Tissage fil à fil qui donne un bleu chiné. La chemise de bureau par excellence.', 'shirt', 'regular', 'Bleu', 'Coton fil à fil', 7900),
  ('chemise-maille-marine', 'Chemise en maille piquée marine', 'Maille piquée souple comme un polo, col de chemise. Ne se repasse pas.', 'shirt', 'regular', 'Bleu marine', 'Maille piquée de coton', 6500),
  ('chemise-soie-coton-ecru', 'Chemise soie et coton écru', 'Mélange soie et coton au tombé fluide, légèrement brillant. Coupe ajustée.', 'shirt', 'slim', 'Écru', 'Soie et coton', 12900),
  ('costume-laine-marine', 'Costume laine marine', 'Le premier costume à avoir. Laine vierge, deux boutons, pantalon à pinces plates.', 'suit', 'regular', 'Bleu marine', 'Laine vierge', 39900),
  ('costume-gris-anthracite', 'Costume gris anthracite', 'Gris foncé, sérieux sans être triste. Convient aux entretiens comme aux mariages.', 'suit', 'regular', 'Gris anthracite', 'Laine vierge', 39900),
  ('costume-ajuste-bleu-nuit', 'Costume ajusté bleu nuit', 'Coupe près du corps et laine légèrement stretch pour garder l''aisance.', 'suit', 'slim', 'Bleu nuit', 'Laine stretch', 44900),
  ('costume-flanelle-gris-chine', 'Costume flanelle gris chiné', 'Flanelle de laine chaude et mate. Le costume d''automne.', 'suit', 'regular', 'Gris chiné', 'Flanelle de laine', 49900),
  ('costume-lin-beige', 'Costume en lin beige', 'Lin beige, veste déstructurée, coupe ample. Pour les mariages d''été.', 'suit', 'loose', 'Beige', 'Lin', 34900),
  ('costume-prince-de-galles', 'Costume prince-de-galles', 'Carreaux prince-de-galles gris rehaussés d''un fil bleu. Un classique anglais.', 'suit', 'regular', 'Gris et bleu', 'Laine', 54900),
  ('costume-croise-marine', 'Costume croisé marine', 'Veste croisée six boutons. Plus formel, très structuré aux épaules.', 'suit', 'regular', 'Bleu marine', 'Laine vierge', 59900),
  ('smoking-noir-revers-satin', 'Smoking noir revers satin', 'Revers en satin, bande de satin sur le pantalon. Pour les soirées black tie.', 'suit', 'slim', 'Noir', 'Laine et satin', 69900),
  ('costume-tweed-marron', 'Costume tweed marron', 'Tweed de laine robuste aux reflets roux. Pour la campagne ou la ville en hiver.', 'suit', 'regular', 'Marron', 'Tweed de laine', 54900),
  ('costume-trois-pieces-gris', 'Costume trois pièces gris', 'Veste, gilet et pantalon en laine grise. Le gilet se porte aussi seul.', 'suit', 'regular', 'Gris moyen', 'Laine vierge', 64900),
  ('costume-coton-vert-olive', 'Costume coton vert olive', 'Coton sergé vert olive, coupe ample. Se dépareille facilement.', 'suit', 'loose', 'Vert olive', 'Coton', 32900),
  ('costume-rayure-tennis', 'Costume rayure tennis', 'Fines rayures claires sur fond anthracite. Coupe ajustée.', 'suit', 'slim', 'Anthracite rayé', 'Laine', 52900)
) as p (slug, name, description, category, fit, color, material, price_cents)
join public.size_charts c on c.category = p.category::public.product_category;

-- Stock déterministe entre 0 et 10, avec environ une variante sur quatre en rupture.
insert into public.product_variants (product_id, size_label, sku, stock)
select p.id, r.label, upper(p.slug || '-' || r.label),
  greatest(((p.n * 7 + r.sort_order * 5) % 13) - 2, 0)
from (select *, row_number() over (order by slug) as n from public.products) p
join public.size_chart_rows r on r.size_chart_id = p.size_chart_id;
