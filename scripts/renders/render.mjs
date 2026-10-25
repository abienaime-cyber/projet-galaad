// Photographie chaque modèle 3D du catalogue en PNG transparent, dans public/renders.
// Lancer : node scripts/renders/render.mjs   (Chromium de Playwright, serveur Vite le temps du rendu)
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { createServer } from "vite";

// Playwright est installé hors du projet (Chromium préinstallé) : require le trouve, import non.
const { chromium } = createRequire(import.meta.url)("playwright");

const root = fileURLToPath(new URL(".", import.meta.url));
const out = fileURLToPath(new URL("../../public/renders/", import.meta.url));

// Vue de trois quarts par défaut ; les objets longs et plats sont vus de plus haut.
const SHOTS = [
  ["kit-essentiel", { elevation: 32 }],
  ["kit-latte", { elevation: 32 }],
  ["kit-complet", { elevation: 32 }],
  ["coffre", { elevation: 42, azimuth: 18 }],
  ["tin-ceremonie"],
  ["tin-recolte"],
  ["tin-quotidien"],
  ["tin-latte"],
  ["chasen"],
  ["chasen-100"],
  ["chawan"],
  ["chashaku", { elevation: 40, azimuth: 20 }],
  ["furui", { elevation: 34 }],
  ["kusenaoshi"],
  ["kettle", { azimuth: 40 }],
  ["tin"],
  ["glass"],
];

// Étapes du protocole, pour l’accueil en mouvement réduit, et image de partage (plaque gravée) :
// partage.png se convertit ensuite en app/opengraph-image.jpg.
const SCENES = [
  ["protocole-1", { scene: "protocol", p: 0.2, w: 900, h: 600 }],
  ["protocole-2", { scene: "protocol", p: 0.42, w: 900, h: 600 }],
  ["protocole-3", { scene: "protocol", p: 0.66, w: 900, h: 600 }],
  ["protocole-4", { scene: "protocol", p: 0.95, w: 900, h: 600 }],
  ["partage", { scene: "plate", w: 1200, h: 630, bg: "#0b0c0d" }],
];

const server = await createServer({ root, logLevel: "error", server: { port: 5199 } });
await server.listen();
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1200, height: 1200 } });
page.on("pageerror", (e) => console.error("Erreur de page :", e.message));
await mkdir(out, { recursive: true });

for (const [model, view = {}] of SHOTS) {
  const query = new URLSearchParams({ model, ...Object.fromEntries(Object.entries(view).map(([k, v]) => [k, String(v)])) });
  await page.goto(`http://localhost:5199/?${query}`);
  await page.waitForSelector("body[data-ready='1']", { timeout: 60_000 });
  const png = await page.locator("canvas").screenshot({ omitBackground: true });
  await writeFile(`${out}${model}.png`, png);
  console.log(`rendu : public/renders/${model}.png`);
}

for (const [name, { w, h, ...query }] of SCENES) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(`http://localhost:5199/?${new URLSearchParams({ ...query, w: String(w), h: String(h) })}`);
  await page.waitForSelector("body[data-ready='1']", { timeout: 60_000 });
  await writeFile(`${out}${name}.png`, await page.locator("canvas").screenshot({ omitBackground: !query.bg }));
  console.log(`rendu : public/renders/${name}.png`);
}

await browser.close();
await server.close();
