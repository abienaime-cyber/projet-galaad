"use client";

import { startTransition, useActionState, useState } from "react";
import { Field, primaryButton } from "@/components/field";
import { SizeTape } from "@/components/size-tape";
import { Spinner } from "@/components/spinner";
import { FITS, MEASUREMENT_FIELDS, parseMeasurements } from "@/lib/measurements";
import { CONFIDENCE_LABEL } from "@/lib/shop";
import { estimateChest, estimateWaist, PREFERENCE_EASE, recommendSize, type SizeRow } from "@/lib/sizing";
import { deleteMeasurements, saveMeasurements, type MeasurementsState } from "./actions";

export type Charts = { shirt: SizeRow[]; suit: SizeRow[] };

const cm = (n: number) => `${n.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} cm`;

export function MeasurementsForm({ initial, charts }: { initial: Record<string, string>; charts: Charts }) {
  const [values, setValues] = useState(initial);
  const [state, formAction, pending] = useActionState<MeasurementsState, FormData>(saveMeasurements, {});
  const errors = state.errors ?? {};

  const set = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
  };

  // Aperçu en direct : calculé seulement quand la saisie est complète et valide.
  const parsed = parseMeasurements((name) => values[name] ?? "");
  const m = "data" in parsed ? parsed.data : null;
  const preview = m && {
    chest: m.chestCm ?? estimateChest(m.heightCm, m.weightKg),
    waist: m.waistCm ?? estimateWaist(m.heightCm, m.weightKg, m.age),
    shirt: recommendSize(m, { category: "shirt", fit: "regular", sizes: charts.shirt }),
    suit: recommendSize(m, { category: "suit", fit: "regular", sizes: charts.suit }),
  };

  const numeric = (key: keyof typeof MEASUREMENT_FIELDS, hint?: string) => {
    const f = MEASUREMENT_FIELDS[key];
    return (
      <Field
        name={f.name}
        label={f.label}
        unit={f.unit}
        hint={hint}
        inputMode={f.integer ? "numeric" : "decimal"}
        autoComplete="off"
        required={f.required}
        value={values[f.name] ?? ""}
        onChange={set(f.name)}
        error={errors[key]}
      />
    );
  };

  // Soumission manuelle : l'attribut action réinitialiserait le formulaire et perdrait la coupe choisie.
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => formAction(data));
  };
  const fitShift = m ? PREFERENCE_EASE[m.preferredFit ?? "regular"] : 0;
  const fitLabel = FITS.find((f) => f.value === m?.preferredFit)?.label.toLowerCase();

  return (
    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
      <form onSubmit={submit} noValidate className="card grid content-start gap-10 p-5 sm:p-8">
        <fieldset className="grid gap-4 sm:grid-cols-3">
          <legend className="mb-4 font-display text-[28px] font-semibold">L’essentiel</legend>
          {numeric("heightCm")}
          {numeric("weightKg")}
          {numeric("age")}
        </fieldset>

        <fieldset className="grid gap-4 sm:grid-cols-2 sm:items-start">
          <legend className="font-display text-[28px] font-semibold">Si vous les connaissez</legend>
          <p className="mt-1 mb-1 text-[14px] text-pretty text-muted-foreground sm:col-span-2">
            Mesurés au mètre ruban, ils remplacent l’estimation et rendent le calcul plus sûr.
          </p>
          {numeric("chestCm", "À l’horizontale, sous les bras, à l’endroit le plus large.")}
          {numeric("waistCm", "Au niveau du nombril, sans serrer.")}
        </fieldset>

        <fieldset>
          <legend className="font-display text-[28px] font-semibold">Coupe préférée</legend>
          {/* Tuiles de choix : filet noir sur l’option retenue. */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[{ value: "", label: "Sans préférence" }, ...FITS].map((fit) => (
              <label key={fit.value} className="relative">
                <input
                  type="radio"
                  name="preferred_fit"
                  value={fit.value}
                  checked={(values.preferred_fit ?? "") === fit.value}
                  onChange={set("preferred_fit")}
                  className="peer sr-only"
                />
                <span className="flex min-h-14 cursor-pointer items-center justify-center rounded-lg border border-input bg-card px-3 py-2 text-center text-[15px] leading-tight font-semibold transition-[border-color,box-shadow,background-color] duration-200 hover:border-foreground active:bg-muted peer-checked:border-accent peer-checked:bg-accent/5 peer-checked:shadow-[0_0_0_1px_var(--color-accent)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring">
                  {fit.label}
                </span>
              </label>
            ))}
          </div>
          {errors.preferredFit && <p className="mt-2 text-[13px] text-destructive">{errors.preferredFit}</p>}
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={primaryButton}>
            {pending && <Spinner className="mr-2" />}
            {pending ? "Enregistrement…" : "Enregistrer et voir les costumes"}
          </button>
          {state.error && (
            <p role="alert" className="text-[14px] text-destructive">
              {state.error}
            </p>
          )}
        </div>
      </form>

      <section aria-labelledby="reading-title" className="rounded-2xl bg-muted px-4 py-6 sm:p-10 lg:sticky lg:top-24 lg:self-start">
        <h2 id="reading-title" className="text-[32px]">
          Lecture du mètre
        </h2>
        <p className="mt-2 text-[14px] text-muted-foreground">
          {preview
            ? "Calcul sur un modèle de coupe classique. Chaque article applique ensuite son propre tableau de tailles."
            : "Indiquez votre taille, votre poids et votre âge : votre repère se place sur le mètre."}
        </p>

        <div className="mt-8">
          <SizeTape
            chestCm={preview ? preview.chest + fitShift : null}
            estimated={m?.chestCm == null}
            bands={[
              { title: "Chemises", rows: charts.shirt, result: preview?.shirt ?? null },
              { title: "Costumes", rows: charts.suit, result: preview?.suit ?? null },
            ]}
          />
          {fitShift !== 0 && (
            <p className="mt-4 text-[14px] text-muted-foreground">
              Votre préférence pour une coupe {fitLabel} décale le repère de {Math.abs(fitShift)} cm{" "}
              {fitShift < 0 ? "vers les petites tailles" : "vers les grandes tailles"}.
            </p>
          )}
        </div>

        {preview && m && (
          <dl className="card mt-8 grid grid-cols-2 gap-x-6 gap-y-8 p-5 sm:p-6">
            <Reading label="Tour de poitrine" value={cm(preview.chest)} estimated={m.chestCm === null} />
            <Reading label="Tour de taille" value={cm(preview.waist)} estimated={m.waistCm === null} />
            <SizeReading label="Chemise" result={preview.shirt} hasChart={charts.shirt.length > 0} />
            <SizeReading label="Costume" result={preview.suit} hasChart={charts.suit.length > 0} />
          </dl>
        )}
      </section>

      {initial.height_cm && (
        <DeleteZone
          onDelete={async () => {
            await deleteMeasurements();
            setValues({});
          }}
        />
      )}
    </div>
  );
}

function Reading({ label, value, estimated }: { label: string; value: string; estimated: boolean }) {
  return (
    <div>
      <dt className="text-[14px] text-muted-foreground">{label}</dt>
      <dd className="mt-1.5">
        <span className={`figures text-[26px] font-semibold leading-none whitespace-nowrap sm:text-[32px] ${estimated ? "estimated" : ""}`}>{value}</span>
        <span className="mt-1.5 block text-[12px] text-muted-foreground">{estimated ? "estimé" : "mesuré"}</span>
      </dd>
    </div>
  );
}

function SizeReading({ label, result, hasChart }: { label: string; result: ReturnType<typeof recommendSize>; hasChart: boolean }) {
  let reading: React.ReactNode;
  if (!hasChart) {
    reading = <span className="block text-sm">Tableau de tailles indisponible pour le moment.</span>;
  } else if (result.size) {
    reading = (
      <>
        <span className="figures text-[52px] leading-none font-bold text-accent">{result.size}</span>
        {result.alternative && <span className="ml-2 text-[17px] text-muted-foreground">ou {result.alternative}</span>}
        <span className="mt-2 block text-[12px] text-muted-foreground">Taille estimée, {CONFIDENCE_LABEL[result.confidence]}</span>
      </>
    );
  } else {
    reading = <span className="block text-sm">Hors de notre tableau de tailles pour l’instant.</span>;
  }
  return (
    <div>
      <dt className="text-[14px] text-muted-foreground">{label}</dt>
      <dd className="mt-1.5">{reading}</dd>
    </div>
  );
}

function DeleteZone({ onDelete }: { onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <section aria-labelledby="delete-title" className="card p-5 sm:p-8 lg:col-span-2">
      <h2 id="delete-title" className="text-[26px]">
        Effacer mes mensurations
      </h2>
      <p className="mt-2 max-w-prose text-[14px] text-muted-foreground">
        Vos chiffres sont supprimés de nos serveurs. Les tailles ne seront plus calculées tant que vous ne les aurez pas
        saisis à nouveau.
      </p>
      <form action={onDelete} className="mt-4 flex flex-wrap gap-3">
        {confirming ? (
          <>
            <button key="confirm" type="submit" className="h-11 cursor-pointer rounded-lg bg-destructive px-6 text-[14px] font-semibold text-on-primary transition-[background-color,transform] duration-200 hover:bg-destructive/90 active:scale-[0.98]">
              Oui, tout effacer
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="h-11 cursor-pointer rounded-lg px-4 text-[14px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
              Annuler
            </button>
          </>
        ) : (
          // Clés distinctes : sinon React transforme ce bouton en bouton d'envoi pendant le clic, qui soumet le formulaire.
          <button key="ask" type="button" onClick={() => setConfirming(true)} className="h-11 cursor-pointer rounded-lg border-2 border-destructive px-6 text-[14px] font-semibold text-destructive transition-colors duration-200 hover:bg-destructive-tint">
            Effacer mes mensurations
          </button>
        )}
      </form>
    </section>
  );
}
