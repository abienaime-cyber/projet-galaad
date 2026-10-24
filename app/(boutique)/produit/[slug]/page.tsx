import { Minus, Plus } from "@phosphor-icons/react/ssr";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { secondaryButton, textLink } from "@/components/field";
import { getProduct, getShopper } from "@/lib/catalog";
import { OPEN_GRAPH } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { CATEGORY_PATH, CONFIDENCE_LABEL, FIT_LABEL, fitAll, price, type CatalogProduct } from "@/lib/shop";
import { FIT_FEEDBACK } from "@/lib/validation";
import { AddToCart } from "./add-to-cart";
import { Advisor } from "./advisor";
import { ReviewForm } from "./review-form";

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Article introuvable" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { ...OPEN_GRAPH, images: product.image ? [{ url: product.image, width: 1000, height: 1250, alt: product.name }] : undefined },
  };
}

export default function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pt-6 sm:px-8 md:pt-8">
      <Suspense fallback={<div aria-busy className="mt-12 aspect-[4/5] max-h-[36rem] rounded-xl bg-muted lg:w-1/2" />}>
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
      <nav aria-label="Fil d’Ariane" className="text-[13px] text-muted-foreground">
        <Link href="/" className="inline-flex min-h-11 items-center hover:text-foreground hover:underline">Accueil</Link>
        <span aria-hidden className="mx-2">/</span>
        <Link href={CATEGORY_PATH[product.category]} className="inline-flex min-h-11 items-center hover:text-foreground hover:underline">
          {isSuit ? "Costumes" : "Chemises"}
        </Link>
        <span aria-hidden className="mx-2">/</span>
        <span aria-current="page" className="text-foreground">{product.name}</span>
      </nav>
      <div className="mt-2 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-14">
        <div className="card overflow-hidden bg-muted lg:sticky lg:top-24 lg:self-start">
          {product.image ? (
            <Image
              src={product.image}
              alt={`${product.name}, sur cintre`}
              width={1000}
              height={1250}
              priority
              sizes="(min-width: 1024px) 680px, 100vw"
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <div className="aspect-[4/5]" />
          )}
        </div>

        <div className="lg:max-w-[32rem] lg:pt-2">
          <h1 className="text-[36px] md:text-[46px]">{product.name}</h1>
          <p className="mt-2 text-muted-foreground">
            {product.color} · {product.material}
          </p>
          <p className="figures mt-4 text-[22px] font-semibold">{price(product.priceCents)}</p>

          <Suspense fallback={<div aria-busy className="mt-8 h-72 rounded-xl bg-muted" />}>
            <YourSize product={product} />
          </Suspense>

          <div className="card mt-10 px-5 sm:px-6">
            <Disclosure title="Description" open>
              <p className="text-pretty text-muted-foreground">{product.description}</p>
            </Disclosure>
            <Disclosure title="Coupe et matière">
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-10 gap-y-3">
                <dt className="text-muted-foreground">Coupe</dt>
                <dd>{FIT_LABEL[product.fit]}</dd>
                <dt className="text-muted-foreground">Matière</dt>
                <dd>{product.material}</dd>
                <dt className="text-muted-foreground">Couleur</dt>
                <dd>{product.color}</dd>
                {sizes.length > 0 && (
                  <>
                    <dt className="text-muted-foreground">Tailles</dt>
                    <dd className="tabular-nums">
                      {sizes[0]} à {sizes.at(-1)}
                    </dd>
                  </>
                )}
              </dl>
            </Disclosure>
          </div>

          <Suspense fallback={null}>
            <Reviews product={product} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

// Volet dépliable natif : clavier et lecteur d'écran sans script. Le « + » devient « − » à l'ouverture.
function Disclosure({ title, open, children }: { title: string; open?: boolean; children: React.ReactNode }) {
  return (
    <details open={open} className="group border-b border-border last:border-b-0">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
        {title}
        <Plus aria-hidden size={18} className="group-open:hidden" />
        <Minus aria-hidden size={18} className="hidden group-open:block" />
      </summary>
      <div className="pb-6 text-[15px]">{children}</div>
    </details>
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
      <section aria-labelledby="your-size" className="card mt-8 border-t-4 border-accent p-5 sm:p-6">
        <h2 id="your-size" className="eyebrow text-accent">
          Votre taille
        </h2>
        {rec?.size ? (
          <>
            <p className="mt-3 flex items-baseline gap-3">
              <span className={`figures text-[48px] leading-none font-bold text-foreground ${rec.estimated ? "estimated" : ""}`}>{rec.size}</span>
              {rec.alternative && <span className="text-muted-foreground">ou {rec.alternative}</span>}
            </p>
            <p className="mt-3 text-[14px] text-muted-foreground">
              Taille estimée, {CONFIDENCE_LABEL[rec.confidence]}.{" "}
              {inStock ? <span className="font-semibold text-success">En stock dans votre taille.</span> : "Épuisée dans votre taille pour le moment."}
            </p>
            <Link href="/compte/mensurations" className={`${textLink} mt-2`}>
              Modifier mes mensurations
            </Link>
          </>
        ) : rec ? (
          <p className="mt-2">
            Vos mensurations sortent du tableau de tailles de cet article.{" "}
            <Link href="/compte/mensurations" className="font-semibold underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground">
              Vérifier mes mensurations
            </Link>
          </p>
        ) : (
          <>
            <p className="mt-2 max-w-[30rem]">
              Donnez votre taille, votre poids et votre âge : nous calculons la taille à prendre pour cet article.
            </p>
            <Link href={signedIn ? "/compte/mensurations" : "/inscription"} className={`${secondaryButton} mt-5`}>
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
    <section aria-labelledby="reviews-title" className="mt-12">
      <h2 id="reviews-title" className="text-[30px]">
        Avis clients
      </h2>
      {list.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">Aucun avis pour le moment. Seuls les clients qui ont acheté l’article peuvent le noter.</p>
      ) : (
        <>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="figures text-[17px] font-semibold text-foreground">{average.toFixed(1).replace(".", ",")}</span> sur 5, {list.length} avis
          </p>
          <ul className="mt-5 grid gap-3">
            {list.map((r) => (
              <li key={r.id} className="card p-5 text-[14px]">
                <p>
                  <span className="font-semibold tabular-nums">{r.rating}/5</span>
                  {r.fit_feedback && <span className="text-muted-foreground"> · {FIT_FEEDBACK[r.fit_feedback as keyof typeof FIT_FEEDBACK]}</span>}
                  <span className="text-muted-foreground"> · {monthYear.format(new Date(r.created_at))}</span>
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
