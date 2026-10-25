// Aperçu des scènes de l'accueil : node scripts/renders/preview.mjs <dossier> scene:p:bg:w:h ...
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const { chromium } = createRequire(import.meta.url)("playwright");
const root = fileURLToPath(new URL(".", import.meta.url));
const [out, ...shots] = process.argv.slice(2);
const server = await createServer({ root, logLevel: "error", server: { port: 5198 } });
await server.listen();
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
await mkdir(out, { recursive: true });
for (const shot of shots) {
  const [scene, p = "0.5", bg = "", w = "1200", h = "800"] = shot.split(":");
  const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } });
  page.on("pageerror", (e) => console.error("Erreur :", e.message));
  await page.goto(`http://localhost:5198/?scene=${scene}&p=${p}&w=${w}&h=${h}${bg ? `&bg=%23${bg}` : ""}`);
  await page.waitForSelector("body[data-ready='1']", { timeout: 60_000 });
  await writeFile(`${out}/${scene}-${p}.png`, await page.locator("canvas").screenshot());
  await page.close();
  console.log(shot);
}
await browser.close();
await server.close();
