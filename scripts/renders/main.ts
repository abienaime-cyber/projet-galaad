// Studio de rendu : construit un modèle ou une scène 3D (lib/three) et le photographie sur fond transparent.
// Piloté par render.mjs : /?model=<clé>&variant=<coloris>, ou /?scene=<protocol|chain|plate|goods|vault>&p=<0..1>
import * as THREE from "three";
import { buildModel } from "../../lib/three/models";
import { chainScene } from "../../lib/three/scenes/chain";
import { protocolScene } from "../../lib/three/scenes/protocol";
import { goodsScene, plateScene, vaultScene } from "../../lib/three/scenes/showcase";
import { createStage } from "../../lib/three/stage";

const params = new URLSearchParams(location.search);
const canvas = document.getElementById("c") as HTMLCanvasElement;
const w = Number(params.get("w") ?? 1200);
const h = Number(params.get("h") ?? 1200);
canvas.style.width = `${w}px`;
canvas.style.height = `${h}px`;

await document.fonts.load("700 64px 'Barlow Condensed'");
await document.fonts.load("400 26px 'Fragment Mono'");

const scene = params.get("scene");
const p = Number(params.get("p") ?? 0.5);
const stage = createStage(canvas, { preserve: true, pixelRatio: 1, shadow: scene === "protocol" ? 0 : 0.28 });
if (params.get("bg")) stage.renderer.setClearColor(params.get("bg")!, 1);

if (scene === "protocol") {
  const s = protocolScene();
  stage.scene.add(s.root);
  stage.scene.environmentIntensity = 0.45;
  s.apply(p, stage.camera);
} else if (scene === "chain") {
  const s = chainScene();
  stage.scene.add(s.root);
  s.apply(p, stage.camera);
} else if (scene === "plate") {
  const s = plateScene();
  s.root.rotation.set(-0.12, 0.25, 0);
  stage.scene.add(s.root);
  stage.ground.visible = false;
  stage.frame(s.root, { elevation: 0, azimuth: 0, margin: 1.05 });
} else if (scene === "goods") {
  const s = goodsScene();
  if (w < h) s.layout("narrow");
  stage.scene.add(s.root);
  stage.frame(s.root, { elevation: 38, azimuth: 0, margin: 0.95 });
} else if (scene === "vault") {
  const s = vaultScene();
  s.open(p);
  stage.scene.add(s.root);
  stage.frame(s.root, { elevation: 48, azimuth: 0, margin: 1.0 });
} else {
  const object = buildModel(params.get("model") ?? "chawan", params.get("variant") ?? undefined);
  stage.scene.add(object);
  stage.frame(object, {
    elevation: Number(params.get("elevation") ?? 24),
    azimuth: Number(params.get("azimuth") ?? 30),
    margin: Number(params.get("margin") ?? 1.12),
  });
}
stage.camera.updateProjectionMatrix();
stage.render();
Object.assign(window, { THREE });
document.body.dataset.ready = "1";
