import Image from "next/image";
import Link from "next/link";
import { secondaryButton } from "@/components/field";
import { RevealGroup, SplitHeading } from "@/components/gsap";
import { Calculator } from "@/components/home/calculator";
import { Chain } from "@/components/home/chain";
import { Goods, type Exhibit } from "@/components/home/goods";
import { Hero } from "@/components/home/hero";
import { Protocol } from "@/components/home/protocol";
import { Rail } from "@/components/home/rail";
import { Vault, type VaultPiece } from "@/components/home/vault";
import { ProductTile } from "@/components/product-tile";
import { getProducts } from "@/lib/catalog";
import { costPerCupCents, GRADE_LABEL } from "@/lib/reco";
import { minPrice, price, type CatalogProduct } from "@/lib/shop";

// Pièces de la table d'inspection, dans l'ordre de goodsScene() : [clé 3D, étiquette, produit].
const EXHIBITS: [string, string, string][] = [
  ["chawan", "Chawan", "chawan-a-bec"],
  ["tin", "Matcha", "matcha-quotidien"],
  ["chasen", "Chasen", "chasen-80"],
  ["kusenaoshi", "Support de chasen", "support-chasen"],
  ["furui", "Tamis", "tamis-inox"],
  ["kettle", "Bouilloire", "bouilloire-col-de-cygne"],
  ["chashaku", "Chashaku", "chashaku"],
];

// Pièces du coffre, dans l'ordre de coffre() : [étiquette, produit].
const VAULT: [string, string][] = [
  ["Chawan", "chawan-a-bec"],
  ["Chasen 100", "chasen-100"],
  ["Support", "support-chasen"],
  ["Cérémonie", "matcha-ceremonie"],
  ["Quotidien", "matcha-quotidien"],
  ["Boîte", "boite-hermetique"],
  ["Chashaku", "chashaku"],
  ["Tamis", "tamis-inox"],
  ["Bouilloire", "bouilloire-col-de-cygne"],
];

const firstInStock = (p: CatalogProduct | undefined) => p?.variants.find((v) => v.stock > 0) ?? null;
const two = (i: number) => String(i + 1).padStart(2, "0");

export default async function HomePage() {
  const products = await getProducts();
  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const kit = bySlug.get("kit-essentiel");
  const coffre = bySlug.get("le-coffre");
  const quotidien = bySlug.get("matcha-quotidien");
  const refill = quotidien?.variants[0];
  const grades = products.filter((p) => p.category === "matcha");
  const kits = products.filter((p) => p.category === "kit");

  const exhibits: Exhibit[] = EXHIBITS.flatMap(([id, label, slug], i) => {
    const p = bySlug.get(slug);
    return p ? [{ id, index: two(i), label, slug, name: p.name, price: price(minPrice(p)), image: p.image }] : [];
  });
  const pieces: VaultPiece[] = VAULT.map(([label, slug], i) => ({ index: two(i), label, slug }));

  const showCalculator = Boolean(refill?.matchaGrams && kit);
  const sections = ["Plaque", "Dossier", "Pièces", "Protocole", ...(showCalculator ? ["Calcul"] : []), "Fabrication", ...(coffre ? ["Coffre"] : []), "Kits"];

  return (
    <>
      <Rail sections={sections} />
      <Hero
        kitName={kit?.name ?? "Kit Essentiel"}
        kitSlug="kit-essentiel"
        kitPrice={kit ? price(minPrice(kit)) : "—"}
        cupPrice={refill?.matchaGrams ? price(costPerCupCents(refill.priceCents, refill.matchaGrams, "pur")) : "—"}
      />

      <section data-rail="Dossier" aria-labelledby="dossier-title" className="registration relative bg-steel [--cell-h:50%] [--cell:25%]">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:py-28">
          <SplitHeading className="display text-[64px] sm:text-[96px]">
            <span id="dossier-title">Tout le monde en veut.</span>
          </SplitHeading>
          <div className="self-end md:pb-3">
            <p className="max-w-[34rem] text-[20px]">
              Les producteurs japonais peinent à suivre la demande de matcha. Nous en avons fait sortir un peu, avec tout ce qu’il faut pour le préparer chez vous, sans
              file d’attente.
            </p>
            <p className="mono mt-3 text-fog">Source : AFP, 26 juin 2025.</p>
          </div>
        </div>
        <RevealGroup as="ul" className="mx-auto grid max-w-[1440px] gap-px px-4 pb-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {grades.map((g) => (
            <li key={g.slug}>
              <Link href={`/produit/${g.slug}`} className="group flex h-full flex-col bg-paper/50 p-4 transition-colors duration-200 hover:bg-paper/90">
                {g.image && <Image src={g.image} alt="" width={400} height={400} className="mx-auto aspect-square w-3/4 object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1" />}
                <p className="display mt-2 text-[30px]">{g.name}</p>
                <p className="mono text-fog">Grade {GRADE_LABEL[g.grade!]}</p>
                <p className="mt-3 flex items-center gap-1" aria-label={`Intensité ${g.intensity} sur 5`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} aria-hidden className={`h-2 flex-1 ${n <= g.intensity! ? "bg-ink" : "shadow-[inset_0_0_0_1px_var(--color-ink)]"}`} />
                  ))}
                </p>
                <p className="mono mt-1 flex justify-between text-[12px] text-fog">
                  <span>doux</span>
                  <span>corsé</span>
                </p>
                <p className="mono mt-auto pt-4">dès {price(minPrice(g))}</p>
              </Link>
            </li>
          ))}
        </RevealGroup>
      </section>

      <Goods exhibits={exhibits} />
      <Protocol />
      {showCalculator && (
        <Calculator
          refill={{ name: quotidien!.name, priceCents: refill!.priceCents, grams: refill!.matchaGrams! }}
          kit={{ name: kit!.name, slug: kit!.slug, priceCents: minPrice(kit!) }}
        />
      )}
      <Chain />
      {coffre && (
        <Vault
          name={coffre.name}
          slug={coffre.slug}
          variantId={firstInStock(coffre)?.id ?? null}
          price={price(minPrice(coffre))}
          separate={coffre.separatePriceCents ? price(coffre.separatePriceCents) : null}
          pieces={pieces}
          description={coffre.description}
        />
      )}

      <section data-rail="Kits" aria-labelledby="kits-title" className="mx-auto max-w-[1440px] px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-ink pb-3">
          <SplitHeading className="display text-[64px] sm:text-[96px]">
            <span id="kits-title">Choisir son kit</span>
          </SplitHeading>
          <Link href="/compte/profil" className={secondaryButton}>
            Mon profil de goût
          </Link>
        </div>
        <RevealGroup as="ul" className="mt-6 grid grid-cols-2 gap-px lg:grid-cols-4">
          {kits.map((k) => (
            <ProductTile key={k.slug} item={{ product: k, match: null }} heading="h3" />
          ))}
        </RevealGroup>
      </section>
    </>
  );
}
