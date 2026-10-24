import Link from "next/link";

const footLink = "inline-flex min-h-11 items-center hover:text-on-accent";

export function SiteFooter() {
  return (
    <footer className="bg-accent text-[13px] text-on-accent/70">
      <div className="mx-auto grid max-w-[1440px] gap-8 px-4 pt-14 pb-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-display text-[28px] tracking-[0.24em] text-on-accent uppercase">Carrure</p>
          <p className="mt-3 max-w-[30rem]">Carrure est un projet étudiant de démonstration. Aucune vente réelle.</p>
        </div>
        <nav aria-label="Informations légales" className="eyebrow flex flex-wrap gap-x-8">
          <Link href="/confidentialite" className={footLink}>
            Confidentialité
          </Link>
          <Link href="/cgu" className={footLink}>
            CGU et mentions légales
          </Link>
        </nav>
      </div>
    </footer>
  );
}
