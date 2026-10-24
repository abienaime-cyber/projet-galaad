import Link from "next/link";

const footLink = "inline-flex min-h-11 items-center text-on-primary/75 transition-colors duration-200 hover:text-on-primary";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-[14px] text-on-primary/75 md:mt-32">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 pt-16 pb-10 sm:px-8 md:grid-cols-[1fr_auto_auto] md:gap-16">
        <div>
          <p className="font-display text-[32px] leading-none font-semibold text-on-primary">Carrure</p>
          <p className="mt-4 max-w-[28rem]">Chemises et costumes pour homme, avec votre taille calculée pour chaque article.</p>
        </div>
        <nav aria-label="Boutique" className="flex flex-col">
          <p className="eyebrow mb-2 text-on-primary">Boutique</p>
          <Link href="/costumes" className={footLink}>
            Costumes
          </Link>
          <Link href="/chemises" className={footLink}>
            Chemises
          </Link>
          <Link href="/inscription" className={footLink}>
            Trouver ma taille
          </Link>
        </nav>
        <nav aria-label="Informations légales" className="flex flex-col">
          <p className="eyebrow mb-2 text-on-primary">Informations</p>
          <Link href="/confidentialite" className={footLink}>
            Confidentialité
          </Link>
          <Link href="/cgu" className={footLink}>
            CGU et mentions légales
          </Link>
        </nav>
      </div>
      <p className="mx-auto max-w-[1280px] border-t border-on-primary/15 px-4 py-6 text-[13px] sm:px-8">
        Carrure est un projet étudiant de démonstration. Aucune vente réelle.
      </p>
    </footer>
  );
}
