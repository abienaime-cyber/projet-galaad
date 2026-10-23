import Link from "next/link";
import type { ReactNode } from "react";

const TABS = [
  { href: "/connexion", key: "connexion", label: "Se connecter" },
  { href: "/inscription", key: "inscription", label: "Créer un compte" },
] as const;

const POINTS = [
  {
    title: "Trois chiffres suffisent",
    text: "Taille, poids et âge. Votre tour de poitrine et votre tour de taille affinent le calcul si vous les connaissez.",
  },
  {
    title: "Une estimation, dite comme telle",
    text: "Chaque taille conseillée indique son niveau de confiance, et la taille voisine quand vous êtes entre deux.",
  },
  {
    title: "Vos données restent les vôtres",
    text: "Elles ne servent qu’au calcul de taille. Vous pouvez les effacer à tout moment.",
  },
];

export function AuthShell({ active, title, children }: { active: (typeof TABS)[number]["key"]; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-10 pb-16 sm:px-[22px] md:pt-16">
      <section aria-labelledby="auth-title" className="mx-auto max-w-[460px]">
        {/* Contrôle segmenté iOS : deux pages sœurs, un seul geste pour passer de l'une à l'autre. */}
        <nav aria-label="Accès au compte" className="mx-auto grid w-fit grid-cols-2 rounded-[10px] bg-fill p-[3px]">
          {TABS.map((tab) => (
            <Link
              key={tab.key}
              href={tab.href}
              aria-current={tab.key === active ? "page" : undefined}
              className="inline-flex min-h-9 items-center justify-center rounded-[8px] px-5 text-sm text-label-2 transition-colors duration-150 ease-[ease] hover:text-label aria-[current=page]:bg-white aria-[current=page]:font-medium aria-[current=page]:text-label aria-[current=page]:shadow-[0_3px_8px_rgb(0_0_0/0.12),0_1px_1px_rgb(0_0_0/0.04)]"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <h1 id="auth-title" className="mt-10 text-center text-[40px] font-semibold">
          {title}
        </h1>
        {children}
      </section>

      <aside aria-labelledby="why-title" className="mt-16 rounded-[28px] bg-tile px-6 py-10 sm:px-12 sm:py-12">
        <h2 id="why-title" className="text-center text-[28px] font-semibold">
          Votre taille, article par article
        </h2>
        <p className="mx-auto mt-3 max-w-[38rem] text-center text-label-2">
          Votre compte garde vos mensurations. Galaad les compare au tableau de tailles de chaque chemise et de chaque
          costume, et vous indique la taille à commander.
        </p>
        <dl className="mt-10 grid gap-8 text-sm sm:grid-cols-3 sm:gap-10">
          {POINTS.map((point) => (
            <div key={point.title}>
              <dt className="text-[17px] font-semibold">{point.title}</dt>
              <dd className="mt-1.5 text-label-2">{point.text}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
