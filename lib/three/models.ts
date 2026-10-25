import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import * as M from "./materials";

// Modèles 3D dessinés en code : profils tournés (LatheGeometry), tubes le long de courbes, boîtes arrondies.
// Unité : environ 10 cm. Chaque modèle est posé sur y = 0, centré en x et z.

const v2 = (x: number, y: number) => new THREE.Vector2(x, y);
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

function meshOf(geometry: THREE.BufferGeometry, material: THREE.Material, name?: string) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  if (name) mesh.name = name;
  return mesh;
}

// Après une déformation, la couture du tour (premier et dernier méridien) reçoit deux normales différentes :
// on les moyenne pour qu'aucune arête ne se voie.
function closeSeam(geometry: THREE.BufferGeometry, points: number, segments: number) {
  const normal = geometry.attributes.normal;
  for (let j = 0; j < points; j++) {
    const a = j;
    const b = segments * points + j;
    const x = normal.getX(a) + normal.getX(b);
    const y = normal.getY(a) + normal.getY(b);
    const z = normal.getZ(a) + normal.getZ(b);
    const len = Math.hypot(x, y, z) || 1;
    normal.setXYZ(a, x / len, y / len, z / len);
    normal.setXYZ(b, x / len, y / len, z / len);
  }
  normal.needsUpdate = true;
}

const tube = (points: THREE.Vector3[], radius: number, segments = 48, radial = 8) =>
  new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), segments, radius, radial, false);

// --- Chawan : bol à bec (katakuchi) -------------------------------------------

export const BOWL_COLORS: Record<string, string> = { "Bleu acier": "#9fb1c2", "Noir mat": "#2b2d30" };
// Hauteur du thé dans le bol, pour les scènes de préparation.
export const BOWL = { teaY: 0.3, teaRadius: 0.62, rimY: 0.64 };

export function chawan(color = BOWL_COLORS["Bleu acier"]) {
  const profile = [
    v2(0, 0.02), v2(0.36, 0.02), v2(0.4, 0), v2(0.44, 0.03), v2(0.43, 0.08), v2(0.5, 0.13),
    v2(0.62, 0.24), v2(0.71, 0.38), v2(0.75, 0.52), v2(0.76, 0.62), v2(0.745, 0.645), v2(0.72, 0.63),
    v2(0.705, 0.5), v2(0.66, 0.36), v2(0.57, 0.24), v2(0.42, 0.16), v2(0.2, 0.13), v2(0, 0.125),
  ];
  const geometry = new THREE.LatheGeometry(profile, 128);
  // Le bec : on tire le haut de la paroi vers l'extérieur autour de +x, loin de la couture du tour (+z).
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const r = Math.hypot(x, z);
    const angle = Math.atan2(z, x);
    const lip = Math.exp(-((angle / 0.32) ** 2)) * THREE.MathUtils.smoothstep(y, 0.36, 0.645);
    const k = (r + 0.16 * lip) / (r || 1);
    pos.setXYZ(i, x * k, y - 0.035 * lip, z * k);
  }
  geometry.computeVertexNormals();
  closeSeam(geometry, profile.length, 128);
  const group = new THREE.Group();
  group.add(meshOf(geometry, M.ceramic(color), "bowl"));
  return group;
}

// --- Chasen : fouet en bambou ------------------------------------------------------

export function chasen(tines = 80) {
  const group = new THREE.Group();
  const handle = new THREE.LatheGeometry(
    [v2(0, 0), v2(0.1, 0), v2(0.105, 0.02), v2(0.1, 0.05), v2(0.098, 0.3), v2(0.104, 0.32), v2(0.098, 0.34), v2(0.095, 0.47), v2(0.09, 0.5), v2(0, 0.5)],
    48,
  );
  group.add(meshOf(handle, M.bamboo("warm", 0.33)));

  // Brins extérieurs : ils s'écartent en cloche puis se recourbent vers l'intérieur au sommet.
  const outer = new THREE.CatmullRomCurve3([v3(0.085, 0.48, 0), v3(0.15, 0.62, 0), v3(0.25, 0.82, 0), v3(0.29, 1.0, 0), v3(0.26, 1.12, 0), v3(0.21, 1.16, 0)]);
  const inner = new THREE.CatmullRomCurve3([v3(0.05, 0.48, 0), v3(0.07, 0.7, 0), v3(0.06, 0.9, 0), v3(0.03, 1.02, 0)]);
  const parts: THREE.BufferGeometry[] = [];
  const outerTine = new THREE.TubeGeometry(outer, 20, 0.0065, 3, false);
  const innerTine = new THREE.TubeGeometry(inner, 12, 0.006, 3, false);
  for (let i = 0; i < tines; i++) {
    parts.push(outerTine.clone().rotateY((i / tines) * Math.PI * 2));
  }
  for (let i = 0; i < tines / 5; i++) {
    parts.push(innerTine.clone().rotateY((i / (tines / 5)) * Math.PI * 2 + 0.2));
  }
  group.add(meshOf(mergeGeometries(parts), M.bamboo("light")));
  // Le fil noir qui sépare les brins, à leur base.
  group.add(meshOf(new THREE.TorusGeometry(0.12, 0.012, 8, 48).rotateX(Math.PI / 2).translate(0, 0.6, 0), M.thread()));
  return group;
}

// --- Chashaku : cuillère en bambou ---------------------------------------------------

export function chashaku() {
  // Lame plate et droite, puis courbée en bout pour former la cuillère.
  const geometry = new THREE.CylinderGeometry(0.07, 0.07, 1.8, 12, 60, false).rotateZ(Math.PI / 2);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    let y = pos.getY(i) * 0.3;
    const z = pos.getZ(i) * (1.25 + 0.35 * THREE.MathUtils.smoothstep(x, 0.55, 0.9));
    const t = THREE.MathUtils.smoothstep(x, 0.55, 0.9);
    y += 0.12 * t * t + 0.02 * Math.cos((x / 0.9) * Math.PI);
    // Creux de la cuillère : le dessus s'enfonce au centre.
    if (y > 0) y -= 0.025 * t * Math.max(0, 1 - Math.abs(z) / 0.09);
    pos.setXYZ(i, x, y, z);
  }
  geometry.computeVertexNormals();
  geometry.translate(0, 0.05, 0);
  const group = new THREE.Group();
  group.add(meshOf(geometry, M.bamboo("warm")));
  // Le nœud du bambou, au tiers de la longueur.
  group.add(meshOf(new THREE.BoxGeometry(0.025, 0.05, 0.18).translate(-0.12, 0.05, 0), M.bamboo("warm", 0.5)));
  return group;
}

// --- Furui : tamis à manche -------------------------------------------------------------

export function furui() {
  const group = new THREE.Group();
  const r = 0.42;
  const basket = new THREE.SphereGeometry(r, 48, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2.4);
  group.add(meshOf(basket.translate(0, r, 0), M.mesh()));
  group.add(meshOf(new THREE.TorusGeometry(r, 0.016, 10, 64).rotateX(Math.PI / 2).translate(0, r, 0), M.steel()));
  // Deux fils parallèles pour le manche, un crochet de l'autre côté pour poser le tamis sur le bol.
  for (const z of [-0.05, 0.05]) {
    group.add(meshOf(tube([v3(r - 0.02, r, z), v3(r + 0.3, r + 0.03, z * 1.4), v3(r + 0.75, r + 0.06, z * 1.6)], 0.011, 24, 6), M.steel()));
  }
  group.add(meshOf(tube([v3(r + 0.75, r + 0.06, -0.08), v3(r + 0.82, r + 0.065, 0), v3(r + 0.75, r + 0.06, 0.08)], 0.011, 12, 6), M.steel()));
  group.add(meshOf(tube([v3(-r + 0.02, r, -0.04), v3(-r - 0.22, r + 0.01, -0.04), v3(-r - 0.22, r + 0.01, 0.04), v3(-r + 0.02, r, 0.04)], 0.011, 24, 6), M.steel()));
  return group;
}

// --- Kusenaoshi : support de fouet ---------------------------------------------------

export function kusenaoshi() {
  const group = new THREE.Group();
  const body = new THREE.LatheGeometry(
    [v2(0, 0.02), v2(0.23, 0.02), v2(0.26, 0.05), v2(0.21, 0.12), v2(0.16, 0.25), v2(0.18, 0.4), v2(0.17, 0.5), v2(0.12, 0.58), v2(0.06, 0.62), v2(0, 0.63)],
    64,
  );
  group.add(meshOf(body, M.ceramic("#b9c6d3")));
  group.add(meshOf(new THREE.CylinderGeometry(0.27, 0.27, 0.02, 64).translate(0, 0.01, 0), M.ceramic("#7ba33a")));
  return group;
}

// --- Boîte à matcha -----------------------------------------------------------------

export const TIN_LABELS: Record<string, { grade: string; grams: string; dark: boolean }> = {
  "tin-ceremonie": { grade: "Cérémonie", grams: "30 G — 100 G", dark: false },
  "tin-recolte": { grade: "Première récolte", grams: "20 G", dark: true },
  "tin-quotidien": { grade: "Quotidien", grams: "30 G — 100 G", dark: false },
  "tin-latte": { grade: "Latte", grams: "30 G — 100 G", dark: false },
};

export function tin(label?: { grade: string; grams: string; dark: boolean }) {
  const group = new THREE.Group();
  const metal = label?.dark ? M.steel("dark") : M.steel();
  // L'étiquette commence face à +x : on la tourne vers la vue de trois quarts des rendus (30°).
  const body = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 64, 1, true).rotateY(-Math.PI / 3).translate(0, 0.25, 0);
  group.add(meshOf(body, label ? M.tinLabel(label.grade, label.grams, label.dark) : metal));
  group.add(meshOf(new THREE.CircleGeometry(0.3, 64).rotateX(Math.PI / 2).translate(0, 0.001, 0), metal));
  // Profil décrit de bas en haut : les faces regardent vers l'extérieur.
  const lid = new THREE.LatheGeometry([v2(0.302, 0.465), v2(0.312, 0.47), v2(0.312, 0.64), v2(0.305, 0.655), v2(0.29, 0.66), v2(0, 0.66)], 64);
  group.add(meshOf(lid, metal));
  return group;
}

// --- Bouilloire à col de cygne ---------------------------------------------------

export function kettle() {
  const group = new THREE.Group();
  const body = new THREE.LatheGeometry(
    [v2(0, 0.01), v2(0.42, 0.01), v2(0.46, 0.04), v2(0.47, 0.1), v2(0.47, 0.56), v2(0.44, 0.64), v2(0.34, 0.7), v2(0.2, 0.72), v2(0.2, 0.74), v2(0, 0.74)],
    64,
  );
  group.add(meshOf(body, M.blackMetal()));
  group.add(meshOf(new THREE.LatheGeometry([v2(0, 0.84), v2(0.05, 0.83), v2(0.06, 0.79), v2(0.04, 0.74), v2(0, 0.74)], 32), M.blackMetal()));
  // Thermomètre sur le couvercle.
  group.add(meshOf(new THREE.CylinderGeometry(0.07, 0.07, 0.03, 32).translate(0.13, 0.735, 0.1), M.steel()));
  // Col de cygne : part du bas, monte, puis s'avance vers l'avant.
  group.add(meshOf(tube([v3(0.42, 0.12, 0), v3(0.62, 0.18, 0), v3(0.72, 0.42, 0), v3(0.76, 0.66, 0), v3(0.86, 0.76, 0), v3(0.98, 0.77, 0)], 0.032, 64, 12), M.blackMetal()));
  // Anse en arceau au-dessus du couvercle.
  group.add(meshOf(tube([v3(-0.3, 0.68, 0), v3(-0.32, 0.98, 0), v3(0, 1.12, 0), v3(0.32, 0.98, 0), v3(0.3, 0.68, 0)], 0.022, 64, 10), M.blackMetal()));
  return group;
}

// --- Verre double paroi, avec un latte -----------------------------------------------

export function latteGlass(filled = true) {
  const group = new THREE.Group();
  const wall = new THREE.LatheGeometry([v2(0, 0.01), v2(0.27, 0.01), v2(0.3, 0.05), v2(0.31, 0.9), v2(0.3, 0.92), v2(0.27, 0.9), v2(0.26, 0.12), v2(0, 0.12)], 64);
  group.add(meshOf(wall, M.glass()));
  if (filled) {
    group.add(meshOf(new THREE.CylinderGeometry(0.255, 0.255, 0.42, 48).translate(0, 0.33, 0), M.milk()));
    group.add(meshOf(new THREE.CylinderGeometry(0.256, 0.256, 0.2, 48).translate(0, 0.64, 0), M.tea()));
    group.add(meshOf(new THREE.CylinderGeometry(0.257, 0.257, 0.05, 48).translate(0, 0.765, 0), M.froth()));
  }
  return group;
}

// --- Le Coffre : valise en aluminium -------------------------------------------------

export const CASE = { width: 3.8, depth: 2.6, height: 0.42 };

export function suitcase(open = 1) {
  const group = new THREE.Group();
  const { width, depth, height } = CASE;
  const shell = new RoundedBoxGeometry(width, height, depth, 4, 0.08).translate(0, height / 2, 0);
  group.add(meshOf(shell, M.steel()));
  const lining = new THREE.BoxGeometry(width - 0.16, 0.02, depth - 0.16).translate(0, height + 0.001, 0);
  group.add(meshOf(lining, M.foam()));
  // Couvercle articulé sur l'arête arrière ; open = 1 l'ouvre à 105°.
  const lid = new THREE.Group();
  lid.name = "lid";
  lid.position.set(0, height, -depth / 2);
  const lidShell = new RoundedBoxGeometry(width, 0.22, depth, 4, 0.08).translate(0, 0.11, depth / 2);
  lid.add(meshOf(lidShell, M.steel()));
  lid.add(meshOf(new THREE.BoxGeometry(width - 0.16, 0.02, depth - 0.16).translate(0, -0.002, depth / 2), M.foam()));
  lid.rotation.x = -THREE.MathUtils.degToRad(105) * open;
  group.add(lid);
  // Poignée et fermoirs à l'avant.
  group.add(meshOf(tube([v3(-0.4, 0.2, depth / 2), v3(-0.36, 0.2, depth / 2 + 0.16), v3(0.36, 0.2, depth / 2 + 0.16), v3(0.4, 0.2, depth / 2)], 0.035, 32, 10), M.blackMetal()));
  for (const x of [-1.1, 1.1]) group.add(meshOf(new RoundedBoxGeometry(0.22, 0.16, 0.05, 2, 0.02).translate(x, height - 0.06, depth / 2 + 0.02), M.steel("dark")));
  return group;
}

// --- Compositions ---------------------------------------------------------------------

type Placed = { object: THREE.Object3D; x: number; z: number; rotY?: number; y?: number; rotX?: number; rotZ?: number; scale?: number };

function arrange(items: Placed[]) {
  const group = new THREE.Group();
  for (const { object, x, z, y = 0, rotY = 0, rotX = 0, rotZ = 0, scale = 1 } of items) {
    object.position.set(x, y, z);
    object.rotation.set(rotX, rotY, rotZ);
    object.scale.setScalar(scale);
    group.add(object);
  }
  return group;
}

export function kit(name: "kit-essentiel" | "kit-latte" | "kit-complet", bowlColor?: string) {
  if (name === "kit-complet") {
    return arrange([
      { object: chawan(bowlColor), x: -0.55, z: -0.25, rotY: 0.6 },
      { object: kusenaoshi(), x: 0.55, z: -0.45 },
      { object: chasen(100), x: 0.55, z: -0.45, y: 1.45, rotX: Math.PI, scale: 0.8 },
      { object: tin(TIN_LABELS["tin-ceremonie"]), x: 1.25, z: 0.2, rotY: -0.5 },
      { object: furui(), x: -0.6, z: 0.75, rotY: 0.3, scale: 0.85 },
      { object: chashaku(), x: 0.45, z: 0.75, rotY: -0.2, scale: 0.8 },
    ]);
  }
  const latte = name === "kit-latte";
  return arrange([
    { object: chasen(80), x: -0.7, z: -0.2 },
    { object: tin(TIN_LABELS[latte ? "tin-latte" : "tin-quotidien"]), x: 0.05, z: -0.35, rotY: -0.4 },
    ...(latte ? [{ object: latteGlass(), x: 0.75, z: -0.15 }] : []),
    { object: furui(), x: -0.25, z: 0.65, rotY: 0.4, scale: 0.85 },
    { object: chashaku(), x: 0.5, z: 0.6, rotY: -0.3, scale: 0.8 },
  ]);
}

// Le contenu du coffre, couché dans la mousse.
export function coffre(open = 1) {
  const group = suitcase(open);
  const h = CASE.height;
  // Ordre des pièces = ordre des étiquettes de l'accueil (VAULT_PIECES).
  const inside = arrange([
    { object: chawan(), x: -1.05, z: 0.25, y: h - 0.2 },
    { object: chasen(100), x: 0.05, z: 0.35, y: h - 0.04, rotZ: Math.PI / 2, rotY: 0.15, scale: 0.85 },
    { object: kusenaoshi(), x: 0.5, z: -0.6, y: h - 0.12, scale: 0.8 },
    { object: tin(TIN_LABELS["tin-ceremonie"]), x: 1.45, z: -0.75, y: h - 0.2, rotY: -0.6, scale: 0.85 },
    { object: tin(TIN_LABELS["tin-quotidien"]), x: 1.45, z: 0.05, y: h - 0.2, rotY: -0.6, scale: 0.85 },
    { object: tin(), x: 1.45, z: 0.85, y: h - 0.2, scale: 0.85 },
    { object: chashaku(), x: -0.45, z: -0.85, y: h - 0.01 },
    { object: furui(), x: 0.55, z: 0.95, y: h - 0.38, rotY: Math.PI, scale: 0.75 },
    // La bouilloire ne tient pas dans la valise : elle attend à côté.
    { object: kettle(), x: CASE.width / 2 + 0.85, z: -0.2, rotY: -2.4, scale: 0.9 },
  ]);
  inside.name = "contents";
  group.add(inside);
  return group;
}

// Clé du modèle (colonne products.model) vers sa construction.
// variant : le coloris choisi, « Noir mat » pour le bol ou « Bol noir mat » pour le kit qui le contient.
export function buildModel(key: string, variant?: string): THREE.Object3D {
  const bowl = variant ? BOWL_COLORS[variant.replace(/^Bol (.)/, (_, c: string) => c.toUpperCase())] : undefined;
  if (key.startsWith("tin-")) return tin(TIN_LABELS[key]);
  switch (key) {
    case "chawan":
      return chawan(bowl);
    case "chasen":
      return chasen(80);
    case "chasen-100":
      return chasen(100);
    case "chashaku":
      return chashaku();
    case "furui":
      return furui();
    case "kusenaoshi":
      return kusenaoshi();
    case "kettle":
      return kettle();
    case "tin":
      return tin();
    case "glass":
      return latteGlass();
    case "coffre":
      return coffre();
    case "kit-essentiel":
    case "kit-latte":
    case "kit-complet":
      return kit(key, bowl);
    default:
      return tin();
  }
}
