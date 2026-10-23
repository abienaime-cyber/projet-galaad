import Link from "next/link";
import { Suspense } from "react";
import { primaryButton } from "@/components/field";
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
    <div className="mx-auto max-w-[980px] px-4 pt-10 pb-24 sm:px-[22px] md:pt-16">
      <h1 className="text-[40px] font-semibold md:text-[56px]">
        {title}. <span className="text-label-2">{tagline}</span>
      </h1>
      <Suspense fallback={<div aria-busy className="mt-12 h-[32rem] rounded-[28px] bg-tile" />}>
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
        <div className="mt-8 flex flex-wrap items-center justify-between gap-x-8 gap-y-5 border-b border-separator pb-8">
          <p className="text-[17px] text-label-2">
            {reference?.size ? (
              <>
                Votre taille estimée :{" "}
                <span className={`figures text-[21px] text-label ${reference.estimated ? "estimated" : ""}`}>{reference.size}</span>
                {reference.alternative && <> ou {reference.alternative}</>}, {CONFIDENCE_LABEL[reference.confidence]}.{" "}
              </>
            ) : (
              <>Vos mensurations sortent de notre tableau de tailles. </>
            )}
            <Link href="/compte/mensurations" className="inline-flex min-h-11 items-center text-link hover:underline">
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
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {items.map((item, i) => (
            <ProductTile key={item.product.slug} item={item} priority={i < 6} />
          ))}
        </ul>
      ) : (
        <div className="mt-10 rounded-[28px] bg-tile px-6 py-12 text-center sm:px-12">
          <h2 className="text-[28px] font-semibold">
            {products.length === 0 ? `Aucun ${noun.one} en ligne pour le moment.` : `Aucun ${noun.one} disponible dans votre taille en ce moment.`}
          </h2>
          {products.length > 0 && (
            <p className="mt-3 text-label-2">
              Les tailles épuisées reviennent au fil des réassorts.{" "}
              <Link href={`${path}?vue=tout`} className="text-link hover:underline">
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
    <section aria-labelledby="size-prompt" className="mt-10 rounded-[28px] bg-tile px-6 py-10 sm:px-12 sm:py-12">
      <h2 id="size-prompt" className="max-w-[24ch] text-[28px] font-semibold">
        Votre taille sur chaque {noun.one}.
      </h2>
      <p className="mt-3 max-w-[40rem] text-label-2">
        Donnez votre taille, votre poids et votre âge. Nous calculons votre taille pour chaque article et n’affichons que
        les {noun.many} disponibles pour vous.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Link href={signedIn ? "/compte/mensurations" : "/inscription"} className={primaryButton}>
          {signedIn ? "Saisir mes mensurations" : "Créer un compte"}
        </Link>
        {!signedIn && (
          <Link href="/connexion" className="inline-flex min-h-11 items-center text-link hover:underline">
            J’ai déjà un compte
          </Link>
        )}
      </div>
    </section>
  );
}
