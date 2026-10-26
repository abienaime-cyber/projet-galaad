import { ShoppingBagOpen, User } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, isAdmin } from "@/lib/commerce";

const navLink = "mono inline-flex h-11 items-center px-2.5 text-[13px] uppercase text-paper/80 transition-colors duration-150 hover:text-matcha";
const iconLink = "inline-flex size-11 items-center justify-center text-paper transition-colors duration-150 hover:text-matcha";

// Une seule barre noire : le logo, trois liens (Accueil, Boutique, Panier) et le compte derrière une icône.
// Sous 640 px, Accueil passe sur le logo et le panier devient une icône : la barre tient à 320 px.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-paper" data-theme="dark">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-matcha focus:px-4 focus:py-2 focus:text-ink">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-2 px-4 sm:px-6">
        <Link href="/" aria-label="USUCHA, accueil" className="-ml-1 inline-flex h-11 items-center px-1">
          <Logo className="h-[26px] w-auto" />
        </Link>
        <nav aria-label="Principal" className="ml-auto flex items-center sm:ml-8">
          <Link href="/" className={`${navLink} max-sm:hidden`}>
            Accueil
          </Link>
          <Link href="/boutique" className={navLink}>
            Boutique
          </Link>
        </nav>
        <nav aria-label="Compte et panier" className="flex items-center gap-0.5 sm:ml-auto">
          <Suspense fallback={<AccountLinks count={0} admin={false} signedIn={false} />}>
            <Account />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

async function Account() {
  const user = await getCurrentUser();
  const [count, admin] = user ? await Promise.all([getCartCount(), isAdmin()]) : [0, false];
  return <AccountLinks count={count} admin={admin} signedIn={Boolean(user)} />;
}

function AccountLinks({ count, admin, signedIn }: { count: number; admin: boolean; signedIn: boolean }) {
  return (
    <>
      {admin && (
        <Link href="/admin" className={`${navLink} max-sm:hidden`}>
          Admin
        </Link>
      )}
      <Link href={signedIn ? "/compte/profil" : "/connexion"} className={iconLink} aria-label={signedIn ? "Mon compte" : "Se connecter"}>
        <User aria-hidden size={21} />
      </Link>
      <Link href="/panier" className={`${navLink} relative gap-2 max-sm:w-11 max-sm:justify-center max-sm:px-0`} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
        <ShoppingBagOpen aria-hidden size={21} className="sm:hidden" />
        <span className="max-sm:hidden">Panier</span>
        {count > 0 && (
          <span className="figures inline-flex h-[17px] min-w-[17px] items-center justify-center bg-matcha px-1 text-[11px] text-ink max-sm:absolute max-sm:top-1.5 max-sm:right-0.5">
            {count}
          </span>
        )}
      </Link>
    </>
  );
}
