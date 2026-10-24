import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, isAdmin } from "@/lib/commerce";

const navLink = "eyebrow inline-flex h-11 items-center px-1.5 text-label transition-colors duration-150 ease-[ease] hover:text-label-2 sm:px-2";

export function SiteHeader() {
  return (
    <>
      <p className="bg-accent px-4 py-2 text-center text-xs text-on-accent">
        Votre taille calculée sur chaque costume et chaque chemise
      </p>
      <header className="sticky top-0 z-30 border-b border-separator bg-canvas/95 backdrop-blur-md reduced-transparency:bg-canvas">
        <div className="mx-auto grid h-16 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 sm:h-[72px] sm:px-8">
          <div>
            <Link href="/compte/mensurations" className={`${navLink} max-md:hidden`}>
              Trouver ma taille
            </Link>
          </div>
          <Link href="/" className="inline-flex h-11 items-center font-display text-[24px] tracking-[0.24em] uppercase sm:text-[30px]">
            Carrure
          </Link>
          <nav aria-label="Compte" className="flex items-center justify-end sm:gap-3">
            <Suspense fallback={<Link href="/compte/mensurations" className={navLink}>Compte</Link>}>
              <AccountLinks />
            </Suspense>
          </nav>
        </div>
        <nav aria-label="Boutique" className="flex h-11 items-center justify-center gap-6 sm:gap-10">
          <Link href="/costumes" className={navLink}>Costumes</Link>
          <Link href="/chemises" className={navLink}>Chemises</Link>
        </nav>
      </header>
    </>
  );
}

async function AccountLinks() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <Link href="/connexion" className={`${navLink} gap-2 max-sm:w-11 max-sm:justify-center`} aria-label="Se connecter">
        <UserIcon />
        <span className="max-sm:hidden">Se connecter</span>
      </Link>
    );
  }
  const [count, admin] = await Promise.all([getCartCount(), isAdmin()]);
  return (
    <>
      {/* Sous 640 px, Admin passe dans l'espace Compte et Compte devient une icône : la barre tient à 320 px. */}
      {admin && <Link href="/admin" className={`${navLink} max-sm:hidden`}>Admin</Link>}
      <Link href="/compte/mensurations" className={`${navLink} gap-2 max-sm:w-11 max-sm:justify-center`} aria-label="Compte">
        <UserIcon />
        <span className="max-lg:hidden">Compte</span>
      </Link>
      <Link href="/panier" className={`${navLink} relative w-11 justify-center`} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
        <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round">
          <path d="M5 8h14l-1 12H6L5 8Z" />
          <path d="M9 10V7a3 3 0 0 1 6 0v3" strokeLinecap="round" />
        </svg>
        {count > 0 && (
          <span className="absolute top-1 right-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold tracking-normal text-on-accent tabular-nums">
            {count}
          </span>
        )}
      </Link>
    </>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.3}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" strokeLinecap="round" />
    </svg>
  );
}
