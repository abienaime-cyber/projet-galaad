import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { inkButton, textLink } from "@/components/field";
import { RevealGroup } from "@/components/gsap";
import { ProductTile } from "@/components/product-tile";
import { SegmentedNav } from "@/components/segmented-nav";
import { getProducts, getShopper } from "@/lib/catalog";
import { DRINK_LABEL, TASTE_LABEL, type TasteProfile } from "@/lib/reco";
import { bestOf, CATEGORIES, CONFIDENCE_LABEL, forMe, rateAll, type CatalogProduct, type Rated } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Boutique",
  description: "Kits, matcha et ustensiles pour préparer le matcha chez soi. Avec un profil de goût, la boutique classe les articles qui vous conviennent.",
};

type Search = Record<string, string | string[] | undefined>;

export default function ShopPage({ searchParams }: PageProps<"/boutique">) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-8 pb-24 sm:px-6 md:pt-12">
      <h1 className="display text-[64px] sm:text-[96px] lg:text-[128px]">La boutique</h1>
      <Suspense fallback={<div aria-busy className="mt-10 h-[36rem] bg-steel-2" />}>
        <Catalog searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ searchParams }: { searchParams: Promise<Search> }) {
  const [{ rayon, vue }, products, { signedIn, profile }] = await Promise.all([searchParams, getProducts(), getShopper()]);
  const category = CATEGORIES.find((c) => c.slug === rayon);
  const inAisle = category ? products.filter((p) => p.category === category.value) : products;
  const rated = rateAll(inAisle, profile);
  const mine = forMe(rated);
  const showAll = !profile || vue === "tout";
  const items = showAll ? rated : mine;

  const href = (next: { rayon?: string; vue?: string }) => {
    const query = new URLSearchParams(Object.entries({ rayon: category?.slug, vue: showAll && profile ? "tout" : undefined, ...next }).filter(([, v]) => v) as [string, string][]);
    return `/boutique${query.size ? `?${query}` : ""}`;
  };

  return (
    <>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-line py-4">
        <SegmentedNav
          label="Rayons"
          items={[
            { href: href({ rayon: "" }), label: "Tout", current: !category },
            ...CATEGORIES.map((c) => ({ href: href({ rayon: c.slug }), label: c.label, current: c === category })),
          ]}
        />
        {profile && (
          <SegmentedNav
            label="Sélection"
            items={[
              { href: href({ vue: "" }), label: `Pour moi (${mine.length})`, current: !showAll },
              { href: href({ vue: "tout" }), label: `Tout voir (${rated.length})`, current: showAll },
            ]}
          />
        )}
      </div>

      {profile ? <Verdict profile={profile} products={products} /> : <ProfilePrompt signedIn={signedIn} />}

      {items.length === 0 ? (
        <div className="mt-10 bg-paper/60 px-6 py-16 text-center">
          <h2 className="display text-[40px]">{inAisle.length === 0 ? "Rien en rayon pour le moment" : "Rien à vous conseiller ici"}</h2>
          {inAisle.length > 0 && (
            <p className="mt-3 text-fog">
              Vous avez sans doute déjà ces ustensiles, ou ce qui vous irait est épuisé.{" "}
              <Link href={href({ vue: "tout" })} className="text-ink underline underline-offset-4">
                Tout voir
              </Link>
            </p>
          )}
        </div>
      ) : category || !showAll ? (
        <Grid items={items} />
      ) : (
        CATEGORIES.map((c) => {
          const aisle = items.filter((i) => i.product.category === c.value);
          if (aisle.length === 0) return null;
          return (
            <section key={c.value} aria-labelledby={`rayon-${c.slug}`} className="mt-14">
              <div className="flex items-end justify-between gap-4 border-b border-ink pb-2">
                <h2 id={`rayon-${c.slug}`} className="display text-[44px] sm:text-[56px]">
                  {c.label}
                </h2>
                <Link href={href({ rayon: c.slug })} className="mono inline-flex min-h-11 items-center uppercase hover:text-matcha-ink">
                  Le rayon ({aisle.length})
                </Link>
              </div>
              <Grid items={aisle} />
            </section>
          );
        })
      )}
    </>
  );
}

function Grid({ items }: { items: Rated[] }) {
  return (
    <RevealGroup as="ul" className="mt-6 grid grid-cols-2 gap-px md:grid-cols-3 xl:grid-cols-4">
      {items.map((item, i) => (
        <ProductTile key={item.product.slug} item={item} priority={i < 4} />
      ))}
    </RevealGroup>
  );
}

// Le verdict du calcul, en tête : le kit et le matcha conseillés, et la confiance qu'on peut leur accorder.
function Verdict({ profile, products }: { profile: TasteProfile; products: CatalogProduct[] }) {
  const picks = (["kit", "matcha"] as const).map((c) => bestOf(products, c, profile)).filter((p) => p !== null);
  return (
    <section aria-labelledby="verdict" data-theme="dark" className="mt-6 grid gap-6 bg-ink p-5 text-paper sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div>
        <h2 id="verdict" className="mono text-matcha uppercase">
          Votre profil
        </h2>
        <p className="mt-2 text-[17px] text-paper/80">
          {profile.cupsPerWeek} tasse{profile.cupsPerWeek > 1 ? "s" : ""} par semaine, {DRINK_LABEL[profile.drink]}, goût {TASTE_LABEL[profile.taste]}.{" "}
          <Link href="/compte/profil" className="text-paper underline underline-offset-4">
            Modifier
          </Link>
        </p>
      </div>
      <ul className="flex flex-wrap gap-x-8 gap-y-3">
        {picks.map(({ best, confidence }) => (
          <li key={best.product.slug}>
            <Link href={`/produit/${best.product.slug}`} className="group block">
              <span className="display block text-[30px] leading-none group-hover:text-matcha">{best.product.name}</span>
              <span className="mono text-fog-dark">
                {best.match.score}/100 · {CONFIDENCE_LABEL[confidence]}
              </span>
              <span className="block text-[15px] text-paper/80">{best.match.reasons[0]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProfilePrompt({ signedIn }: { signedIn: boolean }) {
  return (
    <section aria-labelledby="profil-prompt" className="mt-6 grid gap-5 bg-matcha p-6 sm:p-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div>
        <h2 id="profil-prompt" className="display text-[40px] sm:text-[52px]">
          Le bon kit en six réponses
        </h2>
        <p className="mt-2 max-w-[44rem] text-[17px]">
          Combien de tasses, pur ou latte, doux ou intense, ce que vous avez déjà. Le calcul classe la boutique pour vous et donne le prix de votre tasse.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Link href={signedIn ? "/compte/profil" : "/inscription"} className={inkButton}>
          {signedIn ? "Faire mon profil" : "Créer un compte"}
        </Link>
        {!signedIn && (
          <Link href="/connexion?suite=/compte/profil" className={textLink}>
            J’ai un compte
          </Link>
        )}
      </div>
    </section>
  );
}
