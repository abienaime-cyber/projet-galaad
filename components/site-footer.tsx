import Link from "next/link";
import { Logo } from "@/components/logo";
import { CATEGORIES } from "@/lib/shop";

const footLink = "inline-flex min-h-11 items-center text-paper/70 transition-colors duration-150 hover:text-matcha";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-[15px] text-paper/70" data-theme="dark">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 pt-16 pb-8 sm:grid-cols-3 sm:px-6">
        <nav aria-label="Boutique" className="flex flex-col">
          <p className="mono mb-2 text-paper uppercase">Boutique</p>
          {CATEGORIES.map((c) => (
            <Link key={c.value} href={`/boutique?rayon=${c.slug}`} className={footLink}>
              {c.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Compte" className="flex flex-col">
          <p className="mono mb-2 text-paper uppercase">Compte</p>
          <Link href="/compte/profil" className={footLink}>
            Profil de goût
          </Link>
          <Link href="/compte/commandes" className={footLink}>
            Commandes et retours
          </Link>
          <Link href="/panier" className={footLink}>
            Panier
          </Link>
        </nav>
        <nav aria-label="Informations légales" className="flex flex-col">
          <p className="mono mb-2 text-paper uppercase">Informations</p>
          <Link href="/confidentialite" className={footLink}>
            Confidentialité
          </Link>
          <Link href="/cgu" className={footLink}>
            CGU et mentions légales
          </Link>
        </nav>
      </div>
      {/* Le logo sur toute la largeur, comme une plaque. */}
      <div aria-hidden className="mx-auto max-w-[1440px] px-4 pb-6 text-paper sm:px-6">
        <Logo className="h-auto w-full" />
      </div>
      <div className="mono mx-auto flex max-w-[1440px] flex-wrap justify-between gap-x-8 gap-y-2 border-t border-line-dark px-4 py-6 text-[12px] text-fog-dark sm:px-6">
        <p>© 2026 USUCHA. Projet étudiant de démonstration : aucune vente réelle.</p>
        <p>Photos : Pexels, voir CREDITS.md. Elles montrent du matériel du commerce, pas nos produits.</p>
      </div>
    </footer>
  );
}
