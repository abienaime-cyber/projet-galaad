import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";

const navLink = "inline-flex h-11 items-center px-2 text-xs text-label/80 transition-colors duration-150 ease-[ease] hover:text-label";

export function SiteHeader() {
  return (
    // Matière translucide, comme la barre d'apple.com : le contenu défile dessous au lieu de buter contre un bandeau.
    <header className="sticky top-0 z-30 bg-[rgb(250_250_252/0.8)] backdrop-blur-xl backdrop-saturate-[1.8] reduced-transparency:bg-[rgb(250_250_252)] reduced-transparency:backdrop-blur-none contrast-more:border-b contrast-more:border-separator contrast-more:bg-white">
      <div className="mx-auto flex h-12 max-w-[980px] items-center justify-between gap-4 px-4 sm:px-[22px]">
        <Link href="/" className="inline-flex h-11 items-center text-xl font-semibold tracking-[-0.03em]">
          Galaad
        </Link>
        <nav aria-label="Boutique" className="flex items-center gap-2 sm:gap-6">
          <Link href="/costumes" className={navLink}>Costumes</Link>
          <Link href="/chemises" className={navLink}>Chemises</Link>
        </nav>
        <nav aria-label="Compte" className="flex items-center">
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
  return <Link href="/compte/mensurations" className={navLink}>Mon compte</Link>;
}
