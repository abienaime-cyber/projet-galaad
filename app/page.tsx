import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { primaryButton, textLink } from "@/components/field";
import { ProductTile } from "@/components/product-tile";
import { getProducts, getShopper } from "@/lib/catalog";
import { CATEGORY_PATH, fitAll, forMe, price, type CatalogProduct } from "@/lib/shop";
import type { Category, Measurements } from "@/lib/sizing";

const STEPS = [
  { title: "Créez votre compte", text: "Une adresse e-mail et un mot de passe." },
  {
    title: "Donnez vos mesures",
    text: "Taille, poids et âge suffisent. Votre tour de poitrine et votre tour de taille rendent le calcul plus sûr.",
  },
  {
    title: "Choisissez dans votre taille",
    text: "La boutique n’affiche que les articles en stock dans votre taille, avec le niveau de confiance du calcul.",
  },
];

// Trois tenues côte à côte sur le même gris de studio : brun, noir, marine. Sur mobile, seul le costume noir reste ;
// lui seul est préchargé.
const LINEUP = ["costume-tweed-marron", "costume-ajuste-noir", "costume-croise-gris-bleu"];

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <section aria-labelledby="hero-title">
        <div className="grid bg-tile md:grid-cols-3">
          {LINEUP.map((slug, i) => {
            const product = products.find((p) => p.slug === slug);
            return product?.image ? (
              <Link key={slug} href={`/produit/${slug}`} aria-label={product.name} className={`relative block aspect-[4/5] md:aspect-auto md:h-[clamp(24rem,calc(100svh-24rem),37.5rem)] ${i === 1 ? "" : "max-md:hidden"}`}>
                <Image
                  src={product.image}
                  alt=""
                  fill
                  loading="eager"
                  preload={i === 1}
                  fetchPriority={i === 1 ? "high" : undefined}
                  sizes="(min-width: 768px) 34vw, 100vw"
                  className="object-cover object-top"
                />
              </Link>
            ) : null;
          })}
        </div>
        <div className="mx-auto max-w-[46rem] px-4 pt-10 text-center sm:px-8 md:pt-12">
          <h1 id="hero-title" className="text-[44px] md:text-[64px]">
            Le costume à votre taille
          </h1>
          <p className="mx-auto mt-5 max-w-[36rem] text-[17px] text-label-2">
            Votre taille, votre poids, votre âge. Carrure calcule la taille à prendre pour chaque costume et chaque chemise.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            <Suspense fallback={<Actions measured={false} />}>
              <ShopperActions />
            </Suspense>
          </div>
        </div>
      </section>

      <Suspense fallback={<Rows products={products} measurements={null} />}>
        <ShopperRows products={products} />
      </Suspense>

      <section aria-label="Les collections" className="mx-auto mt-24 grid max-w-[1440px] gap-x-5 gap-y-12 px-4 sm:px-8 md:mt-32 md:grid-cols-2">
        <CollectionTile category="suit" title="Tous les costumes" range="Du 44 au 58" products={products} cover="costume-trois-pieces-bleu-nuit" />
        <CollectionTile category="shirt" title="Toutes les chemises" range="Du S au 3XL" products={products} cover="chemise-oxford-bleu-ciel" />
      </section>

      <section aria-labelledby="how-title" className="mt-24 bg-tile md:mt-32">
        <div className="mx-auto max-w-[1180px] px-4 py-20 sm:px-8 md:py-28">
          <h2 id="how-title" className="text-center text-[34px] md:text-[48px]">
            Votre taille, sans cabine d’essayage
          </h2>
          <ol className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-12">
            {STEPS.map((step, i) => (
              <li key={step.title} className="border-t border-label pt-6">
                <h3 className="eyebrow">
                  <span className="figures mr-3">{i + 1}</span>
                  {step.title}
                </h3>
                <p className="mt-3 text-label-2">{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-14 max-w-[40rem] text-center text-[13px] text-label-2">
            La taille affichée reste une estimation : notre calcul indique toujours à quel point il est sûr de lui, et la
            taille voisine quand vous êtes entre deux.
          </p>
        </div>
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

async function ShopperRows({ products }: { products: CatalogProduct[] }) {
  const { measurements } = await getShopper();
  return <Rows products={products} measurements={measurements} />;
}

function Rows({ products, measurements }: Pick<RowProps, "products" | "measurements">) {
  return (
    <>
      <Row category="suit" title="Costumes" products={products} measurements={measurements} />
      <Row category="shirt" title="Chemises" products={products} measurements={measurements} />
    </>
  );
}

type RowProps = { category: Category; title: string; products: CatalogProduct[]; measurements: Measurements | null };

// Une rangée de quatre articles. Mensurations connues : les quatre premiers en stock dans la taille du client.
function Row({ category, title, products, measurements }: RowProps) {
  const fitted = fitAll(
    products.filter((p) => p.category === category),
    measurements,
  );
  const mine = measurements ? forMe(fitted, measurements.preferredFit) : [];
  const items = (mine.length > 0 ? mine : fitted).slice(0, 4);
  const id = `row-${category}`;
  return (
    <section aria-labelledby={id} className="mx-auto mt-24 max-w-[1440px] px-4 sm:px-8 md:mt-32">
      <div className="flex items-baseline justify-between gap-6 border-b border-separator pb-3">
        <h2 id={id} className="text-[28px] md:text-[36px]">
          {mine.length > 0 ? `${title} à votre taille` : title}
        </h2>
        <Link href={CATEGORY_PATH[category]} className={textLink}>
          Tout voir
        </Link>
      </div>
      <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 md:grid-cols-4">
        {items.map((item) => (
          <ProductTile key={item.product.slug} item={item} heading="h3" />
        ))}
      </ul>
    </section>
  );
}

type TileProps = { category: Category; title: string; range: string; products: CatalogProduct[]; cover: string };

function CollectionTile({ category, title, range, products, cover }: TileProps) {
  const prices = products.filter((p) => p.category === category).map((p) => p.priceCents);
  const image = products.find((p) => p.slug === cover)?.image;
  return (
    <Link href={CATEGORY_PATH[category]} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-tile md:aspect-square">
        {image && (
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
          />
        )}
      </div>
      <h2 className="mt-5 text-[28px] md:text-[34px]">{title}</h2>
      <p className="mt-1 text-label-2">
        {range}
        {prices.length > 0 && <> · À partir de {price(Math.min(...prices))}</>}
      </p>
      <span className="eyebrow mt-3 inline-flex min-h-11 items-center underline decoration-label/40 underline-offset-[6px] transition-colors duration-150 group-hover:decoration-label">
        Découvrir
      </span>
    </Link>
  );
}
