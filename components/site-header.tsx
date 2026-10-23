import Link from "next/link";
import { Suspense } from "react";
import { getCurrentUser } from "@/lib/auth";

const navLink = "inline-flex h-11 items-center rounded-sm px-2 text-sm text-chalk/85 transition-colors duration-150 ease-[ease] hover:text-white focus-visible:outline-chalk";

export function SiteHeader() {
  return (
    <header className="bg-navy text-chalk">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="inline-flex h-11 items-center text-lg font-bold tracking-[0.18em] [font-stretch:115%] focus-visible:outline-chalk">
          GALAAD
        </Link>
        <nav aria-label="Compte" className="flex items-center gap-1">
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
