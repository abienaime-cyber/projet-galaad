"use client";

import { useEffect, useRef } from "react";

// Nuage de matcha en suspension : un bruit fractal (fbm) déformé par lui-même, en WebGL nu (pas de Three ici).
// Il ne tourne que visible à l'écran ; en mouvement réduit, une seule image fixe.
const VERTEX = `#version 300 es
in vec2 p; out vec2 uv;
void main() { uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAGMENT = `#version 300 es
precision highp float;
in vec2 uv; out vec4 color;
uniform float t; uniform vec2 res;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) { v += a * noise(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}
void main() {
  vec2 p = (uv - 0.5) * vec2(res.x / res.y, 1.0) * 2.6;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.05)), fbm(p + vec2(5.2, 1.3) - t * 0.04));
  vec2 r = vec2(fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 0.06), fbm(p + 3.5 * q + vec2(8.3, 2.8)));
  float f = fbm(p + 3.0 * r);
  vec3 deep = vec3(0.66, 0.76, 0.52);
  vec3 mid = vec3(0.83, 0.87, 0.76);
  vec3 lime = vec3(0.97, 0.96, 0.94);
  vec3 c = mix(deep, mid, smoothstep(0.2, 0.65, f));
  c = mix(c, lime, smoothstep(0.55, 0.95, f * f * 1.6 + 0.25 * r.x));
  c *= 0.94 + 0.06 * smoothstep(0.0, 0.8, q.y);
  color = vec4(c, 1.0);
}`;

export function Smoke({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const gl = canvas.getContext("webgl2", { antialias: false, alpha: false });
    if (!gl) return;
    const shader = (type: number, source: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, VERTEX));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, FRAGMENT));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Nuage : shader refusé", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uT = gl.getUniformLocation(program, "t");
    const uRes = gl.getUniformLocation(program, "res");

    // Le nuage est flou par nature : une demi-résolution suffit et ménage la carte graphique.
    const resize = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * 0.5));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * 0.5));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let visible = false;
    const draw = (now: number) => {
      gl.uniform1f(uT, reduced ? 12 : now / 1000);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = visible && !reduced ? requestAnimationFrame(draw) : 0;
    };
    const observer = new ResizeObserver(() => {
      resize();
      if (!raf) draw(performance.now());
    });
    observer.observe(canvas);
    const watcher = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(draw);
    });
    watcher.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      watcher.disconnect();
      // Pas de loseContext() : un remontage (mode strict de React) reprendrait le même canvas, contexte perdu.
      gl.deleteProgram(program);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
