import { Gauge, Ruler, ShieldCheck } from "@phosphor-icons/react/ssr";
import type { ReactNode } from "react";
import { SegmentedNav } from "@/components/segmented-nav";

const TABS = [
  { href: "/connexion", key: "connexion", label: "Se connecter" },
  { href: "/inscription", key: "inscription", label: "Créer un compte" },
] as const;

const POINTS = [
  {
    Icon: Ruler,
    title: "Trois chiffres suffisent",
    text: "Taille, poids et âge. Votre tour de poitrine et votre tour de taille affinent le calcul si vous les connaissez.",
  },
  {
    Icon: Gauge,
    title: "Une estimation, dite comme telle",
    text: "Chaque taille conseillée indique son niveau de confiance, et la taille voisine quand vous êtes entre deux.",
  },
  {
    Icon: ShieldCheck,
    title: "Vos données restent les vôtres",
    text: "Elles ne servent qu’au calcul de taille. Vous pouvez les effacer à tout moment.",
  },
];

export function AuthShell({ active, title, children }: { active: (typeof TABS)[number]["key"]; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1120px] gap-8 px-4 pt-10 sm:px-8 md:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-10">
      <section aria-labelledby="auth-title" className="card p-6 sm:p-10">
        <SegmentedNav
          label="Accès au compte"
          items={TABS.map((tab) => ({ href: tab.href, label: tab.label, current: tab.key === active }))}
        />
        <h1 id="auth-title" className="mt-8 text-[36px] md:text-[44px]">
          {title}
        </h1>
        {children}
      </section>

      <aside aria-labelledby="why-title" className="rounded-2xl bg-primary p-6 text-on-primary sm:p-10">
        <p className="eyebrow text-on-primary/70">Pourquoi un compte</p>
        <h2 id="why-title" className="mt-4 text-[32px] md:text-[38px]">
          Votre taille, article par article
        </h2>
        <p className="mt-4 text-on-primary/75">
          Votre compte garde vos mensurations. Carrure les compare au tableau de tailles de chaque chemise et de chaque
          costume, et vous indique la taille à commander.
        </p>
        <dl className="mt-10 grid gap-8">
          {POINTS.map(({ Icon, title, text }) => (
            <div key={title} className="flex gap-4">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-on-primary/10 text-on-primary">
                <Icon aria-hidden size={22} />
              </span>
              <div>
                <dt className="font-display text-[22px] font-semibold">{title}</dt>
                <dd className="mt-1 text-[15px] text-on-primary/75">{text}</dd>
              </div>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
