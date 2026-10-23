"use client";

import { useEffect } from "react";

// Erreur imprévue (base injoignable, panne réseau) : on le dit, et on propose de réessayer.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[980px] px-4 pt-24 pb-32 text-center sm:px-[22px]">
      <h1 className="text-[40px] font-semibold md:text-5xl">Cette page n’a pas pu se charger.</h1>
      <p className="mx-auto mt-4 max-w-[30rem] text-[19px] text-label-2">
        Le service ne répond pas pour le moment. Votre panier et vos mensurations sont conservés.
      </p>
      <button
        type="button"
        onClick={() => retry()}
        className="mt-6 inline-flex h-11 cursor-pointer items-center rounded-full bg-accent px-[22px] text-[17px] text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.97]"
      >
        Réessayer
      </button>
    </div>
  );
}
