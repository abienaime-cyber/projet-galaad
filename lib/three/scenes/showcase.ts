import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import * as M from "../materials";
import { CASE, chasen, chashaku, chawan, coffre, furui, kettle, kusenaoshi, tin, TIN_LABELS } from "../models";

// --- Plaque gravée de l'accueil ---------------------------------------------------------

export function plateScene() {
  const width = 3.2;
  const height = 1.3;
  const W = 2048;
  const H = Math.round((W * height) / width);
  const lines = [
    { text: "CONTREBANDE", font: `800 ${H * 0.42}px ${M.FONTS.display}`, x: 0.5, y: 0.47, align: "center" as const },
    { text: "抹茶", font: `700 ${H * 0.11}px sans-serif`, x: 0.065, y: 0.17, align: "left" as const },
    { text: "MARCHANDISE CONTRÔLÉE", font: `400 ${H * 0.05}px ${M.FONTS.mono}`, x: 0.935, y: 0.15, align: "right" as const },
    { text: "KIT MATCHA MAISON · GRADE CÉRÉMONIE · QUOTIDIEN · LATTE", font: `400 ${H * 0.045}px ${M.FONTS.mono}`, x: 0.5, y: 0.8, align: "center" as const },
    { text: "LOT CB-26", font: `400 ${H * 0.05}px ${M.FONTS.mono}`, x: 0.065, y: 0.88, align: "left" as const },
    { text: "NON TRANSFÉRABLE", font: `400 ${H * 0.05}px ${M.FONTS.mono}`, x: 0.935, y: 0.88, align: "right" as const },
  ];

  // Le texte est gravé : plus sombre dans la couleur, en creux dans le relief.
  const draw = (ink: string, ground: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = ground;
    ctx.fillRect(0, 0, W, H);
    // Brossage horizontal du métal.
    const rand = M.seeded(3);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${rand() * 0.05})`;
      ctx.fillRect(0, rand() * H, W, rand() * 2);
    }
    ctx.fillStyle = ink;
    ctx.strokeStyle = ink;
    ctx.textBaseline = "middle";
    for (const line of lines) {
      ctx.font = line.font;
      ctx.textAlign = line.align;
      ctx.fillText(line.text, line.x * W, line.y * H);
    }
    ctx.lineWidth = H * 0.008;
    ctx.strokeRect(W * 0.03, H * 0.06, W * 0.94, H * 0.88);
    ctx.beginPath();
    ctx.moveTo(W * 0.03, H * 0.7);
    ctx.lineTo(W * 0.97, H * 0.7);
    ctx.stroke();
    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  };
  const map = draw("#4c535b", "#c6cdd4");
  map.colorSpace = THREE.SRGBColorSpace;
  const bumpMap = draw("#202020", "#9a9a9a");

  const face = new THREE.MeshStandardMaterial({ map, bumpMap, bumpScale: 3, metalness: 0.95, roughness: 0.32 });
  const edge = M.steel();
  const geometry = new RoundedBoxGeometry(width, height, 0.09, 4, 0.04);
  const plate = new THREE.Mesh(geometry, [edge, edge, edge, edge, face, edge]);
  const root = new THREE.Group();
  root.add(plate);

  // Quatre rivets aux angles.
  const rivet = new THREE.SphereGeometry(0.035, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2).rotateX(Math.PI / 2);
  for (const [x, y] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const r = new THREE.Mesh(rivet, M.steel("dark"));
    r.position.set(x * (width / 2 - 0.07), y * (height / 2 - 0.07), 0.045);
    root.add(r);
  }
  return { root, width, height };
}

// --- Pièces saisies : les ustensiles posés sur la table ----------------------------------

export type Exhibit = { id: string; object: THREE.Object3D; anchor: THREE.Vector3; rest: THREE.Vector3 };

// Deux dispositions : large (ordinateur) et étroite (téléphone). x, z au sol, ancre de l'étiquette.
const LAYOUTS: Record<"wide" | "narrow", Record<string, [number, number, number, number]>> = {
  wide: {
    chawan: [-1.55, -0.35, -0.3, 0],
    tin: [1.35, 0.55, 0.4, 0.75],
    chasen: [0.15, 0.15, 0, 0.45],
    kusenaoshi: [-0.75, 0.75, 0, 0.35],
    furui: [-1.8, 1.25, 0.2, 0.45],
    kettle: [1.05, -0.75, 0.6, 0.85],
    chashaku: [-0.05, 1.55, 0.05, 0.08],
  },
  narrow: {
    chawan: [-0.65, -1.1, -0.3, 0],
    tin: [0.7, 0.5, 0.4, 0.75],
    chasen: [-0.6, 0.35, 0, 0.45],
    kusenaoshi: [0.75, -0.35, 0, 0.35],
    furui: [-0.45, 1.6, 0.2, 0.45],
    kettle: [0.55, -1.75, 0.6, 0.85],
    chashaku: [0.35, 2.45, 0.05, 0.08],
  },
};

export function goodsScene() {
  const root = new THREE.Group();
  const make: Record<string, () => THREE.Object3D> = {
    chawan: () => chawan(),
    tin: () => tin(TIN_LABELS["tin-quotidien"]),
    chasen: () => chasen(80),
    kusenaoshi: () => kusenaoshi(),
    furui: () => furui(),
    kettle: () => kettle(),
    chashaku: () => chashaku(),
  };
  const exhibits: Exhibit[] = Object.entries(make).map(([id, build]) => {
    const object = build();
    const holder = new THREE.Group();
    holder.add(object);
    root.add(holder);
    return { id, object: holder, anchor: new THREE.Vector3(), rest: new THREE.Vector3() };
  });

  function layout(kind: "wide" | "narrow") {
    for (const e of exhibits) {
      const [x, z, rot, labelY] = LAYOUTS[kind][e.id];
      e.rest.set(x, 0, z);
      e.object.position.copy(e.rest);
      e.object.rotation.y = rot;
      e.anchor.set(x, labelY, z + 0.1);
    }
  }
  layout("wide");
  return { root, exhibits, layout };
}

// --- Le Coffre -------------------------------------------------------------------------

export function vaultScene() {
  const root = coffre(0);
  const lid = root.getObjectByName("lid")!;
  const contents = root.getObjectByName("contents")!;
  // Ancres des étiquettes : juste au-dessus de chaque pièce.
  const anchors = contents.children.map((c) => {
    const box = new THREE.Box3().setFromObject(c);
    return new THREE.Vector3((box.min.x + box.max.x) / 2, box.max.y + 0.06, (box.min.z + box.max.z) / 2);
  });
  const open = (t: number) => {
    lid.rotation.x = -THREE.MathUtils.degToRad(105) * t;
  };
  return { root, anchors, open, size: CASE };
}
