import type { SizeRecommendation, SizeRow } from "@/lib/sizing";
import { SpringMarker } from "./spring-marker";

const MIN_CM = 80;
const MAX_CM = 140;
const pos = (cm: number) => ((Math.min(Math.max(cm, MIN_CM), MAX_CM) - MIN_CM) / (MAX_CM - MIN_CM)) * 100;
const DECADES = [90, 100, 110, 120, 130];

type Band = { title: string; rows: SizeRow[]; result: SizeRecommendation | null };

// Jauge en curseur iOS : piste grise, partie remplie en bleu jusqu'au tour de poitrine, pouce blanc.
export function SizeTape({ chestCm, estimated, bands }: { chestCm: number | null; estimated: boolean; bands: Band[] }) {
  const [top, bottom] = bands;
  // Hors de la jauge, un pouce collé au bord mentirait : on affiche la valeur au bord, côté dépassement.
  let overflow: "left" | "right" | null = null;
  if (chestCm !== null && chestCm < MIN_CM) overflow = "left";
  else if (chestCm !== null && chestCm > MAX_CM) overflow = "right";
  const showThumb = chestCm !== null && !overflow;

  return (
    <figure aria-label="Votre tour de poitrine placé sur la jauge, avec les tailles de chemise et de costume" className="relative overflow-x-clip px-3 select-none">
      <p aria-hidden className="mb-1 text-[11px] font-medium text-label-2">{top.title}</p>
      <BandRow band={top} />
      <div className="relative my-2 h-7">
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 overflow-hidden rounded-full bg-fill">
          {showThumb && (
            <SpringMarker to={pos(chestCm)} className="absolute inset-0">
              <div className={`absolute inset-y-0 right-full w-full ${estimated ? "bg-accent/45" : "bg-accent"}`} />
            </SpringMarker>
          )}
        </div>
        {showThumb && (
          <SpringMarker to={pos(chestCm)} className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 left-0 size-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0.5px_4px_rgb(0_0_0/0.12),0_6px_13px_rgb(0_0_0/0.12)]" />
          </SpringMarker>
        )}
        {overflow && chestCm !== null && (
          <span
            className={`figures absolute top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs whitespace-nowrap text-white ${overflow === "left" ? "left-0 flex-row-reverse" : "right-0"}`}
          >
            {chestCm.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} cm
            <svg aria-hidden viewBox="0 0 10 10" className={`size-2.5 ${overflow === "left" ? "rotate-180" : ""}`}>
              <path d="M3 1.5 6.5 5 3 8.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="sr-only">{overflow === "left" ? ", en deçà de la jauge" : ", au-delà de la jauge"}</span>
          </span>
        )}
      </div>
      <div aria-hidden className="relative mb-2 h-4">
        {DECADES.map((cm) => (
          <span key={cm} className="absolute -translate-x-1/2 text-[11px] leading-4 whitespace-nowrap text-label-2 tabular-nums" style={{ left: `${pos(cm)}%` }}>
            {cm === DECADES.at(-1) ? `${cm} cm` : cm}
          </span>
        ))}
      </div>
      <BandRow band={bottom} />
      <p aria-hidden className="mt-1 text-[11px] font-medium text-label-2">{bottom.title}</p>
    </figure>
  );
}

function BandRow({ band }: { band: Band }) {
  const size = band.result?.size;
  const alternative = band.result?.alternative;
  return (
    <div className="relative h-8" role="list" aria-label={band.title}>
      {band.rows.length === 0 && (
        <p className="flex h-full items-center text-xs text-label-2">Tableau des {band.title.toLowerCase()} indisponible.</p>
      )}
      {band.rows.map((row) => {
        let state = "idle";
        if (row.label === size) state = "chosen";
        else if (row.label === alternative) state = "alternative";
        return (
          <div
            key={row.label}
            role="listitem"
            className="absolute inset-y-0 flex justify-center"
            style={{ left: `${pos(row.chestMin)}%`, width: `${pos(row.chestMax) - pos(row.chestMin)}%` }}
          >
            <span
              data-state={state}
              className="flex h-full min-w-full shrink-0 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold tabular-nums transition-[background-color,color,box-shadow] duration-150 ease-[ease] data-[state=alternative]:text-accent sm:data-[state=alternative]:bg-white sm:data-[state=alternative]:shadow-[inset_0_0_0_1px_var(--color-accent)] data-[state=chosen]:bg-accent data-[state=chosen]:text-white data-[state=idle]:text-label-2"
            >
              {row.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
