import * as THREE from "three";

// Matières des objets 3D. Les textures sont dessinées au canvas : aucun fichier image à charger.

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, color = true) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  if (color) texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

// Générateur pseudo-aléatoire à graine (mulberry32) : la même texture à chaque rendu,
// et des suites bien différentes pour deux graines voisines.
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Polices des textures dessinées : la page passe ses familles next/font, le studio garde les noms simples.
export const FONTS = { display: "'Barlow Condensed', 'Arial Narrow', sans-serif", mono: "'Fragment Mono', monospace" };

const cache = new Map<string, THREE.Material>();
const once = <T extends THREE.Material>(key: string, make: () => T): T => {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key) as T;
};

// Grès émaillé : fond uni, mouchetures sombres et claires.
export const ceramic = (color: string) =>
  once(`ceramic-${color}`, () => {
    const rand = seeded(7);
    const map = canvasTexture(512, 512, (ctx) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 1400; i++) {
        ctx.fillStyle = rand() > 0.5 ? "rgba(255,255,255,0.18)" : "rgba(20,30,40,0.16)";
        ctx.beginPath();
        ctx.arc(rand() * 512, rand() * 512, rand() * 1.6 + 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    map.repeat.set(3, 1);
    return new THREE.MeshPhysicalMaterial({ map, roughness: 0.62, clearcoat: 0.35, clearcoatRoughness: 0.5 });
  });

// Bambou : fibres verticales, un nœud plus sombre.
export const bamboo = (tone: "light" | "warm" = "warm", node?: number) =>
  once(`bamboo-${tone}-${node ?? "none"}`, () => {
    const base = tone === "light" ? "#e9d8b4" : "#d4b083";
    const rand = seeded(11);
    const map = canvasTexture(256, 512, (ctx) => {
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, 256, 512);
      for (let i = 0; i < 160; i++) {
        ctx.strokeStyle = `rgba(${rand() > 0.5 ? "120,80,40" : "255,240,210"},${0.05 + rand() * 0.1})`;
        ctx.lineWidth = rand() * 2 + 0.5;
        const x = rand() * 256;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + (rand() - 0.5) * 6, 512);
        ctx.stroke();
      }
      if (node !== undefined) {
        const y = node * 512;
        const g = ctx.createLinearGradient(0, y - 14, 0, y + 14);
        g.addColorStop(0, "rgba(90,55,25,0)");
        g.addColorStop(0.5, "rgba(90,55,25,0.55)");
        g.addColorStop(1, "rgba(90,55,25,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, y - 14, 256, 28);
      }
    });
    return new THREE.MeshStandardMaterial({ map, roughness: 0.55 });
  });

// Acier brossé : rayures fines dans la carte de rugosité.
export const steel = (tone: "bright" | "dark" = "bright") =>
  once(`steel-${tone}`, () => {
    const rand = seeded(23);
    const roughnessMap = canvasTexture(
      512,
      64,
      (ctx) => {
        ctx.fillStyle = "#6a6a6a";
        ctx.fillRect(0, 0, 512, 64);
        for (let i = 0; i < 300; i++) {
          const v = 80 + Math.floor(rand() * 90);
          ctx.fillStyle = `rgb(${v},${v},${v})`;
          ctx.fillRect(0, rand() * 64, 512, rand() * 1.2 + 0.2);
        }
      },
      false,
    );
    return new THREE.MeshStandardMaterial({
      color: tone === "bright" ? "#d5dbe1" : "#8e969f",
      metalness: 1,
      roughness: 0.42,
      roughnessMap,
    });
  });

export const blackMetal = () => once("black-metal", () => new THREE.MeshPhysicalMaterial({ color: "#151617", metalness: 0.55, roughness: 0.42, clearcoat: 0.3, clearcoatRoughness: 0.6 }));

export const thread = () => once("thread", () => new THREE.MeshStandardMaterial({ color: "#1d1d1d", roughness: 0.8 }));

export const foam = () => once("foam", () => new THREE.MeshStandardMaterial({ color: "#151515", roughness: 1 }));

// Poudre, thé et mousse : trois verts.
export const POWDER = "#7ba33a";
export const powder = () => once("powder", () => new THREE.MeshStandardMaterial({ color: POWDER, roughness: 1 }));
export const tea = () => once("tea", () => new THREE.MeshPhysicalMaterial({ color: "#5f8f22", roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.15 }));
export const froth = () =>
  once("froth", () => {
    const rand = seeded(31);
    const map = canvasTexture(256, 256, (ctx) => {
      ctx.fillStyle = "#a5c35a";
      ctx.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) {
        ctx.fillStyle = `rgba(${rand() > 0.5 ? "230,240,190" : "120,150,50"},${0.15 + rand() * 0.25})`;
        ctx.beginPath();
        ctx.arc(rand() * 256, rand() * 256, rand() * 2.4 + 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    return new THREE.MeshStandardMaterial({ map, roughness: 0.85 });
  });

export const milk = () => once("milk", () => new THREE.MeshStandardMaterial({ color: "#f1efe6", roughness: 0.5 }));

export const glass = () =>
  once("glass", () => new THREE.MeshPhysicalMaterial({ color: "#ffffff", roughness: 0.04, transmission: 1, thickness: 0.08, ior: 1.5, transparent: true, opacity: 1 }));

// Maille du tamis : un quadrillage dont les trous sont transparents.
export const mesh = () =>
  once("mesh", () => {
    const alphaMap = canvasTexture(
      256,
      256,
      (ctx) => {
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, 256, 256);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.4;
        for (let i = 0; i <= 256; i += 4) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i, 256);
          ctx.moveTo(0, i);
          ctx.lineTo(256, i);
          ctx.stroke();
        }
      },
      false,
    );
    alphaMap.repeat.set(6, 3);
    return new THREE.MeshStandardMaterial({ color: "#c9cfd6", metalness: 0.9, roughness: 0.35, alphaMap, transparent: true, side: THREE.DoubleSide, alphaTest: 0.3 });
  });

// Étiquette de boîte : nom de la marque, grade et poids, en capitales.
export function tinLabel(grade: string, grams: string, dark: boolean) {
  return once(`label-${grade}-${grams}-${dark}`, () => {
    const ink = dark ? "#e8ecef" : "#2a2f35";
    // Deux fois la même étiquette autour de la boîte : une face entière est toujours visible.
    const map = canvasTexture(1024, 256, (ctx) => {
      ctx.fillStyle = dark ? "#26292c" : "#cfd5db";
      ctx.fillRect(0, 0, 1024, 256);
      ctx.textBaseline = "middle";
      for (const x0 of [0, 512]) {
        ctx.fillStyle = ink;
        ctx.font = `700 58px ${FONTS.display}`;
        ctx.fillText("CONTREBANDE", x0 + 70, 84, 380);
        ctx.font = `400 21px ${FONTS.mono}`;
        ctx.fillText(`MATCHA ${grade.toUpperCase()}`, x0 + 72, 150, 380);
        ctx.fillText(grams, x0 + 72, 186, 300);
        ctx.fillStyle = "#8fd14f";
        ctx.fillRect(x0 + 72, 214, 120, 8);
      }
    });
    return new THREE.MeshStandardMaterial({ map, metalness: 0.75, roughness: 0.38 });
  });
}

// Plaque gravée de l'accueil : relief tiré du texte, en carte de bosselage.
export function plateBump(lines: { text: string; font: string; x: number; y: number }[], w = 2048, h = 1024) {
  return canvasTexture(
    w,
    h,
    (ctx) => {
      ctx.fillStyle = "#808080";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ffffff";
      ctx.textBaseline = "middle";
      for (const line of lines) {
        ctx.font = line.font;
        ctx.fillText(line.text, line.x * w, line.y * h);
      }
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.strokeRect(w * 0.025, h * 0.05, w * 0.95, h * 0.9);
    },
    false,
  );
}
