import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, isAdmin } from "@/lib/commerce";

const navLink = "inline-flex h-11 items-center px-2 text-xs text-label/80 transition-colors duration-150 ease-[ease] hover:text-label";

export function SiteHeader() {
  return (
    // Matière translucide, comme la barre d'apple.com : le contenu défile dessous au lieu de buter contre un bandeau.
    <header className="sticky top-0 z-30 bg-[rgb(250_250_252/0.8)] backdrop-blur-xl backdrop-saturate-[1.8] reduced-transparency:bg-[rgb(250_250_252)] reduced-transparency:backdrop-blur-none contrast-more:border-b contrast-more:border-separator contrast-more:bg-white">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-4 px-4 sm:px-[22px]">
        <Link href="/" className="inline-flex h-11 items-center text-xl font-semibold tracking-[-0.03em]">
          Carrure
        </Link>
        <nav aria-label="Boutique" className="flex items-center gap-2 sm:gap-6">
          <Link href="/costumes" className={navLink}>Costumes</Link>
          <Link href="/chemises" className={navLink}>Chemises</Link>
        </nav>
        <nav aria-label="Compte" className="flex items-center gap-1 sm:gap-4">
          <Suspense fallback={<Link href="/compte/mensurations" className={navLink}>Mon compte</Link>}>
            <AccountLinks />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

async function AccountLinks() {
  const user = await getCurrentUser();
  if (!user) {
    return <Link href="/connexion" className={navLink}>Se connecter</Link>;
  }
  const [count, admin] = await Promise.all([getCartCount(), isAdmin()]);
  return (
    <>
      {admin && <Link href="/admin" className={navLink}>Admin</Link>}
      <Link href="/compte/mensurations" className={navLink}>Compte</Link>
      <Link href="/panier" className={navLink} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
        Panier
        {count > 0 && (
          <span className="ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-label px-1 text-[11px] font-semibold text-white tabular-nums">
            {count}
          </span>
        )}
      </Link>
    </>
  );
}
