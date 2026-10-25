import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { textLink } from "@/components/field";
import { Tag } from "@/components/tag";
import { getProduct, getProducts, getShopper } from "@/lib/catalog";
import { GRADE_LABEL, match, suggestFormat, TOOL_LABEL } from "@/lib/reco";
import { OPEN_GRAPH } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { categoryOf, price, variantFigures, type CatalogProduct } from "@/lib/shop";
import { Advisor } from "./advisor";
import { ProductHero } from "./product-hero";
import { ReviewForm } from "./review-form";

export async function generateMetadata({ params }: PageProps<"/produit/[slug]">): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  if (!product) return { title: "Article introuvable" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { ...OPEN_GRAPH, images: product.image ? [{ url: product.image, width: 1200, height: 1200, alt: `${product.name}, rendu 3D` }] : undefined },
  };
}

export default function ProductPage({ params }: PageProps<"/produit/[slug]">) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-6 pb-24 sm:px-6 md:pt-8">
      <Suspense fallback={<div aria-busy className="mt-12 aspect-square max-h-[40rem] bg-steel-2 lg:w-1/2" />}>
        {params.then(({ slug }) => (
          <ProductView slug={slug} />
        ))}
      </Suspense>
    </div>
  );
}

function kickerOf(product: CatalogProduct) {
  if (product.grade) return `Matcha · grade ${GRADE_LABEL[product.grade]}`;
  if (product.toolKind) return `Ustensile · ${TOOL_LABEL[product.toolKind]}`;
  return `Kit · ${product.contents.length} pièces`;
}

async function ProductView({ slug }: { slug: string }) {
  const [product, products, { signedIn, profile }] = await Promise.all([getProduct(slug), getProducts(), getShopper()]);
  if (!product) notFound();
  const aisle = categoryOf(product.category);
  const m = profile ? match(product, profile) : null;
  const suggested = profile && product.category === "matcha" ? suggestFormat(product.variants, profile) : null;
  const figures = Object.fromEntries(product.variants.map((v) => [v.id, variantFigures(product, v, profile)]));

  return (
    <>
      <nav aria-label="Fil d’Ariane" className="mono mb-4 text-fog uppercase">
        <Link href="/boutique" className="inline-flex min-h-11 items-center hover:text-ink">
          Boutique
        </Link>
        <span aria-hidden className="mx-2">/</span>
        <Link href={`/boutique?rayon=${aisle.slug}`} className="inline-flex min-h-11 items-center hover:text-ink">
          {aisle.label}
        </Link>
      </nav>

      <ProductHero
        slug={product.slug}
        name={product.name}
        model={product.model}
        image={product.image}
        kicker={kickerOf(product)}
        choiceLabel={product.category === "matcha" ? "Format" : "Coloris"}
        variants={product.variants}
        defaultVariantId={suggested?.id ?? null}
        figures={figures}
      >
        <p className="mt-5 max-w-[36rem] text-[18px] text-pretty">{product.description}</p>
        <section aria-labelledby="pour-vous" className="mt-8 bg-ink p-5 text-paper sm:p-6" data-theme="dark">
          <h2 id="pour-vous" className="mono text-matcha uppercase">
            Pour vous
          </h2>
          {m ? (
            <>
              <p className="mt-2 flex items-baseline gap-3">
                <span className="display text-[64px] leading-none">{m.score}</span>
                <span className="mono text-fog-dark">/ 100 selon votre profil de goût</span>
              </p>
              <ul className="mt-4 grid gap-2 text-[16px] text-paper/85">
                {m.reasons.map((r) => (
                  <li key={r} className="flex gap-3">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 bg-matcha" />
                    {r}
                  </li>
                ))}
              </ul>
              {suggested && product.variants[0].stock > 0 && suggested.id !== product.variants[0].id && (
                <p className="mono mt-4 text-fog-dark">Format présélectionné : {suggested.label}, la petite boîte ne tiendrait pas trois semaines.</p>
              )}
              <Link href="/compte/profil" className={`${textLink} mt-2 text-paper`}>
                Modifier mon profil
              </Link>
            </>
          ) : (
            <p className="mt-2 text-paper/80">
              Faites votre profil de goût : le calcul dira si cet article vous va, combien de temps dure une boîte à votre rythme et ce que coûte votre tasse.{" "}
              <Link href={signedIn ? "/compte/profil" : "/inscription"} className="text-matcha underline underline-offset-4">
                {signedIn ? "Faire mon profil" : "Créer un compte"}
              </Link>
            </p>
          )}
        </section>
      </ProductHero>

      <div className="mt-20 grid gap-16 lg:grid-cols-2">
        {product.category === "kit" && <KitContents product={product} />}
        {product.category === "matcha" && <Preparation product={product} />}
        {product.category === "tool" && <InKits product={product} products={products} />}
        <Details product={product} />
      </div>

      {m && (
        <div className="mt-16">
          <Advisor slug={product.slug} />
        </div>
      )}

      <Suspense fallback={null}>
        <Reviews product={product} />
      </Suspense>
    </>
  );
}

function KitContents({ product }: { product: CatalogProduct }) {
  const kitPrice = product.variants[0].priceCents;
  return (
    <section aria-labelledby="contenu-kit">
      <h2 id="contenu-kit" className="display border-b border-ink pb-2 text-[44px]">
        Pièces du kit
      </h2>
      <ol className="mt-4 grid gap-2">
        {product.contents.map((item, i) => (
          <li key={item.slug}>
            <Link href={`/produit/${item.slug}`} className="group flex items-center justify-between gap-4 py-1">
              <Tag index={String(i + 1).padStart(2, "0")}>{item.name}</Tag>
              <span className="mono text-fog group-hover:text-ink">{price(item.priceCents)}</span>
            </Link>
          </li>
        ))}
      </ol>
      {product.separatePriceCents && product.separatePriceCents > kitPrice && (
        <p className="mono mt-6 border-t border-line pt-4">
          Achetées une à une : {price(product.separatePriceCents)}. Dans le kit : {price(kitPrice)}, soit {price(product.separatePriceCents - kitPrice)} de moins.
        </p>
      )}
    </section>
  );
}

const STEPS = [
  { title: "Tamiser", text: "2 g de matcha, environ une cuillère et demie bombée, à travers le tamis dans le bol." },
  { title: "Verser", text: "60 ml d’eau à 80 °C. Pour un latte : 3 g de matcha et 100 ml d’eau." },
  { title: "Fouetter", text: "15 secondes, vite, en dessinant des M, jusqu’à une mousse fine. Pour un latte, ajoutez 100 ml de lait chaud." },
];

function Preparation({ product }: { product: CatalogProduct }) {
  return (
    <section aria-labelledby="preparation">
      <h2 id="preparation" className="display border-b border-ink pb-2 text-[44px]">
        Préparation
      </h2>
      <ol className="mt-2">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2 border-b border-line py-4">
            <span className="mono text-fog">{String(i + 1).padStart(2, "0")}</span>
            <p>
              <span className="display mr-2 text-[24px]">{s.title}</span>
              {s.text}
            </p>
          </li>
        ))}
      </ol>
      <p className="mono mt-4 text-fog">
        Doses et température :{" "}
        <a href="https://ippodotea.com/blogs/recipes-to-brew-japanese-tea/matcha-latte-recipe" className="underline underline-offset-4 hover:text-ink">
          méthode Ippodo
        </a>
        , maison de thé de Kyoto. Intensité de ce matcha : {product.intensity}/5.
      </p>
    </section>
  );
}

// Un ustensile : les kits qui le contiennent déjà.
function InKits({ product, products }: { product: CatalogProduct; products: CatalogProduct[] }) {
  const kits = products.filter((p) => p.contents.some((c) => c.slug === product.slug));
  if (kits.length === 0) return null;
  return (
    <section aria-labelledby="dans-les-kits">
      <h2 id="dans-les-kits" className="display border-b border-ink pb-2 text-[44px]">
        Aussi dans
      </h2>
      <ul className="mt-2">
        {kits.map((k) => (
          <li key={k.slug} className="border-b border-line">
            <Link href={`/produit/${k.slug}`} className="group flex min-h-14 items-center justify-between gap-4">
              <span className="display text-[26px] group-hover:text-matcha-ink">{k.name}</span>
              <span className="mono text-fog">{price(k.variants[0].priceCents)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Details({ product }: { product: CatalogProduct }) {
  const rows: [string, string][] = [["Matière", product.material]];
  if (product.grade) rows.push(["Grade", GRADE_LABEL[product.grade]], ["Intensité", `${product.intensity} sur 5, de doux à corsé`]);
  if (product.variants.length > 1) rows.push(["Formats", product.variants.map((v) => v.label).join(", ")]);
  rows.push(["Visuel", "Modèle 3D, pas une photo de l’article"]);
  return (
    <section aria-labelledby="details">
      <h2 id="details" className="display border-b border-ink pb-2 text-[44px]">
        Fiche
      </h2>
      <dl>
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-6 border-b border-line py-3">
            <dt className="text-fog">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const monthYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" });

async function Reviews({ product }: { product: CatalogProduct }) {
  const supabase = await createClient();
  const [{ data: reviews }, { data: purchased }, { data: auth }] = await Promise.all([
    supabase.from("reviews").select("id, user_id, rating, comment, created_at").eq("product_id", product.id).order("created_at", { ascending: false }),
    supabase.rpc("has_purchased", { p_product_id: product.id }),
    supabase.auth.getUser(),
  ]);
  const list = reviews ?? [];
  const canReview = purchased === true && !list.some((r) => r.user_id === auth.user?.id);
  const average = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;

  return (
    <section aria-labelledby="reviews-title" className="mt-20">
      <h2 id="reviews-title" className="display border-b border-ink pb-2 text-[44px]">
        Avis clients
      </h2>
      {list.length === 0 ? (
        <p className="mt-4 text-fog">Aucun avis pour le moment. Seuls les clients qui ont acheté l’article peuvent le noter.</p>
      ) : (
        <>
          <p className="mono mt-4">
            {average.toFixed(1).replace(".", ",")} sur 5 · {list.length} avis
          </p>
          <ul className="mt-4 grid gap-px md:grid-cols-2">
            {list.map((r) => (
              <li key={r.id} className="bg-paper/60 p-5 text-[16px]">
                <p className="mono text-fog">
                  {r.rating}/5 · {monthYear.format(new Date(r.created_at))}
                </p>
                {r.comment && <p className="mt-2 max-w-[40rem] [overflow-wrap:anywhere]">{r.comment}</p>}
              </li>
            ))}
          </ul>
        </>
      )}
      {canReview && <ReviewForm productId={product.id} slug={product.slug} />}
    </section>
  );
}
