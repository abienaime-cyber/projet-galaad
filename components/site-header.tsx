import { ShoppingBagOpen, User } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";
import { getCartCount, isAdmin } from "@/lib/commerce";
import { CATEGORIES } from "@/lib/shop";

const navLink = "mono inline-flex h-11 items-center px-2.5 text-[13px] uppercase text-paper/80 transition-colors duration-150 hover:text-matcha";
const iconLink = "inline-flex size-11 items-center justify-center text-paper transition-colors duration-150 hover:text-matcha";

// Barre noire fine, toujours visible : la marque, les trois rayons, le compte et le panier.
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-ink text-paper" data-theme="dark">
      <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-matcha focus:px-4 focus:py-2 focus:text-ink">
        Aller au contenu
      </a>
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="display -ml-1 inline-flex h-11 items-center px-1 text-[27px] tracking-[0.01em]">
          Contrebande
        </Link>
        <nav aria-label="Rayons" className="ml-4 flex items-center max-md:hidden">
          {CATEGORIES.map((c) => (
            <Link key={c.value} href={`/boutique?rayon=${c.slug}`} className={navLink}>
              {c.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Compte" className="ml-auto flex items-center gap-0.5">
          <Suspense fallback={<GuestLinks />}>
            <AccountLinks />
          </Suspense>
        </nav>
      </div>
      {/* Sous 768 px, les rayons passent sur une seconde ligne : la barre du haut tient à 320 px. */}
      <nav aria-label="Rayons" className="flex h-10 items-center justify-center gap-1 border-t border-line-dark md:hidden">
        {CATEGORIES.map((c) => (
          <Link key={c.value} href={`/boutique?rayon=${c.slug}`} className={`${navLink} h-10`}>
            {c.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

function GuestLinks() {
  return (
    <>
      <Link href="/inscription" className={`${navLink} text-matcha max-lg:hidden`}>
        Profil de goût
      </Link>
      <Link href="/connexion" className={`${navLink} gap-2 max-sm:w-11 max-sm:justify-center max-sm:px-0`} aria-label="Se connecter">
        <User aria-hidden size={20} />
        <span className="max-sm:hidden">Connexion</span>
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
      <Link href="/compte/profil" className={iconLink} aria-label="Compte et profil de goût">
        <User aria-hidden size={21} />
      </Link>
      <Link href="/panier" className={`${iconLink} relative`} aria-label={`Panier, ${count} article${count > 1 ? "s" : ""}`}>
        <ShoppingBagOpen aria-hidden size={21} />
        {count > 0 && (
          <span className="figures absolute top-1.5 right-0.5 inline-flex h-[17px] min-w-[17px] items-center justify-center bg-matcha px-1 text-[11px] text-ink">
            {count}
          </span>
        )}
      </Link>
    </>
  );
}
