import Image from "next/image";
import Link from "next/link";

// 404 : un bol vide entre deux 4, sur la grille de repérage.
export default function NotFound() {
  return (
    <div className="registration bg-steel px-4 py-16 [--cell-h:33.333%] sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[960px] bg-matcha p-4 sm:p-6">
        <p className="mono flex justify-between uppercase">
          <span>Page</span> <span>introuvable</span>
        </p>
        <h1 className="display flex items-center justify-center gap-2 text-[30vw] leading-[0.8] sm:text-[240px]" aria-label="Erreur 404">
          <span aria-hidden>4</span>
          <Image src="/renders/chawan.png" alt="" width={300} height={300} priority className="w-[28vw] max-w-[260px]" />
          <span aria-hidden>4</span>
        </h1>
        <p className="mono flex justify-between uppercase">
          <span>Bol</span> <span>vide</span>
        </p>
      </div>
      <p className="mt-6 text-center">
        <Link href="/" className="mono inline-flex min-h-11 items-center underline underline-offset-4 hover:text-matcha-ink">
          (retour au coffre)
        </Link>
      </p>
    </div>
  );
}
