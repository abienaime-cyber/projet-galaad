import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Un plateau de studio : rendu, éclairage, ombre au sol et caméra cadrée sur l'objet.
// Fond transparent : la couleur vient de la page (CSS).

export type Stage = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  key: THREE.DirectionalLight;
  ground: THREE.Mesh;
  render: () => void;
  resize: () => void;
  frame: (object: THREE.Object3D, view?: View) => void;
  dispose: () => void;
};

export type View = { elevation?: number; azimuth?: number; margin?: number; fov?: number };

// Le navigateur limite le nombre de contextes WebGL ouverts : le test n'en ouvre qu'un, une fois, et le rend aussitôt.
let available: boolean | null = null;
export function webglAvailable() {
  if (available !== null) return available;
  try {
    const gl = document.createElement("canvas").getContext("webgl2");
    available = Boolean(gl);
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    available = false;
  }
  return available;
}

export function createStage(canvas: HTMLCanvasElement, { shadow = 0.28, exposure = 1, pixelRatio = 2, preserve = false } = {}): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: preserve, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.shadowMap.enabled = shadow > 0;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  scene.environmentIntensity = 0.85;

  const key = new THREE.DirectionalLight("#ffffff", 2.2);
  key.position.set(-3, 6, 4);
  key.castShadow = shadow > 0;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0004;
  const cam = key.shadow.camera;
  cam.left = cam.bottom = -4;
  cam.right = cam.top = 4;
  scene.add(key);
  scene.add(new THREE.HemisphereLight("#eef3f8", "#3a4048", 0.6));

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(40, 40).rotateX(-Math.PI / 2), new THREE.ShadowMaterial({ opacity: shadow }));
  ground.receiveShadow = true;
  scene.add(ground);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.05, 100);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();

  // Cadre l'objet entier, vu de trois quarts et un peu au-dessus, avec une marge.
  const frame = (object: THREE.Object3D, { elevation = 24, azimuth = 30, margin = 1.15, fov = 28 }: View = {}) => {
    camera.fov = fov;
    const box = new THREE.Box3().setFromObject(object);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const vFov = THREE.MathUtils.degToRad(fov);
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distance = (sphere.radius * margin) / Math.sin(Math.min(vFov, hFov) / 2);
    const el = THREE.MathUtils.degToRad(elevation);
    const az = THREE.MathUtils.degToRad(azimuth);
    camera.position.set(
      sphere.center.x + distance * Math.cos(el) * Math.sin(az),
      sphere.center.y + distance * Math.sin(el),
      sphere.center.z + distance * Math.cos(el) * Math.cos(az),
    );
    camera.near = distance / 50;
    camera.far = distance * 10;
    camera.lookAt(sphere.center);
    camera.updateProjectionMatrix();
  };

  return {
    renderer,
    scene,
    camera,
    key,
    ground,
    render: () => renderer.render(scene, camera),
    resize,
    frame,
    dispose: () => {
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
