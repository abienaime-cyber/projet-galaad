import { ShoppingBag, User } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, isAdmin } from "@/lib/commerce";

const navLink =
  "inline-flex h-11 items-center rounded-lg px-3 text-[15px] font-medium text-foreground transition-colors duration-200 hover:bg-muted";
const iconLink = "inline-flex size-11 items-center justify-center rounded-lg text-foreground transition-colors duration-200 hover:bg-muted";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md reduced-transparency:bg-background">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-2 px-4 sm:h-[72px] sm:gap-6 sm:px-8">
        <Link href="/" className="-ml-1 inline-flex h-11 items-center px-1 font-display text-[30px] leading-none font-semibold tracking-tight">
          Carrure
        </Link>
        <nav aria-label="Boutique" className="flex items-center max-sm:hidden">
          <Link href="/costumes" className={navLink}>
            Costumes
          </Link>
          <Link href="/chemises" className={navLink}>
            Chemises
          </Link>
        </nav>
        <nav aria-label="Compte" className="ml-auto flex items-center gap-1">
          <Suspense fallback={<GuestLinks />}>
            <AccountLinks />
          </Suspense>
        </nav>
      </div>
      {/* Sous 640 px, les rayons passent sur une seconde ligne : la barre du haut tient à 320 px. */}
      <nav aria-label="Rayons" className="flex h-11 items-center justify-center gap-2 border-t border-border sm:hidden">
        <Link href="/costumes" className={navLink}>
          Costumes
        </Link>
        <Link href="/chemises" className={navLink}>
          Chemises
        </Link>
      </nav>
    </header>
  );
}

function GuestLinks() {
  return (
    <>
      <Link href="/inscription" className={`${navLink} text-accent hover:text-accent-hover max-md:hidden`}>
        Trouver ma taille
      </Link>
      <Link href="/connexion" className={`${navLink} gap-2 max-sm:w-11 max-sm:justify-center max-sm:px-0`} aria-label="Se connecter">
        <User aria-hidden size={22} />
        <span className="max-sm:hidden">Se connecter</span>
      </Link>
    </>
  );
}

async function AccountLinks() {
  const user = await getCurrentUser();
  if (!user) return <GuestLinks />;
  const [count, admin] = await Promise.all([getCartCount(), isAdmin()]);
  return (
    <>
      {/* Sous 640 px, Admin passe dans l'espace Compte : la barre tient à 320 px. */}
      {admin && (
        <Link href="/admin" className={`${navLink} max-sm:hidden`}>
          Admin
        </Link>
      )}
      <Link href="/compte/mensurations" className={iconLink} aria-label="Compte">
        <User aria-hidden size={22} />
      </Link>
      <Link href="/panier" className={`${iconLink} relative`} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
        <ShoppingBag aria-hidden size={22} />
        {count > 0 && (
          <span className="absolute top-1 right-0.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-on-accent tabular-nums">
            {count}
          </span>
        )}
      </Link>
    </>
  );
}
