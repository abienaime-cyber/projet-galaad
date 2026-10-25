import * as THREE from "three";
import * as M from "../materials";
import { tin, TIN_LABELS } from "../models";

// Chaîne de production : 6 000 grains qui forment une feuille, puis des brisures, tournent autour de la meule,
// et finissent dans la boîte. p de 0 à 1 : feuille (0), tencha (1/3), meule (2/3), boîte (1).

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const smooth = (t: number) => {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
};

const COUNT = 6000;

function granite() {
  const rand = M.seeded(41);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#8d9399";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 2600; i++) {
    const v = Math.floor(60 + rand() * 150);
    ctx.fillStyle = `rgb(${v},${v + 4},${v + 8})`;
    ctx.fillRect(rand() * 256, rand() * 256, rand() * 3 + 0.5, rand() * 3 + 0.5);
  }
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  return new THREE.MeshStandardMaterial({ map, roughness: 0.9 });
}

export function chainScene() {
  const root = new THREE.Group();
  const rand = M.seeded(9);
  const stages = [0, 1, 2, 3].map(() => new Float32Array(COUNT * 3));
  const delay = new Float32Array(COUNT);
  const colors = [new THREE.Color("#2f6b1a"), new THREE.Color("#4d7d22"), new THREE.Color("#8fbf3a"), new THREE.Color("#9ccc45")];

  for (let i = 0; i < COUNT; i++) {
    const k = i * 3;
    // Feuille : un contour en amande face à la caméra, inclinée, bombée le long de la nervure.
    const u = rand() * 2 - 1;
    const half = 0.48 * Math.pow(1 - u * u, 0.75) * (1 + 0.18 * u);
    const v = (rand() * 2 - 1) * half;
    const along = u * 1.3;
    stages[0].set([along * 0.9 - v * 0.42, 1.0 + along * 0.42 + v * 0.9, 0.3 * (1 - u * u) - 0.25 * v * v], k);
    // Tencha : des brisures plates en tas.
    const flake = Math.floor(rand() * 70);
    const fr = M.seeded(flake + 100);
    const fa = fr() * Math.PI * 2;
    const fd = Math.sqrt(fr()) * 0.85;
    stages[1].set([Math.cos(fa) * fd + (rand() - 0.5) * 0.12, 0.08 + fr() * 0.35 * (1 - fd) + (rand() - 0.5) * 0.02, Math.sin(fa) * fd + (rand() - 0.5) * 0.12], k);
    // Meule : un anneau de poudre autour de la pierre.
    const ma = rand() * Math.PI * 2;
    const mr = 0.78 + rand() * 0.28;
    stages[2].set([Math.cos(ma) * mr, 0.04 + rand() * 0.05 + Math.max(0, 0.9 - mr) * 0.2, Math.sin(ma) * mr], k);
    // Boîte : le volume intérieur.
    const ta = rand() * Math.PI * 2;
    const tr = Math.sqrt(rand()) * 0.27;
    stages[3].set([Math.cos(ta) * tr, 0.05 + rand() * 0.4, Math.sin(ta) * tr], k);
    delay[i] = rand();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  const grains = new THREE.Points(geometry, new THREE.PointsMaterial({ size: 0.034, vertexColors: true, sizeAttenuation: true }));
  root.add(grains);

  // La meule de pierre : deux disques, celui du dessus tourne.
  const mill = new THREE.Group();
  const stone = granite();
  mill.add(new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.66, 0.26, 48).translate(0, 0.13, 0), stone));
  const runner = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.6, 0.3, 48).translate(0, 0.42, 0), stone);
  mill.add(runner);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.45, 12).translate(0.45, 0.78, 0), M.bamboo("warm"));
  runner.add(handle);
  root.add(mill);

  const box = tin(TIN_LABELS["tin-quotidien"]);
  root.add(box);
  const lid = box.children[2];

  const color = new THREE.Color();

  function apply(p: number, camera?: THREE.PerspectiveCamera) {
    const s = clamp01(p) * 3;
    const stage = Math.min(2, Math.floor(s));
    const f = s - stage;
    const pos = geometry.attributes.position as THREE.BufferAttribute;
    const col = geometry.attributes.color as THREE.BufferAttribute;
    const from = stages[stage];
    const to = stages[stage + 1];
    const spin = p * Math.PI * 4;
    for (let i = 0; i < COUNT; i++) {
      const k = i * 3;
      const t = smooth(f * 1.5 - delay[i] * 0.5);
      // Pendant le passage, chaque grain décrit un arc vers le haut.
      const lift = Math.sin(Math.PI * t) * (0.35 + delay[i] * 0.4);
      let x = from[k] + (to[k] - from[k]) * t;
      const y = from[k + 1] + (to[k + 1] - from[k + 1]) * t + lift;
      let z = from[k + 2] + (to[k + 2] - from[k + 2]) * t;
      // Autour de la meule, l'anneau tourne avec le défilement.
      if (stage === 1 && t > 0.5) {
        const a = spin * (0.3 + 0.7 * delay[i]) * (t - 0.5) * 2;
        [x, z] = [x * Math.cos(a) - z * Math.sin(a), x * Math.sin(a) + z * Math.cos(a)];
      }
      pos.setXYZ(i, x, y, z);
      color.copy(colors[stage]).lerp(colors[stage + 1], t);
      col.setXYZ(i, color.r, color.g, color.b);
    }
    pos.needsUpdate = col.needsUpdate = true;

    const millIn = smooth((s - 1.2) / 0.6) * (1 - smooth((s - 2.3) / 0.5));
    mill.visible = millIn > 0.01;
    mill.scale.setScalar(0.3 + 0.7 * millIn);
    mill.position.y = -0.6 * (1 - millIn);
    runner.rotation.y = spin * 2;

    const tinIn = smooth((s - 2.3) / 0.5);
    box.visible = tinIn > 0.01;
    box.scale.setScalar(tinIn);
    lid.position.y = 0.55 * (1 - smooth((s - 2.75) / 0.25));
    grains.visible = s < 2.98;

    if (camera) {
      const az = THREE.MathUtils.degToRad(-20 + 40 * p);
      const dist = (4.4 - 0.8 * smooth((s - 2.2) / 0.8)) * Math.max(1, 1.1 / camera.aspect);
      camera.position.set(Math.sin(az) * dist, 1.5 + 0.5 * p, Math.cos(az) * dist);
      camera.lookAt(0, 0.8 - 0.5 * smooth(s / 1.2), 0);
    }
  }

  return { root, apply };
}
