import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { primaryButton } from "@/components/field";
import { Garment } from "@/components/garment";
import { getProduct, getShopper } from "@/lib/catalog";
import { CATEGORY_PATH, CONFIDENCE_LABEL, FIT_LABEL, fitAll, price, type CatalogProduct } from "@/lib/shop";

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product?.name ?? "Article introuvable" };
}

export default function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-6 pb-24 sm:px-[22px] md:pt-10">
      <Suspense fallback={<div aria-busy className="mt-12 aspect-[4/5] max-h-[36rem] rounded-[28px] bg-tile lg:w-1/2" />}>
        {params.then(({ slug }) => (
          <ProductView slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

async function ProductView({ slug }: { slug: string }) {
  const product = await getProduct(slug);
  if (!product) notFound();
  const isSuit = product.category === "suit";
  const sizes = product.sizes.map((s) => s.label);

  return (
    <>
      <Link href={CATEGORY_PATH[product.category]} className="inline-flex min-h-11 items-center text-sm text-link hover:underline">
        ‹ {isSuit ? "Costumes" : "Chemises"}
      </Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14">
        <div className="rounded-[28px] bg-tile px-8 py-10 sm:px-16 sm:py-14 lg:sticky lg:top-[68px] lg:self-start">
          <Garment id={product.slug} category={product.category} color={product.color} className="mx-auto aspect-[4/5] w-full max-w-[22rem]" />
        </div>

        <div>
          <h1 className="text-[40px] font-semibold md:text-5xl">{product.name}</h1>
          <p className="mt-3 text-[21px] tabular-nums">{price(product.priceCents)}</p>
          <p className="mt-6 max-w-[34rem] text-pretty">{product.description}</p>

          <Suspense fallback={<div aria-busy className="mt-8 h-44 rounded-[18px] bg-tile" />}>
            <YourSize product={product} />
          </Suspense>

          <dl className="mt-10 grid grid-cols-[auto_minmax(0,1fr)] gap-x-8 gap-y-3 border-t border-separator pt-8 text-sm">
            <dt className="text-label-2">Coupe</dt>
            <dd>{FIT_LABEL[product.fit]}</dd>
            <dt className="text-label-2">Matière</dt>
            <dd>{product.material}</dd>
            <dt className="text-label-2">Couleur</dt>
            <dd>{product.color}</dd>
            {sizes.length > 0 && (
              <>
                <dt className="text-label-2">Tailles</dt>
                <dd className="tabular-nums">
                  {sizes[0]} à {sizes.at(-1)}
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </>
  );
}

async function YourSize({ product }: { product: CatalogProduct }) {
  const { signedIn, measurements } = await getShopper();
  const [{ rec, inStock }] = fitAll([product], measurements);

  return (
    <>
      <section aria-labelledby="your-size" className="mt-8 rounded-[18px] bg-tile p-6 sm:p-8">
        <h2 id="your-size" className="text-sm text-label-2">
          Votre taille
        </h2>
        {rec?.size ? (
          <>
            <p className="mt-2 flex items-baseline gap-3">
              <span className={`figures text-[56px] leading-none ${rec.estimated ? "estimated" : ""}`}>{rec.size}</span>
              {rec.alternative && <span className="text-[17px] text-label-2">ou {rec.alternative}</span>}
            </p>
            <p className="mt-3 text-sm text-label-2">
              Taille estimée, {CONFIDENCE_LABEL[rec.confidence]}.{" "}
              {inStock ? <span className="text-ok">En stock dans votre taille.</span> : "Épuisée dans votre taille pour le moment."}
            </p>
            <Link href="/compte/mensurations" className="mt-1 inline-flex min-h-11 items-center text-sm text-link hover:underline">
              Modifier mes mensurations
            </Link>
          </>
        ) : rec ? (
          <p className="mt-2 text-[17px]">
            Vos mensurations sortent du tableau de tailles de cet article.{" "}
            <Link href="/compte/mensurations" className="text-link hover:underline">
              Vérifier mes mensurations
            </Link>
          </p>
        ) : (
          <>
            <p className="mt-2 max-w-[30rem] text-[17px]">
              Donnez votre taille, votre poids et votre âge : nous calculons la taille à prendre pour cet article.
            </p>
            <Link href={signedIn ? "/compte/mensurations" : "/inscription"} className={`${primaryButton} mt-5`}>
              {signedIn ? "Saisir mes mensurations" : "Créer un compte"}
            </Link>
          </>
        )}
      </section>

      <section aria-labelledby="stock-title" className="mt-8">
        <h2 id="stock-title" className="text-[17px] font-semibold">
          Disponibilité par taille
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map(({ label }) => {
            const available = (product.stock[label] ?? 0) > 0;
            const state = label === rec?.size ? "chosen" : label === rec?.alternative ? "alternative" : "idle";
            return (
              <li
                key={label}
                data-state={state}
                className={`inline-flex h-10 min-w-12 items-center justify-center rounded-full px-3 text-sm font-semibold tabular-nums data-[state=alternative]:text-accent data-[state=alternative]:shadow-[inset_0_0_0_1px_var(--color-accent)] data-[state=chosen]:bg-accent data-[state=chosen]:text-white data-[state=idle]:bg-tile ${
                  available ? "" : "text-label-2 line-through"
                }`}
              >
                {label}
                <span className="sr-only">{available ? ", en stock" : ", épuisé"}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-label-2">Les tailles barrées sont épuisées.</p>
      </section>
    </>
  );
}
