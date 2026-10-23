"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import { secondaryButton } from "@/components/field";
import { Spinner } from "@/components/spinner";
import { askAdvisor, type AdviceState } from "./actions";

export function Advisor({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState<AdviceState, FormData>(askAdvisor, {});
  const answered = Boolean(state.explanation);

  return (
    <section aria-labelledby="advisor-title" className="mt-8 border-t border-separator pt-8">
      <h2 id="advisor-title" className="text-[17px] font-semibold">
        Le conseiller
      </h2>
      <p className="mt-1 max-w-[34rem] text-sm text-label-2">
        Il explique le calcul de votre taille et compose des tenues avec les articles disponibles dans votre taille. Il
        ne change jamais la taille calculée.
      </p>

      {!answered && (
        <form action={action} className="mt-4">
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" disabled={pending} className={secondaryButton}>
            {pending && <Spinner />}
            {pending ? "Le conseiller rédige…" : "Pourquoi cette taille ?"}
          </button>
        </form>
      )}

      <div aria-live="polite">
        {state.error && <p className="mt-4 rounded-[14px] bg-danger-tint p-4 text-sm text-danger">{state.error}</p>}
        {state.explanation && (
          <>
            <p className="mt-4 max-w-[36rem] text-pretty">{state.explanation}</p>
            {state.outfits && state.outfits.length > 0 && (
              <ul className="mt-6 grid gap-4">
                {state.outfits.map((outfit) => (
                  <li key={outfit.title} className="rounded-[18px] bg-tile p-5">
                    <h3 className="font-semibold">{outfit.title}</h3>
                    <p className="mt-1 text-sm text-label-2">{outfit.why}</p>
                    <ul className="mt-4 flex flex-wrap gap-3">
                      {outfit.items.map((item) => (
                        <li key={item.slug}>
                          <Link href={`/produit/${item.slug}`} className="group flex w-28 flex-col text-xs">
                            {item.image && (
                              <Image
                                src={item.image}
                                alt=""
                                width={112}
                                height={140}
                                className="aspect-[4/5] w-full rounded-[12px] object-cover"
                              />
                            )}
                            <span className="mt-2 line-clamp-2 group-hover:underline">{item.name}</span>
                            <span className="text-label-2 tabular-nums">{item.price}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-label-2">Texte rédigé par une IA à partir de notre calcul. La taille, elle, vient du calcul.</p>
          </>
        )}
      </div>
    </section>
  );
}
