import * as THREE from "three";
import * as M from "../materials";
import { BOWL, chasen, chawan, furui, kettle } from "../models";

// Protocole de préparation, piloté par une progression p de 0 à 1 (le défilement) :
// 0 à 0,25 tamiser, 0,25 à 0,5 verser, 0,5 à 0,75 fouetter, 0,75 à 1 servir.
// Tout est une fonction de p : on peut remonter la page, la scène se défait image par image.

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOut = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};
const window01 = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export function protocolScene() {
  const root = new THREE.Group();

  const bowl = chawan();
  root.add(bowl);

  // Le thé dans le bol : un disque qui monte quand l'eau arrive.
  const tea = new THREE.Mesh(new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2), M.tea());
  root.add(tea);
  const froth = new THREE.Mesh(new THREE.CircleGeometry(1, 64).rotateX(-Math.PI / 2), M.froth());
  root.add(froth);
  // Le tas de poudre au fond, avant l'eau.
  const pile = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2), M.powder());
  root.add(pile);

  const sieve = furui();
  sieve.scale.setScalar(0.9);
  root.add(sieve);
  const mound = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 0.45, 1), M.powder());
  sieve.add(mound);

  // La poudre qui traverse le tamis : chaque grain a sa fenêtre de chute.
  const COUNT = 900;
  const rand = M.seeded(5);
  const starts = new Float32Array(COUNT * 3);
  const ends = new Float32Array(COUNT * 3);
  const delays = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const a = rand() * Math.PI * 2;
    const r = Math.sqrt(rand()) * 0.22;
    starts.set([Math.cos(a) * r, 0, Math.sin(a) * r], i * 3);
    const r2 = Math.sqrt(rand()) * 0.25;
    ends.set([Math.cos(a) * r2, 0.16 + rand() * 0.04, Math.sin(a) * r2], i * 3);
    delays[i] = rand() * 0.7;
  }
  const grains = new THREE.BufferGeometry();
  grains.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
  const dust = new THREE.Points(grains, new THREE.PointsMaterial({ color: M.POWDER, size: 0.018, sizeAttenuation: true }));
  root.add(dust);

  const pot = kettle();
  pot.scale.setScalar(0.95);
  root.add(pot);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 1, 12, 1, true), new THREE.MeshPhysicalMaterial({ color: "#dfeaf5", roughness: 0.05, transmission: 0.6, transparent: true, opacity: 0.75 }));
  root.add(stream);

  const whisk = chasen(100);
  whisk.scale.setScalar(0.62);
  root.add(whisk);

  const spoutTip = new THREE.Vector3();
  const target = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  function apply(p: number, camera?: THREE.PerspectiveCamera) {
    const sift = window01(p, 0, 0.25);
    const pour = window01(p, 0.25, 0.5);
    const whiskT = window01(p, 0.5, 0.75);
    const serve = window01(p, 0.75, 1);

    // 1. Tamiser : le tamis descend sur le bol, la poudre passe, le tas grossit.
    const sieveIn = ease(sift * 3);
    const sieveOut = ease(pour * 4);
    sieve.position.set(-0.05, 1.4 - 0.62 * sieveIn + 1.6 * sieveOut, 0);
    sieve.rotation.set(0, 0.6, Math.sin(sift * 40) * 0.03 * (sift < 1 ? 1 : 0));
    sieve.visible = sieveOut < 1;
    mound.scale.set(1, Math.max(0.02, 1 - sift), 1);
    mound.position.y = 0.2;

    const pos = grains.attributes.position as THREE.BufferAttribute;
    const sieveY = sieve.position.y + 0.06;
    for (let i = 0; i < COUNT; i++) {
      const t = ease((sift - delays[i] * 0.85) / 0.3);
      const k = i * 3;
      pos.setXYZ(i, starts[k] + (ends[k] - starts[k]) * t - 0.05, sieveY + (ends[k + 1] - sieveY) * t * t, starts[k + 2] + (ends[k + 2] - starts[k + 2]) * t);
    }
    pos.needsUpdate = true;
    dust.visible = sift > 0.02 && pour < 0.05;

    const heap = clamp01(sift * 1.4);
    pile.scale.set(0.24 * heap, 0.06 * heap * (1 - ease(pour * 3)), 0.24 * heap);
    pile.position.y = BOWL.teaY - 0.17;
    pile.visible = sift > 0.05 && pour < 0.35;

    // 2. Verser : la bouilloire arrive de la droite, s'incline, l'eau remplit le bol.
    const potIn = easeInOut(pour * 2.2);
    const potOut = ease(whiskT * 3);
    pot.position.set(1.15 + 1.6 * (1 - potIn) + 1.8 * potOut, 0.62 + 0.7 * (1 - potIn), -0.1);
    pot.rotation.set(0, Math.PI, -0.62 * easeInOut((pour - 0.25) * 3) * (1 - potOut));
    pot.visible = pour > 0 && potOut < 1;

    const level = ease((pour - 0.35) / 0.55);
    const radius = BOWL.teaRadius * (0.62 + 0.38 * level);
    tea.scale.setScalar(radius);
    tea.position.y = BOWL.teaY - 0.12 + 0.12 * level;
    tea.visible = level > 0;

    const pouring = pour > 0.32 && pour < 0.95;
    stream.visible = pouring;
    if (pouring) {
      pot.updateMatrixWorld(true);
      spoutTip.set(0.98, 0.77, 0).applyMatrix4(pot.matrixWorld);
      target.set(0.15, tea.position.y, 0);
      const length = spoutTip.distanceTo(target);
      stream.scale.set(1, length, 1);
      stream.position.copy(spoutTip).add(target).multiplyScalar(0.5);
      stream.quaternion.setFromUnitVectors(up, spoutTip.clone().sub(target).normalize());
    }

    // 3. Fouetter : le fouet plonge, va et vient en M, la mousse se forme.
    const dip = easeInOut(whiskT * 4) * (1 - easeInOut(serve * 3));
    const stroke = Math.sin(whiskT * Math.PI * 22) * 0.18 * clamp01(whiskT * 6) * clamp01((1 - whiskT) * 6);
    whisk.position.set(stroke, 0.36 + 0.62 * 1.16 + 1.2 * (1 - dip), Math.sin(whiskT * Math.PI * 11) * 0.06);
    whisk.rotation.set(Math.PI, whiskT * 3, stroke * 0.6);
    whisk.visible = whiskT > 0 && serve < 0.4;

    const foam = ease((whiskT - 0.15) / 0.7);
    froth.visible = foam > 0;
    froth.scale.setScalar(radius * (0.4 + 0.6 * foam));
    froth.position.y = tea.position.y + 0.004;

    // 4. Servir : le bol pivote pour montrer son bec, la caméra s'approche.
    bowl.rotation.y = -0.3 + serve * 1.1;
    tea.rotation.y = froth.rotation.y = bowl.rotation.y;

    if (camera) {
      const el = THREE.MathUtils.degToRad(34 - 8 * easeInOut(serve));
      // Écran en hauteur (téléphone) : on recule pour garder le bol entier.
      const dist = (4.6 - 0.45 * easeInOut(serve)) * Math.max(1, 1.1 / camera.aspect);
      const az = THREE.MathUtils.degToRad(8 + 10 * p);
      camera.position.set(Math.sin(az) * Math.cos(el) * dist, 0.35 + Math.sin(el) * dist, Math.cos(az) * Math.cos(el) * dist);
      camera.lookAt(0, 0.45 - 0.1 * serve, 0);
    }
  }

  return { root, apply };
}
