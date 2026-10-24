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
      <form onSubmit={submit} noValidate className="grid content-start gap-10">
        <fieldset className="grid gap-3 sm:grid-cols-3">
          <legend className="mb-4 font-display text-[26px]">L’essentiel</legend>
          {numeric("heightCm")}
          {numeric("weightKg")}
          {numeric("age")}
        </fieldset>

        <fieldset className="grid gap-3 sm:grid-cols-2 sm:items-start">
          <legend className="font-display text-[26px]">Si vous les connaissez</legend>
          <p className="mt-1 mb-2 text-sm text-pretty text-label-2 sm:col-span-2">
            Mesurés au mètre ruban, ils remplacent l’estimation et rendent le calcul plus sûr.
          </p>
          {numeric("chestCm", "À l’horizontale, sous les bras, à l’endroit le plus large.")}
          {numeric("waistCm", "Au niveau du nombril, sans serrer.")}
        </fieldset>

        <fieldset>
          <legend className="font-display text-[26px]">Coupe préférée</legend>
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
                <span className="flex min-h-14 cursor-pointer items-center justify-center border border-control bg-field px-3 py-2 text-center text-[15px] leading-tight font-medium transition-[border-color,box-shadow] duration-150 ease-[ease] hover:border-label-2 active:bg-tile peer-checked:border-label peer-checked:shadow-[0_0_0_1px_var(--color-label)] peer-focus-visible:outline-1 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-label">
                  {fit.label}
                </span>
              </label>
            ))}
          </div>
          {errors.preferredFit && <p className="mt-2 text-xs text-danger">{errors.preferredFit}</p>}
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={primaryButton}>
            {pending && <Spinner className="mr-2" />}
            {pending ? "Enregistrement…" : "Enregistrer et voir les costumes"}
          </button>
          {state.error && (
            <p role="alert" className="text-sm text-danger">
              {state.error}
            </p>
          )}
        </div>
      </form>

      <section aria-labelledby="reading-title" className="bg-tile px-4 py-6 sm:p-10 lg:sticky lg:top-[88px] lg:self-start">
        <h2 id="reading-title" className="text-[28px]">
          Lecture du mètre
        </h2>
        <p className="mt-2 text-sm text-label-2">
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
            <p className="mt-4 text-sm text-label-2">
              Votre préférence pour une coupe {fitLabel} décale le repère de {Math.abs(fitShift)} cm{" "}
              {fitShift < 0 ? "vers les petites tailles" : "vers les grandes tailles"}.
            </p>
          )}
        </div>

        {preview && m && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-separator pt-8">
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
      <dt className="text-sm text-label-2">{label}</dt>
      <dd className="mt-1.5">
        <span className={`figures text-[28px] leading-none whitespace-nowrap sm:text-[32px] ${estimated ? "estimated" : ""}`}>{value}</span>
        <span className="mt-1.5 block text-xs text-label-2">{estimated ? "estimé" : "mesuré"}</span>
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
        <span className="figures text-[56px] leading-none">{result.size}</span>
        {result.alternative && <span className="ml-2 text-[17px] text-label-2">ou {result.alternative}</span>}
        <span className="mt-2 block text-xs text-label-2">Taille estimée, {CONFIDENCE_LABEL[result.confidence]}</span>
      </>
    );
  } else {
    reading = <span className="block text-sm">Hors de notre tableau de tailles pour l’instant.</span>;
  }
  return (
    <div>
      <dt className="text-sm text-label-2">{label}</dt>
      <dd className="mt-1.5">{reading}</dd>
    </div>
  );
}

function DeleteZone({ onDelete }: { onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <section aria-labelledby="delete-title" className="mt-4 border-t border-separator pt-10 lg:col-span-2">
      <h2 id="delete-title" className="text-[21px]">
        Effacer mes mensurations
      </h2>
      <p className="mt-2 max-w-prose text-sm text-label-2">
        Vos chiffres sont supprimés de nos serveurs. Les tailles ne seront plus calculées tant que vous ne les aurez pas
        saisis à nouveau.
      </p>
      <form action={onDelete} className="mt-4 flex flex-wrap gap-3">
        {confirming ? (
          <>
            <button key="confirm" type="submit" className="eyebrow h-11 cursor-pointer bg-danger px-6 text-on-accent transition-transform duration-150 ease-out active:scale-[0.98]">
              Oui, tout effacer
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="eyebrow h-11 cursor-pointer px-4 text-label-2 hover:text-label">
              Annuler
            </button>
          </>
        ) : (
          // Clés distinctes : sinon React transforme ce bouton en bouton d'envoi pendant le clic, qui soumet le formulaire.
          <button key="ask" type="button" onClick={() => setConfirming(true)} className="eyebrow h-11 cursor-pointer border border-danger/70 px-6 text-danger transition-colors duration-150 ease-[ease] hover:bg-danger-tint">
            Effacer mes mensurations
          </button>
        )}
      </form>
    </section>
  );
}
