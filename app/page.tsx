import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { primaryButton, textLink } from "@/components/field";
import { getProducts, getShopper } from "@/lib/catalog";
import { CATEGORY_PATH, price, type CatalogProduct } from "@/lib/shop";
import type { Category } from "@/lib/sizing";

const STEPS = [
  { title: "Créez votre compte.", text: "Une adresse e-mail et un mot de passe." },
  {
    title: "Donnez vos mesures.",
    text: "Taille, poids et âge suffisent. Votre tour de poitrine et votre tour de taille rendent le calcul plus sûr.",
  },
  {
    title: "Choisissez dans votre taille.",
    text: "La boutique n’affiche que les articles en stock dans votre taille, avec le niveau de confiance du calcul.",
  },
];

const NUMERALS = ["I", "II", "III"];

// Triptyque d'ouverture : brun, noir, marine. Le costume noir, au centre sous le titre, est le seul visuel sur mobile :
// lui seul est préchargé et il n'attend pas d'animation.
const SHOWCASE = ["costume-tweed-marron", "costume-ajuste-noir", "costume-croise-gris-bleu"];

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <section aria-labelledby="hero-title" className="relative">
        <div className="grid h-[min(calc(100svh-4rem),56rem)] min-h-[34rem] grid-cols-1 md:grid-cols-3">
          {SHOWCASE.map((slug, i) => {
            const product = products.find((p) => p.slug === slug);
            return product?.image ? (
              <Link
                key={slug}
                href={`/produit/${slug}`}
                aria-label={product.name}
                className={`group relative block overflow-hidden ${i === 1 ? "" : "animate-rise [animation-delay:calc(var(--i)*120ms)] max-md:hidden"}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <Image
                  src={product.image}
                  alt=""
                  fill
                  loading="eager"
                  preload={i === 1}
                  fetchPriority={i === 1 ? "high" : undefined}
                  sizes="(min-width: 768px) 34vw, 100vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
                />
              </Link>
            ) : null;
          })}
        </div>
        {/* Voile sombre en bas : le titre ivoire reste lisible sur n'importe quelle photo. */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-canvas)_0%,rgb(12_11_10/0.6)_24%,rgb(12_11_10/0)_48%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-12 text-center sm:px-8 md:pb-16">
          <h1 id="hero-title" className="mx-auto max-w-[14ch] text-[52px] md:text-[96px]">
            Le costume à votre taille.
          </h1>
          <p className="eyebrow mt-6 text-label-2">Costumes et chemises pour homme</p>
        </div>
      </section>

      <section aria-label="Votre taille" className="mx-auto max-w-[44rem] px-4 pt-14 text-center sm:px-8 md:pt-20">
        <p className="text-[19px] leading-relaxed text-label-2 md:text-[21px]">
          Votre taille, votre poids, votre âge. Carrure calcule la taille à prendre pour chaque costume et chaque chemise.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          <Suspense fallback={<Actions measured={false} />}>
            <ShopperActions />
          </Suspense>
        </div>
      </section>

      <section aria-label="Les collections" className="mx-auto mt-24 grid max-w-[1440px] gap-px px-4 sm:px-8 md:mt-32 md:grid-cols-2">
        <CollectionTile category="suit" title="Costumes" range="Du 44 au 58" products={products} cover="costume-rayure-tennis" />
        <CollectionTile category="shirt" title="Chemises" range="Du S au 3XL" products={products} cover="chemise-lin-blanche" />
      </section>

      <section aria-labelledby="how-title" className="mx-auto max-w-[1180px] px-4 pt-28 pb-32 sm:px-8 md:pt-40">
        <h2 id="how-title" className="mx-auto max-w-[18ch] text-center text-[40px] md:text-[64px]">
          Votre taille, sans cabine d’essayage.
        </h2>
        <ol className="mt-16 grid gap-12 md:mt-20 md:grid-cols-3 md:gap-14">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t border-separator pt-8 text-center md:text-left">
              <span aria-hidden className="font-display text-[44px] leading-none text-brass">{NUMERALS[i]}</span>
              <h3 className="mt-6 text-[24px]">{step.title}</h3>
              <p className="mt-3 text-label-2">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-16 max-w-[40rem] text-center text-sm text-label-2">
          La taille affichée reste une estimation : notre calcul indique toujours à quel point il est sûr de lui, et la taille
          voisine quand vous êtes entre deux.
        </p>
      </section>
    </>
  );
}

async function ShopperActions() {
  const { measurements } = await getShopper();
  return <Actions measured={measurements !== null} />;
}

function Actions({ measured }: { measured: boolean }) {
  return measured ? (
    <>
      <Link href="/costumes" className={primaryButton}>
        Voir les costumes à ma taille
      </Link>
      <Link href="/compte/mensurations" className={textLink}>
        Modifier mes mensurations
      </Link>
    </>
  ) : (
    <>
      <Link href="/inscription" className={primaryButton}>
        Trouver ma taille
      </Link>
      <Link href="/costumes" className={textLink}>
        Voir les costumes
      </Link>
    </>
  );
}

type TileProps = { category: Category; title: string; range: string; products: CatalogProduct[]; cover: string };

function CollectionTile({ category, title, range, products, cover }: TileProps) {
  const prices = products.filter((p) => p.category === category).map((p) => p.priceCents);
  const image = products.find((p) => p.slug === cover)?.image;
  return (
    <Link href={CATEGORY_PATH[category]} className="group relative block aspect-[4/5] overflow-hidden bg-tile">
      {image && (
        <Image
          src={image}
          alt=""
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
        />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(12_11_10/0.88)_0%,rgb(12_11_10/0)_55%)]" />
      <div className="absolute inset-x-0 bottom-0 p-8 text-center md:p-12">
        <h2 className="text-[48px] md:text-[64px]">{title}</h2>
        <p className="mt-3 text-label-2">
          {range}
          {prices.length > 0 && <> · À partir de {price(Math.min(...prices))}</>}
        </p>
        <span className="eyebrow mt-5 inline-flex min-h-11 items-center underline decoration-brass/60 underline-offset-[6px] transition-colors duration-150 group-hover:decoration-brass">
          Découvrir
        </span>
      </div>
    </Link>
  );
}
