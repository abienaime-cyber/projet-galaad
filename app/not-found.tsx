import Link from "next/link";
import { Powder } from "@/components/powder";

// 404 : un tas de poudre qu'on peut toucher, entre deux 4, sur la grille de repérage.
export default function NotFound() {
  return (
    <div className="registration bg-steel px-4 py-16 [--cell-h:33.333%] sm:px-6 sm:py-24">
      <div data-theme="dark" className="mx-auto max-w-[960px] bg-ink p-4 text-matcha sm:p-6">
        <p className="mono flex justify-between uppercase">
          <span>Page</span> <span>introuvable</span>
        </p>
        <h1 className="display relative flex items-center justify-between text-[30vw] leading-[0.8] sm:text-[240px]" aria-label="Erreur 404">
          <span aria-hidden>4</span>
          <span aria-hidden className="relative aspect-square w-[34vw] max-w-[320px]">
            <Powder src="/photos/tin-quotidien.jpg" shape="tas" className="absolute -inset-[20%] size-[140%] touch-pan-y" />
          </span>
          <span aria-hidden>4</span>
        </h1>
        <p className="mono flex justify-between uppercase">
          <span>Poudre</span> <span>renversée</span>
        </p>
      </div>
      <p className="mt-6 text-center">
        <Link href="/" className="mono inline-flex min-h-11 items-center underline underline-offset-4 hover:text-matcha-ink">
          (retour à l’accueil)
        </Link>
      </p>
    </div>
  );
}
