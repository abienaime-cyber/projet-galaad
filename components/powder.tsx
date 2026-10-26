"use client";

import { useEffect, useRef } from "react";

// Poudre de matcha interactive. Chaque grain est un pixel d'une vraie photo de poudre : on lit l'image,
// on garde les pixels clairs (la poudre, pas le fond noir), et chacun devient une particule de sa couleur.
// Le doigt ou la souris écarte les grains, un appui les souffle, puis chacun revient à sa place à son rythme.
// WebGL nu, sans Three. La boucle dort quand rien ne bouge et quand la poudre est hors de l'écran.
// Mouvement réduit : la poudre est posée, immobile.

const VERTEX = `
attribute vec2 a_pos; attribute vec3 a_col; attribute float a_size;
uniform vec2 u_res; varying vec3 v_col;
void main() {
  vec2 clip = a_pos / u_res * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = a_size;
  v_col = a_col;
}`;

const FRAGMENT = `
precision mediump float; varying vec3 v_col;
void main() {
  float d = length(gl_PointCoord - 0.5);
  gl_FragColor = vec4(v_col, smoothstep(0.5, 0.2, d));
}`;

type Props = {
  src: string;
  className?: string;
  // contain : toute la photo tient dans le cadre. cover : elle le remplit.
  fit?: "contain" | "cover";
  // Pixels plus sombres que ce seuil (0 à 255) : le fond, ignoré.
  threshold?: number;
  // photo : les grains suivent la photo telle quelle. tas : on découpe dans une texture de poudre un tas aux bords
  // irréguliers, avec des projections autour, comme une poudre renversée vue de dessus.
  shape?: "photo" | "tas";
  // Fond clair : les grains sont foncés un peu au lieu d'être éclaircis.
  light?: boolean;
};

// Le contour du tas : un cercle déformé par deux ondulations, puis des projections qui se raréfient en s'éloignant.
function inPile(x: number, y: number, seed: number) {
  const dx = x - 0.5;
  const dy = y - 0.5;
  const r = Math.hypot(dx, dy);
  const a = Math.atan2(dy, dx);
  const edge = 0.3 * (1 + 0.16 * Math.sin(5 * a + seed) + 0.09 * Math.sin(11 * a + seed * 2.3));
  return r < edge ? Math.random() < 0.92 : Math.random() < 0.55 * Math.exp(-(r - edge) / 0.045);
}

type Grain = { nx: number; ny: number };

export function Powder({ src, className, fit = "contain", threshold = 42, shape = "photo", light = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: false, antialias: false });
    if (!gl) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let disposed = false;
    let raf = 0;
    let running = false;
    let visible = true;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    const uRes = gl.getUniformLocation(program, "u_res");
    const buffer = (name: string, size: number, data: Float32Array, usage: number) => {
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, usage);
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      return b;
    };

    let grains: Grain[] = [];
    let pos = new Float32Array(0);
    let vel = new Float32Array(0);
    let home = new Float32Array(0);
    let spring = new Float32Array(0);
    let posBuffer: WebGLBuffer | null = null;
    let imgW = 1;
    let imgH = 1;
    let cell = 1;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const pointer = { x: -1e4, y: -1e4, vx: 0, vy: 0, active: false };

    // Place chaque grain dans le cadre, selon fit, et donne à chacun sa taille.
    const layout = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uRes, w, h);
      const scale = (fit === "cover" ? Math.max : Math.min)(w / imgW, h / imgH);
      const ox = (w - imgW * scale) / 2;
      const oy = (h - imgH * scale) / 2;
      cell = scale;
      grains.forEach((g, i) => {
        home[i * 2] = ox + g.nx * imgW * scale;
        home[i * 2 + 1] = oy + g.ny * imgH * scale;
      });
    };

    const render = () => {
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, pos);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, grains.length);
    };

    // Un pas de simulation : ressort vers la place d'origine, frottement, et le pointeur qui repousse et entraîne.
    const step = () => {
      const radius = (pointer.active ? 80 : 0) * dpr;
      const r2 = radius * radius;
      let energy = 0;
      for (let i = 0; i < grains.length; i++) {
        const ix = i * 2;
        const iy = ix + 1;
        let vx = vel[ix] + (home[ix] - pos[ix]) * spring[i];
        let vy = vel[iy] + (home[iy] - pos[iy]) * spring[i];
        if (radius) {
          const dx = pos[ix] - pointer.x;
          const dy = pos[iy] - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = (1 - d / radius) ** 2;
            vx += (dx / d) * f * 6 * dpr + pointer.vx * f * 0.3;
            vy += (dy / d) * f * 6 * dpr + pointer.vy * f * 0.3;
          }
        }
        vx *= 0.89;
        vy *= 0.89;
        pos[ix] += vx;
        pos[iy] += vy;
        vel[ix] = vx;
        vel[iy] = vy;
        energy += vx * vx + vy * vy;
      }
      pointer.vx *= 0.6;
      pointer.vy *= 0.6;
      return energy / Math.max(1, grains.length);
    };

    const loop = () => {
      raf = 0;
      if (disposed || !visible) {
        running = false;
        return;
      }
      const energy = step();
      render();
      // Plus rien ne bouge et personne ne touche : la boucle s'endort jusqu'au prochain geste.
      if (energy < 0.0004 && !pointer.active) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    const wake = () => {
      if (reduced || running || disposed) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    // Souffle : un appui projette les grains proches vers l'extérieur.
    const blow = (x: number, y: number) => {
      const radius = 140 * dpr;
      for (let i = 0; i < grains.length; i++) {
        const dx = pos[i * 2] - x;
        const dy = pos[i * 2 + 1] - y;
        const d = Math.hypot(dx, dy);
        if (d < radius && d > 0.01) {
          const f = (1 - d / radius) * (10 + Math.random() * 14) * dpr;
          vel[i * 2] += (dx / d) * f;
          vel[i * 2 + 1] += (dy / d) * f - Math.random() * 3 * dpr;
        }
      }
      wake();
    };

    const toLocal = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return { x: (clientX - rect.left) * dpr, y: (clientY - rect.top) * dpr, inside: clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom };
    };
    const move = (clientX: number, clientY: number) => {
      const p = toLocal(clientX, clientY);
      if (pointer.active) {
        pointer.vx = p.x - pointer.x;
        pointer.vy = p.y - pointer.y;
      }
      pointer.x = p.x;
      pointer.y = p.y;
      pointer.active = p.inside;
      if (p.inside) wake();
    };
    const onPointerMove = (e: PointerEvent) => e.pointerType === "mouse" && move(e.clientX, e.clientY);
    // Au doigt, le souffle part du touchstart : pointerdown tactile est ignoré pour ne pas souffler deux fois.
    const onPointerDown = (e: PointerEvent) => {
      const p = toLocal(e.clientX, e.clientY);
      if (p.inside && e.pointerType !== "touch") blow(p.x, p.y);
    };
    // Au doigt, on lit les événements tactiles passifs : la page continue de défiler normalement.
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) move(t.clientX, t.clientY);
    };
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      move(t.clientX, t.clientY);
      const p = toLocal(t.clientX, t.clientY);
      if (p.inside) blow(p.x, p.y);
    };
    const release = () => {
      pointer.active = false;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    const resize = new ResizeObserver(() => {
      if (!grains.length) return;
      layout();
      if (reduced) {
        pos.set(home);
        render();
      } else wake();
    });

    const image = new Image();
    image.src = src;
    image
      .decode()
      .then(() => {
        if (disposed) return;
        // Lecture de la photo à basse résolution : un pixel lu = un grain possible.
        // Pour un tas, on lit le carré central de la texture.
        const pile = shape === "tas";
        const side = Math.min(image.naturalWidth, image.naturalHeight);
        const sw = pile ? 300 : 260;
        const sh = pile ? sw : Math.round((image.naturalHeight / image.naturalWidth) * sw);
        imgW = sw;
        imgH = sh;
        const off = document.createElement("canvas");
        off.width = sw;
        off.height = sh;
        const ctx = off.getContext("2d", { willReadFrequently: true })!;
        if (pile) ctx.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, sw, sh);
        else ctx.drawImage(image, 0, 0, sw, sh);
        const { data } = ctx.getImageData(0, 0, sw, sh);
        const seed = Math.random() * 10;
        const candidates: number[] = [];
        for (let i = 0; i < sw * sh; i++) {
          const lum = 0.3 * data[i * 4] + 0.59 * data[i * 4 + 1] + 0.11 * data[i * 4 + 2];
          const keep = pile ? inPile((i % sw) / sw, Math.floor(i / sw) / sh, seed) : lum > threshold;
          if (keep) candidates.push(i);
        }
        // Moins de grains sur un petit écran : la simulation reste fluide sur téléphone.
        const max = canvas.clientWidth < 700 ? 14000 : 26000;
        const keep = Math.min(1, max / Math.max(1, candidates.length));
        const picked = candidates.filter(() => Math.random() < keep);
        const n = picked.length;
        grains = picked.map((i) => ({ nx: ((i % sw) + Math.random()) / sw, ny: (Math.floor(i / sw) + Math.random()) / sh }));
        const colors = new Float32Array(n * 3);
        const sizes = new Float32Array(n);
        pos = new Float32Array(n * 2);
        vel = new Float32Array(n * 2);
        home = new Float32Array(n * 2);
        spring = new Float32Array(n);
        layout();
        const gain = light ? 0.78 : 1.12;
        picked.forEach((i, k) => {
          // Couleur du pixel, un peu plus saturée ; plus claire sur le noir, plus foncée sur un fond clair.
          const rgb = [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]].map((v) => v / 255);
          const mean = (rgb[0] + rgb[1] + rgb[2]) / 3;
          rgb.forEach((v, c) => {
            colors[k * 3 + c] = Math.min(1, (mean + (v - mean) * 1.35) * gain);
          });
          sizes[k] = Math.max(1.5 * dpr, cell * (1 + Math.random() * 1.1));
          spring[k] = 0.005 + Math.random() * 0.02;
          // Entrée : les grains arrivent d'un nuage dispersé et se posent à leur place.
          const angle = Math.random() * Math.PI * 2;
          const spread = reduced ? 0 : (0.3 + Math.random()) * canvas.width * 0.6;
          pos[k * 2] = home[k * 2] + Math.cos(angle) * spread;
          pos[k * 2 + 1] = home[k * 2 + 1] + Math.sin(angle) * spread;
        });
        posBuffer = buffer("a_pos", 2, pos, gl.DYNAMIC_DRAW);
        buffer("a_col", 3, colors, gl.STATIC_DRAW);
        buffer("a_size", 1, sizes, gl.STATIC_DRAW);
        canvas.dataset.ready = "true";
        render();
        observer.observe(canvas);
        resize.observe(canvas);
        wake();
      })
      .catch(() => {});

    addEventListener("pointermove", onPointerMove, { passive: true });
    addEventListener("pointerdown", onPointerDown, { passive: true });
    canvas.parentElement?.addEventListener("pointerleave", release);
    addEventListener("touchstart", onTouchStart, { passive: true });
    addEventListener("touchmove", onTouch, { passive: true });
    addEventListener("touchend", release, { passive: true });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      removeEventListener("pointermove", onPointerMove);
      removeEventListener("pointerdown", onPointerDown);
      canvas.parentElement?.removeEventListener("pointerleave", release);
      removeEventListener("touchstart", onTouchStart);
      removeEventListener("touchmove", onTouch);
      removeEventListener("touchend", release);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [src, fit, threshold, shape, light]);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
