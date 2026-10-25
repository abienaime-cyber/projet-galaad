import { ArrowRight, Funnel, Gauge, Ruler, Scales } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { invertedButton, primaryButton, secondaryButton, textLink } from "@/components/field";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProductTile } from "@/components/product-tile";
import { getProducts, getShopper } from "@/lib/catalog";
import { CATEGORY_PATH, fitAll, forMe, price, type CatalogProduct } from "@/lib/shop";
import type { Category, Measurements } from "@/lib/sizing";

// Section « Feature grid » du MASTER : une idée par carte.
const FEATURES = [
  { Icon: Ruler, title: "Trois chiffres suffisent", text: "Taille, poids et âge. Tour de poitrine et tour de taille si vous les connaissez." },
  { Icon: Scales, title: "Une taille par article", text: "Chaque costume et chaque chemise a son propre tableau. Le calcul se fait article par article." },
  { Icon: Gauge, title: "Un calcul qui se dit sûr ou non", text: "Chaque taille est donnée avec son niveau de confiance, et la taille voisine quand vous êtes entre deux." },
  { Icon: Funnel, title: "Seulement ce qui vous va", text: "Le filtre « Pour moi » n’affiche que les articles en stock dans votre taille." },
];

const STEPS = [
  { title: "Créez votre compte", text: "Une adresse e-mail et un mot de passe." },
  { title: "Donnez vos mesures", text: "Elles servent au calcul de taille, et à rien d’autre." },
  { title: "Choisissez dans votre taille", text: "La boutique affiche votre taille sur chaque article." },
];

// Largeur et espacement communs aux sections sous l’ouverture.
const section = "mx-auto mt-24 max-w-[1280px] px-4 sm:px-8 md:mt-32";

// Trois articles posés côte à côte en ouverture : un costume marine, une chemise blanche, un costume vert.
const HERO = ["costume-laine-marine", "chemise-oxford-blanche", "costume-vert-sapin"];

export default async function Home() {
  const products = await getProducts();
  const hero = HERO.map((slug) => products.find((p) => p.slug === slug)).filter((p): p is CatalogProduct => Boolean(p?.image));

  return (
    <>
      <section aria-labelledby="hero-title" className="mx-auto grid max-w-[1280px] items-center gap-12 px-4 pt-12 sm:px-8 md:pt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal className="max-lg:text-center">
          <p className="eyebrow text-muted-foreground">Costumes et chemises pour homme</p>
          <h1 id="hero-title" className="mt-4 text-[48px] md:text-[68px]">
            Le costume à votre taille
          </h1>
          <p className="mt-6 max-w-[34rem] text-[18px] text-muted-foreground max-lg:mx-auto">
            Votre taille, votre poids, votre âge. Carrure calcule la taille à prendre pour chaque costume et chaque chemise.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4 max-lg:justify-center">
            <Suspense fallback={<Actions measured={false} />}>
              <ShopperActions />
            </Suspense>
          </div>
        </Reveal>
        <Stagger onMount className="grid grid-cols-3 gap-3 sm:gap-4">
          {hero.map((product, i) => (
            <StaggerItem key={product.slug}>
              <Link
                href={`/produit/${product.slug}`}
                aria-label={product.name}
                className={`card block overflow-hidden bg-muted transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg ${i === 1 ? "translate-y-6 hover:translate-y-5.5" : ""}`}
              >
                <Image
                  src={product.image!}
                  alt=""
                  width={500}
                  height={625}
                  preload={i === 0}
                  fetchPriority={i === 0 ? "high" : undefined}
                  sizes="(min-width: 1024px) 220px, 33vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section aria-labelledby="features-title" className={section}>
        <h2 id="features-title" className="text-center text-[36px] md:text-[48px]">
          Votre taille, sans cabine d’essayage
        </h2>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, title, text }) => (
            <StaggerItem key={title} className="card flex gap-4 p-5 sm:flex-col sm:gap-5 sm:p-6">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-muted text-foreground">
                <Icon aria-hidden size={24} />
              </span>
              <div>
                <h3 className="text-[22px] sm:text-[24px]">{title}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <Suspense fallback={<Rows products={products} measurements={null} />}>
        <ShopperRows products={products} />
      </Suspense>

      <section aria-label="Les collections" className={`${section} grid gap-5 md:grid-cols-2`}>
        <Reveal>
          <CollectionTile category="suit" title="Tous les costumes" range="Du 44 au 58" products={products} cover="costume-trois-pieces-bleu-nuit" />
        </Reveal>
        <Reveal delay={0.08}>
          <CollectionTile category="shirt" title="Toutes les chemises" range="Du S au 3XL" products={products} cover="chemise-vichy-bleue" />
        </Reveal>
      </section>

      <section aria-labelledby="how-title" className={section}>
        <Reveal className="rounded-2xl bg-primary px-6 py-16 text-on-primary sm:px-12 md:py-20">
          <h2 id="how-title" className="text-center text-[36px] md:text-[48px]">
            Comment ça marche
          </h2>
          <ol className="mx-auto mt-12 grid max-w-[1040px] gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="text-center">
                <span className="figures inline-flex size-12 items-center justify-center rounded-full border-2 border-on-primary/40 text-[18px] font-semibold text-on-primary">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-[26px]">{step.title}</h3>
                <p className="mt-2 text-[15px] text-on-primary/75">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex justify-center">
            <Link href="/inscription" className={invertedButton}>
              Trouver ma taille
              <ArrowRight aria-hidden size={18} />
            </Link>
          </div>
          <p className="mx-auto mt-10 max-w-[40rem] text-center text-[13px] text-on-primary/65">
            La taille affichée reste une estimation : notre calcul indique toujours à quel point il est sûr de lui, et la
            taille voisine quand vous êtes entre deux.
          </p>
        </Reveal>
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
      <Link href="/compte/mensurations" className={secondaryButton}>
        Modifier mes mensurations
      </Link>
    </>
  ) : (
    <>
      <Link href="/inscription" className={primaryButton}>
        Trouver ma taille
      </Link>
      <Link href="/costumes" className={secondaryButton}>
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
    <section aria-labelledby={id} className={section}>
      <div className="flex items-end justify-between gap-6">
        <h2 id={id} className="text-[32px] md:text-[42px]">
          {mine.length > 0 ? `${title} à votre taille` : title}
        </h2>
        <Link href={CATEGORY_PATH[category]} className={textLink}>
          Tout voir
        </Link>
      </div>
      <Stagger className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
        {items.map((item) => (
          <ProductTile key={item.product.slug} item={item} heading="h3" />
        ))}
      </Stagger>
    </section>
  );
}

type TileProps = { category: Category; title: string; range: string; products: CatalogProduct[]; cover: string };

function CollectionTile({ category, title, range, products, cover }: TileProps) {
  const prices = products.filter((p) => p.category === category).map((p) => p.priceCents);
  const image = products.find((p) => p.slug === cover)?.image;
  return (
    <Link
      href={CATEGORY_PATH[category]}
      className="group card grid h-full overflow-hidden transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg sm:grid-cols-2"
    >
      <div className="relative aspect-[4/5] bg-muted">
        {image && <Image src={image} alt="" fill sizes="(min-width: 768px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />}
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8">
        <h2 className="text-[32px] md:text-[36px]">{title}</h2>
        <p className="mt-2 text-muted-foreground">
          {range}
          {prices.length > 0 && <> · À partir de {price(Math.min(...prices))}</>}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-foreground">
          Découvrir
          <ArrowRight aria-hidden size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
