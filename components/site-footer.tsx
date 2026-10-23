import Link from "next/link";

const footLink = "inline-flex min-h-11 items-center hover:underline";

export function SiteFooter() {
  return (
    <footer className="bg-tile text-xs text-label-2">
      <div className="mx-auto flex max-w-[980px] flex-col gap-1 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-[22px]">
        <p>Carrure est un projet étudiant de démonstration. Aucune vente réelle.</p>
        <nav aria-label="Informations légales" className="flex gap-5">
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
