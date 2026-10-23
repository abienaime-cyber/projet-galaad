import type { Category } from "@/lib/sizing";

// Aucune photo produit : chaque article est dessiné en aplat de sa couleur, motif compris.
type Swatch = { fill: string; pattern?: "stripe" | "pinstripe" | "check" | "gingham"; ink?: string };

const SWATCHES: Record<string, Swatch> = {
  Blanc: { fill: "#fbfbfb" },
  "Bleu ciel": { fill: "#b9d1ea" },
  "Rayé bleu et blanc": { fill: "#f6f8fb", pattern: "stripe", ink: "#6a8fc6" },
  Sable: { fill: "#d9c6a3" },
  "Carreaux vert et marine": { fill: "#36564a", pattern: "check", ink: "#1f2b47" },
  Indigo: { fill: "#36497b" },
  "Rose pâle": { fill: "#f2dad9" },
  Noir: { fill: "#232325" },
  "Vichy bleu": { fill: "#f6f8fb", pattern: "gingham", ink: "#5a84c4" },
  Gris: { fill: "#a9abaf" },
  "Bleu délavé": { fill: "#97afca" },
  Camel: { fill: "#b98b58" },
  Bleu: { fill: "#7397c6" },
  "Bleu marine": { fill: "#253252" },
  Écru: { fill: "#efe7d6" },
  "Gris anthracite": { fill: "#3d4046" },
  "Bleu nuit": { fill: "#1e2641" },
  "Gris chiné": { fill: "#82858b" },
  Beige: { fill: "#d6c4a4" },
  "Gris et bleu": { fill: "#8c8f94", pattern: "check", ink: "#4d6ca8" },
  Marron: { fill: "#6f4d35" },
  "Gris moyen": { fill: "#8d8f94" },
  "Vert olive": { fill: "#6e6d41" },
  "Anthracite rayé": { fill: "#3d4046", pattern: "pinstripe", ink: "#a3a6ac" },
};

function isDark(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.35;
}

const SUIT = {
  sleeves: [
    "M56 50C42 56 38 80 37 110L34 250Q48 256 64 252L74 112L70 46Z",
    "M184 50C198 56 202 80 203 110L206 250Q192 256 176 252L166 112L170 46Z",
  ],
  body: "M98 26L58 46Q66 62 70 100L72 276Q120 282 168 276L170 100Q174 62 182 46L142 26Z",
  lapels: ["M98 26L120 150L102 112L86 64L94 58L84 44Z", "M142 26L120 150L138 112L154 64L146 58L156 44Z"],
};

const SHIRT = {
  sleeves: [
    "M58 48C46 54 42 78 41 108L38 236L64 240L74 110L70 44Z",
    "M182 48C194 54 198 78 199 108L202 236L176 240L166 110L170 44Z",
  ],
  cuffs: ["M38 236L64 240L63 258L37 255Z", "M202 236L176 240L177 258L203 255Z"],
  body: "M98 28L58 46Q66 62 70 98L72 276Q120 282 168 276L170 98Q174 62 182 46L142 28Z",
  collar: ["M97 22L120 40L106 60L92 34Z", "M143 22L120 40L134 60L148 34Z"],
};

type Props = { category: Category; color: string; id: string; className?: string; style?: React.CSSProperties };

export function Garment({ category, color, id, className, style }: Props) {
  const swatch = SWATCHES[color] ?? { fill: "#c7c7cc" };
  const dark = isDark(swatch.fill);
  const edge = dark ? "rgb(255 255 255 / 0.16)" : "rgb(0 0 0 / 0.14)";
  const shade = "rgb(0 0 0 / 0.07)";
  const patternId = `motif-${id}`;
  const floorId = `sol-${id}`;
  const g = category === "suit" ? SUIT : SHIRT;

  return (
    <svg viewBox="0 0 240 300" aria-hidden className={className} style={style}>
      <defs>
        <radialGradient id={floorId}>
          <stop offset="0" stopColor="rgb(0 0 0 / 0.16)" />
          <stop offset="1" stopColor="rgb(0 0 0 / 0)" />
        </radialGradient>
        {swatch.pattern && <Pattern id={patternId} kind={swatch.pattern} ink={swatch.ink!} />}
      </defs>

      <ellipse cx="120" cy="284" rx="86" ry="9" fill={`url(#${floorId})`} />

      {/* Manches d'abord, ombrées, puis le corps par-dessus. */}
      {[...g.sleeves.map((d) => ({ d, sleeve: true })), { d: g.body, sleeve: false }].map(({ d, sleeve }) => (
        <g key={d}>
          <path d={d} fill={swatch.fill} stroke={edge} strokeLinejoin="round" />
          {swatch.pattern && <path d={d} fill={`url(#${patternId})`} />}
          {sleeve && <path d={d} fill={shade} />}
        </g>
      ))}

      {category === "suit" ? (
        <>
          <path d="M98 26L142 26L120 132Z" fill="#fbfbfd" stroke="rgb(0 0 0 / 0.08)" />
          <path d="M115 40L125 40L127 50L124 54L129 120L120 132L111 120L116 54L113 50Z" fill={dark ? "#8b2635" : "#2c2c2e"} />
          {SUIT.lapels.map((d) => (
            <path key={d} d={d} fill={swatch.fill} stroke={edge} strokeLinejoin="round" />
          ))}
          {swatch.pattern && SUIT.lapels.map((d) => <path key={`m${d}`} d={d} fill={`url(#${patternId})`} />)}
          {SUIT.lapels.map((d) => (
            <path key={`s${d}`} d={d} fill={shade} />
          ))}
          <path d="M120 150L120 210Q116 250 98 278M120 210Q124 250 142 278" fill="none" stroke={edge} strokeWidth="1.5" />
          <path d="M140 92L160 89M80 214L108 214M132 214L160 214" stroke={edge} strokeWidth="2" strokeLinecap="round" />
          <circle cx="120" cy="168" r="3.2" fill={edge} />
          <circle cx="120" cy="198" r="3.2" fill={edge} />
        </>
      ) : (
        <>
          {SHIRT.cuffs.map((d) => (
            <path key={d} d={d} fill={swatch.fill} stroke={edge} strokeLinejoin="round" />
          ))}
          <path d="M98 28Q120 44 142 28" fill="none" stroke={edge} strokeWidth="1.5" />
          {SHIRT.collar.map((d) => (
            <path key={d} d={d} fill={swatch.fill} stroke={edge} strokeLinejoin="round" />
          ))}
          {swatch.pattern && SHIRT.collar.map((d) => <path key={`m${d}`} d={d} fill={`url(#${patternId})`} />)}
          <path d="M120 40L120 278M134 92h22v22q-11 4-22 0z" fill="none" stroke={edge} strokeWidth="1.5" />
          {[66, 104, 142, 180, 218, 256].map((y) => (
            <circle key={y} cx="125" cy={y} r="2.4" fill={edge} />
          ))}
        </>
      )}
    </svg>
  );
}

function Pattern({ id, kind, ink }: { id: string; kind: NonNullable<Swatch["pattern"]>; ink: string }) {
  if (kind === "stripe" || kind === "pinstripe") {
    const gap = kind === "stripe" ? 7 : 9;
    return (
      <pattern id={id} width={gap} height="10" patternUnits="userSpaceOnUse">
        <rect width={kind === "stripe" ? 2.5 : 0.8} height="10" fill={ink} opacity={kind === "stripe" ? 0.85 : 0.7} />
      </pattern>
    );
  }
  if (kind === "gingham") {
    return (
      <pattern id={id} width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="6" height="12" fill={ink} opacity="0.45" />
        <rect width="12" height="6" fill={ink} opacity="0.45" />
      </pattern>
    );
  }
  return (
    <pattern id={id} width="22" height="22" patternUnits="userSpaceOnUse">
      <rect width="8" height="22" fill={ink} opacity="0.45" />
      <rect width="22" height="8" fill={ink} opacity="0.45" />
      <rect x="15" width="1" height="22" fill={ink} opacity="0.8" />
    </pattern>
  );
}
