import Link from "next/link";
import { Suspense } from "react";
import { primaryButton, textLink } from "@/components/field";
import { ProductTile } from "@/components/product-tile";
import { SegmentedNav } from "@/components/segmented-nav";
import { getProducts, getShopper } from "@/lib/catalog";
import { CATEGORY_PATH, CONFIDENCE_LABEL, fitAll, forMe } from "@/lib/shop";
import { recommendSize, type Category } from "@/lib/sizing";

const NOUN: Record<Category, { one: string; many: string }> = {
  suit: { one: "costume", many: "costumes" },
  shirt: { one: "chemise", many: "chemises" },
};

type Props = { category: Category; title: string; tagline: string; searchParams: Promise<Record<string, string | string[] | undefined>> };

export function CatalogPage({ category, title, tagline, searchParams }: Props) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pt-14 pb-28 sm:px-8 md:pt-20">
      <header className="text-center">
        <h1 className="text-[56px] md:text-[88px]">{title}</h1>
        <p className="mt-3 text-[17px] text-label-2">{tagline}.</p>
      </header>
      <Suspense fallback={<div aria-busy className="mt-12 h-[32rem] bg-tile" />}>
        <Catalog category={category} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Catalog({ category, searchParams }: Pick<Props, "category" | "searchParams">) {
  const [{ vue }, products, shopper] = await Promise.all([searchParams, getProducts(category), getShopper()]);
  const m = shopper.measurements;
  const noun = NOUN[category];
  const path = CATEGORY_PATH[category];
  const fitted = fitAll(products, m);
  const mine = m ? forMe(fitted, m.preferredFit) : [];
  const showAll = !m || vue === "tout";
  const items = showAll ? fitted : mine;
  // Tous les articles d'une catégorie partagent le même tableau : la taille de référence se lit sur une coupe classique.
  const reference = m && products.length > 0 ? recommendSize(m, { category, fit: "regular", sizes: products[0].sizes }) : null;

  return (
    <>
      {m ? (
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-separator py-3">
          <p className="text-sm text-label-2">
            {reference?.size ? (
              <>
                Votre taille estimée :{" "}
                <span className={`figures text-[22px] text-brass ${reference.estimated ? "estimated" : ""}`}>{reference.size}</span>
                {reference.alternative && <> ou {reference.alternative}</>}, {CONFIDENCE_LABEL[reference.confidence]}.{" "}
              </>
            ) : (
              <>Vos mensurations sortent de notre tableau de tailles. </>
            )}
            <Link href="/compte/mensurations" className="inline-flex min-h-11 items-center text-label underline decoration-brass/60 hover:decoration-brass">
              Modifier mes mensurations
            </Link>
          </p>
          <SegmentedNav
            label={`Choix des ${noun.many}`}
            items={[
              { href: path, label: `Pour moi (${mine.length})`, current: !showAll },
              { href: `${path}?vue=tout`, label: `Tout voir (${fitted.length})`, current: showAll },
            ]}
          />
        </div>
      ) : (
        <SizePrompt signedIn={shopper.signedIn} noun={noun} />
      )}

      {items.length > 0 ? (
        <ul className="mt-10 grid grid-cols-2 gap-x-3 gap-y-12 sm:gap-x-6 sm:gap-y-16 lg:grid-cols-3">
          {items.map((item, i) => (
            <ProductTile key={item.product.slug} item={item} priority={i < 6} />
          ))}
        </ul>
      ) : (
        <div className="mt-10 border border-separator px-6 py-16 text-center sm:px-12">
          <h2 className="text-[32px]">
            {products.length === 0 ? `Aucun ${noun.one} en ligne pour le moment.` : `Aucun ${noun.one} disponible dans votre taille en ce moment.`}
          </h2>
          {products.length > 0 && (
            <p className="mt-3 text-label-2">
              Les tailles épuisées reviennent au fil des réassorts.{" "}
              <Link href={`${path}?vue=tout`} className="text-label underline decoration-brass/60 hover:decoration-brass">
                Voir tous les {noun.many}
              </Link>
            </p>
          )}
        </div>
      )}
    </>
  );
}

function SizePrompt({ signedIn, noun }: { signedIn: boolean; noun: (typeof NOUN)[Category] }) {
  return (
    <section aria-labelledby="size-prompt" className="mx-auto mt-12 flex max-w-[52rem] flex-col items-center border-y border-separator px-6 py-12 text-center sm:py-14">
      <h2 id="size-prompt" className="max-w-[24ch] text-[32px] md:text-[40px]">
        Votre taille sur chaque {noun.one}.
      </h2>
      <p className="mt-4 max-w-[40rem] text-label-2">
        Donnez votre taille, votre poids et votre âge. Nous calculons votre taille pour chaque article et n’affichons que
        les {noun.many} disponibles pour vous.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <Link href={signedIn ? "/compte/mensurations" : "/inscription"} className={primaryButton}>
          {signedIn ? "Saisir mes mensurations" : "Créer un compte"}
        </Link>
        {!signedIn && (
          <Link href="/connexion" className={textLink}>
            J’ai déjà un compte
          </Link>
        )}
      </div>
    </section>
  );
}
