import Link from "next/link";
import { ghostButton } from "@/components/field";
import { RevealGroup, SplitHeading } from "@/components/gsap";
import { Calculator } from "@/components/home/calculator";
import { Chain } from "@/components/home/chain";
import { Hero } from "@/components/home/hero";
import { Pieces, type Piece } from "@/components/home/pieces";
import { Pot } from "@/components/home/pot";
import { Protocol } from "@/components/home/protocol";
import { Rail } from "@/components/home/rail";
import { Stock } from "@/components/home/stock";
import { ProductTile } from "@/components/product-tile";
import { getProducts } from "@/lib/catalog";
import { DOSE_G } from "@/lib/reco";
import { minPrice, price } from "@/lib/shop";

// Inventaire des pièces, dans l'ordre du protocole d'assemblage : [étiquette, produit].
const PIECES: [string, string][] = [
  ["Chawan", "chawan-a-bec"],
  ["Matcha", "matcha-ceremonie"],
  ["Chasen", "chasen-80"],
  ["Support de chasen", "support-chasen"],
  ["Tamis", "tamis-inox"],
  ["Bouilloire", "bouilloire-col-de-cygne"],
  ["Chashaku", "chashaku"],
];

export default async function HomePage() {
  const products = await getProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const kit = bySlug.get("kit-essentiel");
  const quotidien = bySlug.get("matcha-quotidien");
  const refill = quotidien?.variants[0];
  const kits = products.filter((p) => p.category === "kit");

  const pieces: Piece[] = PIECES.flatMap(([label, slug], i) => {
    const p = bySlug.get(slug);
    return p?.image ? [{ index: String(i + 1).padStart(2, "0"), label, slug, name: p.name, price: price(minPrice(p)), photo: p.image }] : [];
  });

  const hasRefill = Boolean(quotidien && refill?.matchaGrams);
  const sections = ["Poudre", "Stock", ...(pieces.length ? ["Pièces"] : []), "Préparation", ...(hasRefill && kit ? ["Calcul"] : []), "Chaîne", ...(hasRefill ? ["Boîte"] : []), "Kits"];

  return (
    <>
      <Rail sections={sections} />
      <Hero kitName={kit?.name ?? "Kit Essentiel"} kitSlug="kit-essentiel" kitPrice={kit ? price(minPrice(kit)) : "—"} />
      <Stock />
      {pieces.length > 0 && <Pieces pieces={pieces} />}
      <Protocol />
      {hasRefill && kit && (
        <Calculator
          refill={{ name: quotidien!.name, priceCents: refill!.priceCents, grams: refill!.matchaGrams! }}
          kit={{ name: kit.name, slug: kit.slug, priceCents: minPrice(kit) }}
        />
      )}
      <Chain />
      {hasRefill && <Pot name={quotidien!.name} slug={quotidien!.slug} grams={refill!.matchaGrams!} price={price(refill!.priceCents)} dose={DOSE_G.pur} />}

      <section data-rail="Kits" data-theme="dark" aria-labelledby="kits-title" className="bg-ink text-paper">
        <div className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line-dark pb-3">
            <SplitHeading className="display text-[64px] sm:text-[96px]">
              <span id="kits-title">
                Choisir son <span className="text-matcha">kit</span>
              </span>
            </SplitHeading>
            <Link href="/boutique" className={ghostButton}>
              Toute la boutique
            </Link>
          </div>
          <RevealGroup as="ul" className="mt-6 grid grid-cols-2 gap-px lg:grid-cols-4">
            {kits.map((k) => (
              <ProductTile key={k.slug} item={{ product: k, match: null }} heading="h3" />
            ))}
          </RevealGroup>
        </div>
      </section>
    </>
  );
}
