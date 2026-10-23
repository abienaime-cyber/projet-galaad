import Link from "next/link";
import type { ReactNode } from "react";

const TABS = [
  { href: "/connexion", key: "connexion", label: "Se connecter" },
  { href: "/inscription", key: "inscription", label: "Créer un compte" },
] as const;

export function AuthShell({ active, title, children }: { active: (typeof TABS)[number]["key"]; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] md:gap-16 md:py-16">
      <section aria-labelledby="auth-title">
        <nav aria-label="Accès au compte" className="flex border-b border-rule">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={tab.key === active ? "page" : undefined}
              className="-mb-px inline-flex min-h-11 items-end border-b-2 border-transparent px-1 pb-2.5 text-sm font-medium text-ink-2 transition-colors duration-150 ease-[ease] hover:text-ink aria-[current=page]:border-navy aria-[current=page]:text-ink [&+&]:ml-6"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <h1 id="auth-title" className="mt-8 text-2xl font-semibold">
          {title}
        </h1>
        {children}
      </section>

      <aside className="border-t border-rule pt-8 text-ink-2 md:border-t-0 md:border-l md:pt-0 md:pl-16">
        <h2 className="text-xl font-semibold text-ink">Votre taille, article par article</h2>
        <p className="mt-3 max-w-prose">
          Votre compte garde vos mensurations. Galaad les compare au tableau de tailles de chaque chemise et de chaque
          costume, et vous indique la taille à commander.
        </p>
        <dl className="mt-8 grid max-w-prose gap-5 text-sm">
          <div>
            <dt className="font-semibold text-ink">Trois chiffres suffisent</dt>
            <dd className="mt-1">Taille, poids et âge. Votre tour de poitrine et votre tour de taille affinent le calcul si vous les connaissez.</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Une estimation, dite comme telle</dt>
            <dd className="mt-1">Chaque taille conseillée indique son niveau de confiance, et la taille voisine quand vous êtes entre deux.</dd>
          </div>
          <div>
            <dt className="font-semibold text-ink">Vos données restent les vôtres</dt>
            <dd className="mt-1">Elles ne servent qu’au calcul de taille. Vous pouvez les effacer à tout moment.</dd>
          </div>
        </dl>
      </aside>
    </div>
  );
}
