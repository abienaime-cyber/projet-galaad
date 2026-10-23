import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, isAdmin } from "@/lib/commerce";

const navLink = "inline-flex h-11 items-center px-1.5 sm:px-2 text-xs text-label/80 transition-colors duration-150 ease-[ease] hover:text-label";

export function SiteHeader() {
  return (
    // Matière translucide, comme la barre d'apple.com : le contenu défile dessous au lieu de buter contre un bandeau.
    <header className="sticky top-0 z-30 bg-[rgb(250_250_252/0.8)] backdrop-blur-xl backdrop-saturate-[1.8] reduced-transparency:bg-[rgb(250_250_252)] reduced-transparency:backdrop-blur-none contrast-more:border-b contrast-more:border-separator contrast-more:bg-white">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-1 px-4 sm:gap-4 sm:px-[22px]">
        <Link href="/" className="inline-flex h-11 items-center text-xl font-semibold tracking-[-0.03em]">
          Carrure
        </Link>
        <nav aria-label="Boutique" className="flex items-center sm:gap-6">
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
      {/* Sous 640 px, Admin passe dans l'espace Compte et Compte devient une icône : la barre tient à 320 px. */}
      {admin && <Link href="/admin" className={`${navLink} max-sm:hidden`}>Admin</Link>}
      <Link href="/compte/mensurations" className={`${navLink} max-sm:w-11 max-sm:justify-center`} aria-label="Compte">
        <svg aria-hidden viewBox="0 0 24 24" className="size-[18px] sm:hidden" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" strokeLinecap="round" />
        </svg>
        <span className="max-sm:hidden">Compte</span>
      </Link>
      {/* Le sac d'apple.com : une icône tient sur mobile là où le mot « Panier » faisait déborder la barre. */}
      <Link href="/panier" className={`${navLink} relative w-11 justify-center`} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
          <path d="M5 8h14l-1 12H6L5 8Z" />
          <path d="M9 10V7a3 3 0 0 1 6 0v3" strokeLinecap="round" />
        </svg>
        {count > 0 && (
          <span className="absolute top-2 right-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-label px-1 text-[10px] font-semibold text-white tabular-nums">
            {count}
          </span>
        )}
      </Link>
    </>
  );
}
