"use client";

import { startTransition, useActionState, useState } from "react";
import { Field, primaryButton } from "@/components/field";
import { SizeTape } from "@/components/size-tape";
import { Spinner } from "@/components/spinner";
import { FITS, MEASUREMENT_FIELDS, parseMeasurements } from "@/lib/measurements";
import { estimateChest, estimateWaist, PREFERENCE_EASE, recommendSize, type Confidence, type SizeRow } from "@/lib/sizing";
import { deleteMeasurements, saveMeasurements, type MeasurementsState } from "./actions";

export type Charts = { shirt: SizeRow[]; suit: SizeRow[] };

const CONFIDENCE: Record<Confidence, string> = {
  high: "confiance élevée",
  medium: "confiance moyenne",
  low: "confiance faible",
};

const cm = (n: number) => `${n.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} cm`;

export function MeasurementsForm({ initial, charts }: { initial: Record<string, string>; charts: Charts }) {
  const [values, setValues] = useState(initial);
  const [editedAt, setEditedAt] = useState(0);
  const [state, formAction, pending] = useActionState<MeasurementsState, FormData>(saveMeasurements, {});
  const errors = state.errors ?? {};
  const saved = state.savedAt !== undefined && state.savedAt > editedAt;

  const set = (name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
    setEditedAt(Date.now());
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
    <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
      <form onSubmit={submit} noValidate className="grid content-start gap-8">
        <fieldset className="grid gap-5 sm:grid-cols-3">
          <legend className="mb-4 text-lg font-semibold">L’essentiel</legend>
          {numeric("heightCm")}
          {numeric("weightKg")}
          {numeric("age")}
        </fieldset>

        <fieldset className="grid gap-5 sm:grid-cols-2 sm:items-end">
          <legend className="text-lg font-semibold">Si vous les connaissez</legend>
          <p className="-mt-1 mb-1 text-sm text-pretty text-ink-2 sm:col-span-2">
            Mesurés au mètre ruban, ils remplacent l’estimation et rendent le calcul plus sûr.
          </p>
          {numeric("chestCm", "À l’horizontale, sous les bras, à l’endroit le plus large.")}
          {numeric("waistCm", "Au niveau du nombril, sans serrer.")}
        </fieldset>

        <fieldset>
          <legend className="text-lg font-semibold">Coupe préférée</legend>
          <div className="mt-3 inline-grid grid-cols-2 gap-px overflow-hidden rounded-[3px] border border-rule bg-rule sm:grid-cols-[repeat(4,auto)]">
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
                <span className="flex min-h-11 cursor-pointer items-center justify-center bg-white px-4 py-2 text-center text-sm sm:whitespace-nowrap peer-checked:bg-navy peer-checked:font-semibold peer-checked:text-chalk peer-focus-visible:outline-2 peer-focus-visible:-outline-offset-4 peer-focus-visible:outline-navy hover:bg-paper-2 peer-checked:hover:bg-navy active:bg-rule/60 peer-checked:active:bg-navy-2">
                  {fit.label}
                </span>
              </label>
            ))}
          </div>
          {errors.preferredFit && <p className="mt-1.5 text-sm text-tape-red">{errors.preferredFit}</p>}
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <button type="submit" disabled={pending} className={primaryButton}>
            {pending && <Spinner className="mr-2" />}
            {pending ? "Enregistrement…" : "Enregistrer mes mensurations"}
          </button>
          <p role="status" className="text-sm text-ok">
            {saved && "Mensurations enregistrées."}
          </p>
          {state.error && (
            <p role="alert" className="text-sm text-tape-red">
              {state.error}
            </p>
          )}
        </div>
      </form>

      <section aria-labelledby="reading-title" className="lg:sticky lg:top-22 lg:self-start">
        <h2 id="reading-title" className="text-lg font-semibold">
          Lecture du mètre
        </h2>
        <p className="mt-1 text-sm text-ink-2">
          {preview
            ? "Calcul sur un modèle de coupe classique. Chaque article applique ensuite son propre tableau de tailles."
            : "Indiquez votre taille, votre poids et votre âge : votre repère se place sur le mètre."}
        </p>

        <div className="mt-6">
          <SizeTape
            chestCm={preview ? preview.chest + fitShift : null}
            estimated={m?.chestCm == null}
            bands={[
              { title: "Chemises", rows: charts.shirt, result: preview?.shirt ?? null },
              { title: "Costumes", rows: charts.suit, result: preview?.suit ?? null },
            ]}
          />
          <div className="mt-1 flex justify-between text-xs text-ink-2">
            <span>En haut : chemises</span>
            <span>En bas : costumes</span>
          </div>
          {fitShift !== 0 && (
            <p className="mt-3 text-sm text-ink-2">
              Votre préférence pour une coupe {fitLabel} décale le repère de {Math.abs(fitShift)} cm{" "}
              {fitShift < 0 ? "vers les petites tailles" : "vers les grandes tailles"}.
            </p>
          )}
        </div>

        {preview && m && (
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-rule pt-6">
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
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="mt-1">
        <span className={`figures text-2xl whitespace-nowrap sm:text-3xl ${estimated ? "basted" : ""}`}>{value}</span>
        <span className="ml-2 text-sm text-ink-2">{estimated ? "estimé" : "mesuré"}</span>
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
        <span className="figures text-5xl leading-none">{result.size}</span>
        {result.alternative && <span className="ml-2 text-sm text-ink-2">ou {result.alternative}</span>}
        <span className="mt-1.5 block text-sm text-ink-2">Taille estimée, {CONFIDENCE[result.confidence]}</span>
      </>
    );
  } else {
    reading = <span className="block text-sm">Hors de notre tableau de tailles pour l’instant.</span>;
  }
  return (
    <div>
      <dt className="text-sm text-ink-2">{label}</dt>
      <dd className="mt-1">{reading}</dd>
    </div>
  );
}

function DeleteZone({ onDelete }: { onDelete: () => Promise<void> }) {
  const [confirming, setConfirming] = useState(false);
  return (
    <section aria-labelledby="delete-title" className="mt-4 border-t border-rule pt-8 lg:col-span-2">
      <h2 id="delete-title" className="font-semibold">
        Effacer mes mensurations
      </h2>
      <p className="mt-1 max-w-prose text-sm text-ink-2">
        Vos chiffres sont supprimés de nos serveurs. Les tailles ne seront plus calculées tant que vous ne les aurez pas
        saisis à nouveau.
      </p>
      <form action={onDelete} className="mt-4 flex flex-wrap gap-3">
        {confirming ? (
          <>
            <button key="confirm" type="submit" className="h-10 cursor-pointer rounded-[3px] bg-tape-red px-4 text-sm font-semibold text-white transition-transform duration-150 ease-out active:scale-[0.97]">
              Oui, tout effacer
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="h-10 cursor-pointer rounded-[3px] px-4 text-sm text-ink-2 hover:text-ink">
              Annuler
            </button>
          </>
        ) : (
          // Clés distinctes : sinon React transforme ce bouton en bouton d'envoi pendant le clic, qui soumet le formulaire.
          <button key="ask" type="button" onClick={() => setConfirming(true)} className="h-10 cursor-pointer rounded-[3px] border border-tape-red px-4 text-sm font-medium text-tape-red transition-colors duration-150 ease-[ease] hover:bg-tape-red/5">
            Effacer mes mensurations
          </button>
        )}
      </form>
    </section>
  );
}
