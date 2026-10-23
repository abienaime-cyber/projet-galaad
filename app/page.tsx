import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { primaryButton } from "@/components/field";
import { getProducts, getShopper } from "@/lib/catalog";
import { CATEGORY_PATH, price, type CatalogProduct } from "@/lib/shop";
import type { Category } from "@/lib/sizing";

const textLink = "inline-flex min-h-11 items-center text-[17px] text-link hover:underline";

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

// Trois costumes du catalogue en vitrine, le plus classique au centre.
const SHOWCASE = ["costume-lin-beige", "costume-laine-marine", "costume-prince-de-galles"];

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <section aria-labelledby="hero-title" className="mx-auto max-w-[980px] px-4 pt-14 text-center sm:px-[22px] md:pt-24">
        <h1 id="hero-title" className="mx-auto max-w-[12ch] text-5xl font-semibold md:text-[80px] md:tracking-[-0.035em]">
          Le costume à votre taille.
        </h1>
        <p className="mx-auto mt-5 max-w-[34rem] text-[19px] leading-snug text-label-2 md:text-[24px]">
          Votre taille, votre poids, votre âge. Carrure calcule la taille à prendre pour chaque costume et chaque chemise.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Suspense fallback={<Actions measured={false} />}>
            <ShopperActions />
          </Suspense>
        </div>

        <div className="mx-auto mt-14 flex max-w-[52rem] items-end justify-center gap-3 md:mt-20 md:gap-5">
          {SHOWCASE.map((slug, i) => {
            const product = products.find((p) => p.slug === slug);
            return product?.image ? (
              <Link
                key={slug}
                href={`/produit/${slug}`}
                className={`animate-rise block overflow-hidden rounded-[20px] [animation-delay:calc(var(--i)*80ms)] md:rounded-[28px] ${i === 1 ? "w-[38%]" : "w-[29%]"}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={750}
                  priority
                  sizes="(min-width: 768px) 320px, 38vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </Link>
            ) : null;
          })}
        </div>
      </section>

      <section aria-label="Les collections" className="mx-auto mt-16 grid max-w-[980px] gap-5 px-4 sm:px-[22px] md:mt-24 md:grid-cols-2">
        <CollectionTile category="suit" title="Costumes" range="Du 44 au 58" products={products} cover="costume-gris-anthracite" />
        <CollectionTile category="shirt" title="Chemises" range="Du S au 3XL" products={products} cover="chemise-oxford-bleu-ciel" />
      </section>

      <section aria-labelledby="how-title" className="mx-auto max-w-[980px] px-4 pt-24 pb-28 sm:px-[22px] md:pt-32">
        <h2 id="how-title" className="max-w-[18ch] text-[40px] font-semibold md:text-5xl">
          Votre taille, sans cabine d’essayage.
        </h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-12">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t border-separator pt-6">
              <span className="figures block text-[40px] leading-none text-label-2">{i + 1}</span>
              <h3 className="mt-5 text-[21px] font-semibold tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-2 text-label-2">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-12 max-w-[40rem] text-sm text-label-2">
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
        Modifier mes mensurations ›
      </Link>
    </>
  ) : (
    <>
      <Link href="/inscription" className={primaryButton}>
        Trouver ma taille
      </Link>
      <Link href="/costumes" className={textLink}>
        Voir les costumes ›
      </Link>
    </>
  );
}

type TileProps = { category: Category; title: string; range: string; products: CatalogProduct[]; cover: string };

function CollectionTile({ category, title, range, products, cover }: TileProps) {
  const prices = products.filter((p) => p.category === category).map((p) => p.priceCents);
  const image = products.find((p) => p.slug === cover)?.image;
  return (
    <Link href={CATEGORY_PATH[category]} className="group flex flex-col items-center overflow-hidden rounded-[28px] bg-tile px-6 pt-12 text-center transition-transform duration-150 ease-out active:scale-[0.99]">
      <h2 className="text-[40px] font-semibold">{title}</h2>
      <p className="mt-2 text-[19px] text-label-2">
        {range}.{prices.length > 0 && <> À partir de {price(Math.min(...prices))}.</>}
      </p>
      <span className="mt-3 inline-flex min-h-11 items-center text-[17px] text-link group-hover:underline">Découvrir ›</span>
      {image && (
        <div className="mt-8 w-full max-w-80 overflow-hidden rounded-t-[20px]">
          <Image
            src={image}
            alt=""
            width={640}
            height={800}
            sizes="(min-width: 768px) 320px, 80vw"
            className="aspect-[4/5] w-full object-cover transition-transform duration-300 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        </div>
      )}
    </Link>
  );
}
