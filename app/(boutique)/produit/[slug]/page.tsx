import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { primaryButton } from "@/components/field";
import { getProduct, getShopper } from "@/lib/catalog";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_PATH, CONFIDENCE_LABEL, FIT_LABEL, fitAll, price, type CatalogProduct } from "@/lib/shop";
import { FIT_FEEDBACK } from "@/lib/validation";
import { AddToCart } from "./add-to-cart";
import { Advisor } from "./advisor";
import { ReviewForm } from "./review-form";

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return { title: product?.name ?? "Article introuvable", description: product?.description };
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
        <div className="lg:sticky lg:top-[68px] lg:self-start">
          {product.image ? (
            <Image
              src={product.image}
              alt={`${product.name}, porté`}
              width={1000}
              height={1250}
              priority
              sizes="(min-width: 1024px) 500px, 100vw"
              className="aspect-[4/5] w-full rounded-[28px] bg-tile object-cover"
            />
          ) : (
            <div className="aspect-[4/5] rounded-[28px] bg-tile" />
          )}
        </div>

        <div>
          <h1 className="text-[40px] font-semibold md:text-5xl">{product.name}</h1>
          <p className="mt-3 text-[21px] tabular-nums">{price(product.priceCents)}</p>
          <p className="mt-6 max-w-[34rem] text-pretty">{product.description}</p>

          <Suspense fallback={<div aria-busy className="mt-8 h-72 rounded-[18px] bg-tile" />}>
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

          <Suspense fallback={null}>
            <Reviews product={product} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function YourSize({ product }: { product: CatalogProduct }) {
  const { signedIn, measurements } = await getShopper();
  const [{ rec, inStock }] = fitAll([product], measurements);
  const sizes = product.sizes.map(({ label }) => ({
    label,
    variantId: product.variantIds[label],
    inStock: (product.stock[label] ?? 0) > 0,
    state: label === rec?.size ? ("chosen" as const) : label === rec?.alternative ? ("alternative" as const) : ("idle" as const),
  }));

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

      <AddToCart slug={product.slug} sizes={sizes} defaultSize={inStock ? rec!.size : null} />
      {rec?.size && <Advisor slug={product.slug} />}
    </>
  );
}

const monthYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

async function Reviews({ product }: { product: CatalogProduct }) {
  const supabase = await createClient();
  const [{ data: reviews }, { data: purchased }, { data: auth }] = await Promise.all([
    supabase.from("reviews").select("id, user_id, rating, fit_feedback, comment, created_at").eq("product_id", product.id).order("created_at", { ascending: false }),
    supabase.rpc("has_purchased", { p_product_id: product.id }),
    supabase.auth.getUser(),
  ]);
  const list = reviews ?? [];
  const canReview = purchased === true && !list.some((r) => r.user_id === auth.user?.id);
  const average = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;

  return (
    <section aria-labelledby="reviews-title" className="mt-10 border-t border-separator pt-8">
      <h2 id="reviews-title" className="text-[21px] font-semibold">
        Avis clients
      </h2>
      {list.length === 0 ? (
        <p className="mt-2 text-sm text-label-2">Aucun avis pour le moment. Seuls les clients qui ont acheté l’article peuvent le noter.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-label-2">
            <span className="figures text-[17px] text-label">{average.toFixed(1).replace(".", ",")}</span> sur 5, {list.length} avis
          </p>
          <ul className="mt-5 grid gap-5">
            {list.map((r) => (
              <li key={r.id} className="text-sm">
                <p>
                  <span className="font-semibold tabular-nums">{r.rating}/5</span>
                  {r.fit_feedback && <span className="text-label-2"> · {FIT_FEEDBACK[r.fit_feedback as keyof typeof FIT_FEEDBACK]}</span>}
                  <span className="text-label-2"> · {monthYear.format(new Date(r.created_at))}</span>
                </p>
                {r.comment && <p className="mt-1 max-w-[34rem] [overflow-wrap:anywhere]">{r.comment}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
      {canReview && <ReviewForm productId={product.id} slug={product.slug} />}
    </section>
  );
}
