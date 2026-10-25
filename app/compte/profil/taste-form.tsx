"use client";

import { Minus, Plus, WarningCircle } from "@phosphor-icons/react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { inputClass, primaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { suggestFormat, TOOL_LABEL, type Drink, type Experience, type Taste, type TasteProfile, type ToolKind } from "@/lib/reco";
import { bestOf, CONFIDENCE_LABEL, variantFigures, type CatalogProduct } from "@/lib/shop";
import { CAFE_PRICE, CUPS, DRINKS, EXPERIENCES, OWNABLE, TASTES, type TasteErrors } from "@/lib/taste";
import { saveTaste, type TasteState } from "./actions";

const tile =
  "flex h-full min-h-16 cursor-pointer flex-col justify-center px-4 py-3 shadow-[inset_0_0_0_1px_var(--color-ink)] transition-colors duration-150 hover:bg-ink/6 peer-checked:bg-ink peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink";

export function TasteForm({ initial, products }: { initial: TasteProfile | null; products: CatalogProduct[] }) {
  const [state, action, pending] = useActionState<TasteState, FormData>(saveTaste, {});
  const [cups, setCups] = useState(initial?.cupsPerWeek ?? 5);
  const [drink, setDrink] = useState<Drink | null>(initial?.drink ?? null);
  const [taste, setTaste] = useState<Taste | null>(initial?.taste ?? null);
  const [experience, setExperience] = useState<Experience>(initial?.experience ?? "decouverte");
  const [owned, setOwned] = useState<ToolKind[]>(initial?.owned ?? []);
  const [cafe, setCafe] = useState(initial?.cafePriceCents ? (initial.cafePriceCents / 100).toFixed(2).replace(".", ",") : "");

  // Le même calcul que la boutique, refait à chaque réponse.
  const cafeCents = Math.round(Number(cafe.replace(",", ".")) * 100);
  const draft: TasteProfile | null =
    drink && taste
      ? { cupsPerWeek: cups, drink, taste, experience, owned, cafePriceCents: cafeCents >= CAFE_PRICE.min * 100 && cafeCents <= CAFE_PRICE.max * 100 ? cafeCents : null }
      : null;
  const errors: TasteErrors = state.errors ?? {};

  return (
    <form action={action} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:gap-14" noValidate>
      <div className="grid gap-10">
        {state.error && (
          <p role="alert" className="bg-danger/10 px-4 py-3 text-danger">
            {state.error}
          </p>
        )}

        <Question number="01" title="Combien de tasses par semaine ?" error={errors.cupsPerWeek}>
          <div className="flex items-stretch">
            <button type="button" aria-label="Une tasse de moins" onClick={() => setCups((c) => Math.max(CUPS.min, c - 1))} className="inline-flex size-14 items-center justify-center shadow-[inset_0_0_0_1px_var(--color-ink)] hover:bg-ink hover:text-paper">
              <Minus aria-hidden size={20} />
            </button>
            <label className="sr-only" htmlFor="cups_per_week">
              Tasses par semaine
            </label>
            <input
              id="cups_per_week"
              name="cups_per_week"
              inputMode="numeric"
              value={cups}
              onChange={(e) => setCups(Math.min(CUPS.max, Math.max(CUPS.min, Number(e.target.value.replace(/\D/g, "")) || CUPS.min)))}
              className="figures h-14 w-24 border-y border-ink bg-paper text-center text-[28px] focus:outline-none"
            />
            <button type="button" aria-label="Une tasse de plus" onClick={() => setCups((c) => Math.min(CUPS.max, c + 1))} className="inline-flex size-14 items-center justify-center shadow-[inset_0_0_0_1px_var(--color-ink)] hover:bg-ink hover:text-paper">
              <Plus aria-hidden size={20} />
            </button>
          </div>
        </Question>

        <Question number="02" title="Comment le buvez-vous ?" error={errors.drink}>
          <Choices name="drink" options={DRINKS} value={drink} onChange={(v) => setDrink(v as Drink)} />
        </Question>

        <Question number="03" title="Quel goût préférez-vous ?" error={errors.taste}>
          <Choices name="taste" options={TASTES} value={taste} onChange={(v) => setTaste(v as Taste)} />
        </Question>

        <Question number="04" title="Vous en préparez déjà ?">
          <Choices name="experience" options={EXPERIENCES} value={experience} onChange={(v) => setExperience(v as Experience)} columns={2} />
        </Question>

        <Question number="05" title="Ce que vous avez déjà" hint="Le calcul évite de vous revendre ce que vous possédez." error={errors.owned}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {OWNABLE.map((kind) => (
              <label key={kind} className="group relative">
                <input
                  type="checkbox"
                  name="owned"
                  value={kind}
                  checked={owned.includes(kind)}
                  onChange={(e) => setOwned((o) => (e.target.checked ? [...o, kind] : o.filter((k) => k !== kind)))}
                  className="peer sr-only"
                />
                <span className={`${tile} flex-row items-center justify-start gap-3`}>
                  <span aria-hidden className="size-3 shrink-0 shadow-[inset_0_0_0_1px_currentColor] group-has-checked:bg-matcha group-has-checked:shadow-none" />
                  <span className="first-letter:uppercase">{TOOL_LABEL[kind]}</span>
                </span>
              </label>
            ))}
          </div>
        </Question>

        <Question number="06" title="Votre matcha en coffee shop" hint={`Facultatif. Le prix que vous payez, entre ${CAFE_PRICE.min} et ${CAFE_PRICE.max} € : il sert seulement à calculer votre économie.`} error={errors.cafePriceCents}>
          <div className="relative w-40">
            <label htmlFor="cafe_price" className="sr-only">
              Prix en euros
            </label>
            <input id="cafe_price" name="cafe_price" inputMode="decimal" value={cafe} onChange={(e) => setCafe(e.target.value)} placeholder="6,50" className={`${inputClass} figures h-14 pr-10 text-[22px]`} />
            <span aria-hidden className="mono pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-fog">
              €
            </span>
          </div>
        </Question>

        <button type="submit" disabled={pending} className={`${primaryButton} w-full sm:w-auto sm:justify-self-start`}>
          {pending && <Spinner />}
          {pending ? "Enregistrement…" : "Voir la boutique pour moi"}
        </button>
      </div>

      <Readout profile={draft} products={products} />
    </form>
  );
}

function Question({ number, title, hint, error, children }: { number: string; title: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t border-ink pt-4">
      <legend className="contents">
        <span className="flex items-baseline gap-4">
          <span className="mono text-fog">{number}</span>
          <span className="display text-[32px] sm:text-[38px]">{title}</span>
        </span>
      </legend>
      {hint && <p className="mt-1 mb-4 text-[15px] text-fog">{hint}</p>}
      <div className={hint ? "" : "mt-4"}>{children}</div>
      {error && (
        <p className="mt-3 flex items-start gap-1.5 text-[15px] text-danger">
          <WarningCircle aria-hidden size={17} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </fieldset>
  );
}

function Choices({ name, options, value, onChange, columns = 3 }: { name: string; options: { value: string; label: string; hint?: string }[]; value: string | null; onChange: (v: string) => void; columns?: 2 | 3 }) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {options.map((o) => (
        <label key={o.value} className="relative">
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="peer sr-only" />
          <span className={tile}>
            <span className="display text-[24px] leading-none">{o.label}</span>
            {o.hint && <span className="mt-1 text-[14px] opacity-75">{o.hint}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

// Relevé noir collant : ce que le calcul tire des réponses, mis à jour à chaque clic.
function Readout({ profile, products }: { profile: TasteProfile | null; products: CatalogProduct[] }) {
  const kit = profile && bestOf(products, "kit", profile);
  const tin = profile && bestOf(products, "matcha", profile);
  const format = tin && profile ? suggestFormat(tin.best.product.variants, profile) : null;
  const figures = tin && format && profile ? variantFigures(tin.best.product, format, profile) : [];

  return (
    <aside aria-labelledby="releve" aria-live="polite" data-theme="dark" className="self-start bg-ink p-6 text-paper lg:sticky lg:top-20">
      <h2 id="releve" className="mono text-matcha uppercase">
        Relevé
      </h2>
      {!profile ? (
        <p className="mt-3 text-paper/70">Répondez aux questions 2 et 3 : le kit, le matcha et le prix de votre tasse s’affichent ici.</p>
      ) : (
        <>
          {[kit, tin].map(
            (pick) =>
              pick && (
                <div key={pick.best.product.slug} className="mt-5 border-t border-line-dark pt-4">
                  <p className="mono text-fog-dark">{pick.best.product.category === "kit" ? "Kit conseillé" : "Matcha conseillé"}</p>
                  <Link href={`/produit/${pick.best.product.slug}`} className="display mt-1 block text-[36px] leading-none hover:text-matcha">
                    {pick.best.product.name}
                  </Link>
                  <p className="mono mt-1 text-fog-dark">
                    {pick.best.match.score}/100 · {CONFIDENCE_LABEL[pick.confidence]}
                    {pick.alternative && <> · sinon {pick.alternative.product.name}</>}
                  </p>
                </div>
              ),
          )}
          {figures.length > 0 && (
            <dl className="mt-5 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 border-t border-line-dark pt-3">
              <dt className="py-1.5 text-fog-dark">Format</dt>
              <dd className="mono py-1.5 text-right">{format?.label}</dd>
              {figures.map((f) => (
                <div key={f.label} className="contents">
                  <dt className="py-1.5 text-fog-dark">{f.label}</dt>
                  <dd className="mono py-1.5 text-right">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
          <p className="mono mt-5 text-[12px] text-fog-dark">Calcul sans IA, doses Ippodo : 2 g pour un matcha pur, 3 g pour un latte.</p>
        </>
      )}
    </aside>
  );
}
