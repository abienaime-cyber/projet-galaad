import type { SizeRecommendation, SizeRow } from "@/lib/sizing";
import { SpringMarker } from "./spring-marker";

const MIN_CM = 80;
const MAX_CM = 140;
const SPAN = MAX_CM - MIN_CM;
const pos = (cm: number) => (Math.min(Math.max(cm, MIN_CM), MAX_CM) - MIN_CM) / SPAN * 100;
const DECADES = [90, 100, 110, 120, 130];
const HALVES = [85, 95, 105, 115, 125, 135];

// Graduations du mètre : 1 cm, 5 cm, et les dizaines en rouge comme sur un vrai ruban.
const TICKS = {
  backgroundImage: [
    "linear-gradient(to right, var(--color-tape-red) 2px, transparent 2px)",
    "linear-gradient(to right, var(--color-ink) 1px, transparent 1px)",
    "linear-gradient(to right, var(--color-ink) 1px, transparent 1px)",
  ].join(","),
  backgroundSize: `calc(100% / ${SPAN / 10}) 55%, calc(100% / ${SPAN / 5}) 38%, calc(100% / ${SPAN}) 22%`,
  backgroundRepeat: "repeat-x",
};

type Band = { title: string; rows: SizeRow[]; result: SizeRecommendation | null };

export function SizeTape({ chestCm, estimated, bands }: { chestCm: number | null; estimated: boolean; bands: Band[] }) {
  const [top, bottom] = bands;
  // Hors du mètre, le repère collé au bord mentirait : on affiche la valeur au bord, côté dépassement.
  let overflow: "left" | "right" | null = null;
  if (chestCm !== null && chestCm < MIN_CM) overflow = "left";
  else if (chestCm !== null && chestCm > MAX_CM) overflow = "right";
  return (
    <figure aria-label="Votre tour de poitrine placé sur le mètre, avec les tailles de chemise et de costume" className="relative overflow-x-clip select-none">
      <BandRow band={top} />
      <div className="relative my-1.5 h-12 rounded-[2px] bg-tape shadow-[0_1px_2px_rgb(26_29_33/0.18)]" style={TICKS}>
        {DECADES.map((cm) => (
          <span key={cm} className="figures absolute bottom-1 -translate-x-1/2 text-[15px] leading-none text-tape-red" style={{ left: `${pos(cm)}%` }}>
            {cm}
          </span>
        ))}
        {HALVES.map((cm) => (
          <span key={cm} className="figures absolute bottom-1 hidden -translate-x-1/2 text-[11px] leading-none text-ink sm:block" style={{ left: `${pos(cm)}%` }}>
            {cm}
          </span>
        ))}
        {overflow && chestCm !== null && (
          <span
            className={`figures absolute top-1 flex items-center gap-1 rounded-[2px] bg-navy px-1.5 py-0.5 text-sm leading-none whitespace-nowrap text-chalk ${overflow === "left" ? "left-1 flex-row-reverse" : "right-1"}`}
          >
            {chestCm.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} cm
            <svg aria-hidden viewBox="0 0 10 10" className={`size-2.5 ${overflow === "left" ? "rotate-180" : ""}`}>
              <path d="M2 1l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span className="sr-only">{overflow === "left" ? ", en deçà du mètre" : ", au-delà du mètre"}</span>
          </span>
        )}
      </div>
      <BandRow band={bottom} />

      {chestCm !== null && !overflow && (
        <SpringMarker to={pos(chestCm)} className="pointer-events-none absolute inset-y-0 left-0 w-full">
          <div className={`absolute -top-1 -bottom-1 left-0 -translate-x-1/2 border-l-2 border-navy ${estimated ? "border-dashed" : ""}`} />
        </SpringMarker>
      )}
    </figure>
  );
}

function BandRow({ band }: { band: Band }) {
  const size = band.result?.size;
  const alternative = band.result?.alternative;
  return (
    <div className="relative h-8" role="list" aria-label={band.title}>
      {band.rows.length === 0 && (
        <p className="flex h-full items-center text-xs text-ink-2">Tableau des {band.title.toLowerCase()} indisponible.</p>
      )}
      {band.rows.map((row) => {
        let state = "idle";
        if (row.label === size) state = "chosen";
        else if (row.label === alternative) state = "alternative";
        return (
          <div
            key={row.label}
            role="listitem"
            className="absolute inset-y-0 flex items-center justify-center border-x border-paper text-xs font-semibold transition-colors duration-150 ease-[ease] data-[state=alternative]:bg-chalk data-[state=alternative]:text-navy data-[state=chosen]:bg-navy data-[state=chosen]:text-chalk data-[state=idle]:bg-paper-2 data-[state=idle]:text-ink-2"
            data-state={state}
            style={{ left: `${pos(row.chestMin)}%`, width: `${pos(row.chestMax) - pos(row.chestMin)}%` }}
          >
            {row.label}
          </div>
        );
      })}
    </div>
  );
}
