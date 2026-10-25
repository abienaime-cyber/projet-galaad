"use client";

import { Camera, X } from "@phosphor-icons/react";
import type { PoseLandmarker } from "@mediapipe/tasks-vision";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { primaryButton } from "@/components/field";
import { EASE } from "@/components/motion";
import { Spinner } from "@/components/spinner";

// Détection du corps : MediaPipe Pose Landmarker (Google, licence Apache 2.0), exécuté dans le navigateur.
// La version des fichiers wasm doit rester celle de @mediapipe/tasks-vision dans package.json.
const WASM = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm";
const MODEL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";

// Les visuels /tryon/<slug>.webp (scripts/photos/generate.py) ont les épaules en (150, 150) et (450, 150).
const GARMENT_SHOULDERS = 300;
const GARMENT_ANCHOR = { x: 300, y: 150 };
// Les points d'épaule de MediaPipe sont au centre de l'articulation : la couture d'épaule tombe un peu plus loin.
const SHOULDER_SPREAD = 1.25;

type Status = "idle" | "loading" | "live" | "denied" | "error";
type Point = { x: number; y: number };

const MESSAGE: Record<"idle" | "denied" | "error", string> = {
  idle: "Placez-vous à un mètre et demi de la caméra, face à elle, les deux épaules visibles. Le vêtement se pose sur vous en direct.",
  denied: "L’accès à la caméra a été refusé. Autorisez-le dans les réglages du navigateur (icône à gauche de l’adresse), puis réessayez.",
  error: "Impossible de lancer l’essayage : aucune caméra trouvée, ou navigateur trop ancien.",
};

// Le modèle est chargé une fois par visite : rouvrir l'essayage est immédiat.
let landmarker: Promise<PoseLandmarker> | null = null;
function loadLandmarker() {
  landmarker ??= (async () => {
    const { FilesetResolver, PoseLandmarker } = await import("@mediapipe/tasks-vision");
    const files = await FilesetResolver.forVisionTasks(WASM);
    const options = (delegate: "GPU" | "CPU") => ({ baseOptions: { modelAssetPath: MODEL, delegate }, runningMode: "VIDEO" as const, numPoses: 1 });
    return PoseLandmarker.createFromOptions(files, options("GPU")).catch(() => PoseLandmarker.createFromOptions(files, options("CPU")));
  })();
  landmarker.catch(() => (landmarker = null));
  return landmarker;
}

export function TryOn({ slug, name }: { slug: string; name: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  function show() {
    setOpen(true);
    dialog.current?.showModal();
  }

  return (
    <>
      {/* Posé sur la photo de l'article, en haut à gauche : visible dès l'arrivée sur la fiche. */}
      <button
        type="button"
        onClick={show}
        className="absolute top-4 left-4 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-card px-5 text-[14px] font-semibold shadow-md transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:shadow-lg"
      >
        <Camera aria-hidden size={20} />
        Essayer avec ma caméra
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="try-on-title"
        onClose={() => setOpen(false)}
        className="m-auto w-[min(100%-2rem,52rem)] max-w-none overflow-visible bg-transparent p-0 backdrop:bg-black/60 max-sm:m-0 max-sm:h-dvh max-sm:max-h-none max-sm:w-full"
      >
        {open && <Stage slug={slug} name={name} onClose={() => dialog.current?.close()} />}
      </dialog>
    </>
  );
}

function Stage({ slug, name, onClose }: { slug: string; name: string; onClose: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const stop = useRef<() => void>(() => {});
  const [status, setStatus] = useState<Status>("idle");
  const [seen, setSeen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => () => stop.current(), []);

  async function start() {
    setStatus("loading");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false });
    } catch (error) {
      setStatus(error instanceof DOMException && error.name === "NotAllowedError" ? "denied" : "error");
      return;
    }
    let frame = 0;
    stop.current = () => {
      cancelAnimationFrame(frame);
      stream.getTracks().forEach((track) => track.stop());
    };

    try {
      const v = video.current!;
      v.srcObject = stream;
      const garment = new window.Image();
      garment.src = `/tryon/${slug}.webp`;
      const [pose] = await Promise.all([loadLandmarker(), v.play(), garment.decode()]);
      const c = canvas.current!;
      c.width = v.videoWidth;
      c.height = v.videoHeight;
      const ctx = c.getContext("2d")!;
      setStatus("live");

      let last = -1;
      let left: Point | null = null;
      let right: Point | null = null;
      let found = false;
      const smooth = (prev: Point | null, next: Point) => (prev ? { x: prev.x + (next.x - prev.x) * 0.5, y: prev.y + (next.y - prev.y) * 0.5 } : next);

      const draw = () => {
        frame = requestAnimationFrame(draw);
        if (v.currentTime === last) return;
        last = v.currentTime;
        const body = pose.detectForVideo(v, performance.now()).landmarks[0];
        // 12 = épaule droite de la personne, à gauche de l'image ; 11 = épaule gauche, à droite.
        const visible = body && body[11].visibility > 0.5 && body[12].visibility > 0.5;
        ctx.clearRect(0, 0, c.width, c.height);
        if (visible) {
          left = smooth(left, { x: body[12].x * c.width, y: body[12].y * c.height });
          right = smooth(right, { x: body[11].x * c.width, y: body[11].y * c.height });
          const scale = (Math.hypot(right.x - left.x, right.y - left.y) * SHOULDER_SPREAD) / GARMENT_SHOULDERS;
          ctx.save();
          ctx.translate((left.x + right.x) / 2, (left.y + right.y) / 2);
          ctx.rotate(Math.atan2(right.y - left.y, right.x - left.x));
          ctx.scale(scale, scale);
          ctx.drawImage(garment, -GARMENT_ANCHOR.x, -GARMENT_ANCHOR.y);
          ctx.restore();
        }
        if (Boolean(visible) !== found) {
          found = !found;
          setSeen(found);
        }
      };
      draw();
    } catch {
      stop.current();
      setStatus("error");
    }
  }

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: "scale(0.97)" }}
      animate={{ opacity: 1, transform: "scale(1)" }}
      transition={{ duration: 0.25, ease: EASE }}
      className="flex h-full flex-col overflow-hidden bg-card shadow-xl sm:rounded-2xl"
    >
      <header className="flex items-center justify-between gap-4 border-b border-border px-5 py-3 sm:px-6">
        <h2 id="try-on-title" className="font-sans text-[16px] font-semibold">
          Essayage : {name}
        </h2>
        <button type="button" onClick={onClose} aria-label="Fermer l’essayage" className="-mr-2 inline-flex size-11 items-center justify-center rounded-full hover:bg-muted">
          <X aria-hidden size={20} />
        </button>
      </header>

      <div className="relative aspect-[3/4] w-full bg-primary max-sm:flex-1 sm:aspect-[4/3]">
        <video ref={video} playsInline muted className="absolute inset-0 size-full -scale-x-100 object-cover" />
        <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full -scale-x-100 object-cover" />

        {status !== "live" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-muted p-6 text-center">
            {status === "loading" ? (
              <p role="status" className="inline-flex items-center gap-3 font-semibold">
                <Spinner className="size-5" />
                Ouverture de la caméra…
              </p>
            ) : (
              <>
                <Image src={`/tryon/${slug}.webp`} alt="" width={600} height={900} unoptimized className="h-[45%] w-auto" />
                <p className="max-w-[30rem] text-[15px]" role={status === "idle" ? undefined : "alert"}>
                  {MESSAGE[status]}
                </p>
                <button type="button" onClick={start} className={primaryButton}>
                  <Camera aria-hidden size={20} />
                  {status === "idle" ? "Activer la caméra" : "Réessayer"}
                </button>
              </>
            )}
          </div>
        )}

        {status === "live" && !seen && (
          <p role="status" className="absolute inset-x-4 bottom-4 rounded-lg bg-card/90 px-4 py-3 text-center text-[14px] font-semibold">
            Reculez un peu : vos deux épaules doivent être visibles.
          </p>
        )}
      </div>

      <p className="px-5 py-4 text-[13px] text-muted-foreground sm:px-6">
        Aperçu indicatif : le vêtement est posé à plat sur l’image, il ne dit rien de la taille. L’image de la caméra reste sur votre appareil, rien n’est
        envoyé ni enregistré. Le modèle de détection est téléchargé depuis les serveurs de Google.
      </p>
    </motion.div>
  );
}
