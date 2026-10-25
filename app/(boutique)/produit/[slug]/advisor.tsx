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
    <section aria-labelledby="advisor-title" className="grid gap-8 bg-paper/60 p-5 shadow-[inset_0_0_0_1px_var(--color-line)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div>
        <h2 id="advisor-title" className="display text-[44px]">
          Le conseiller
        </h2>
        <p className="mt-2 max-w-[30rem] text-fog">
          Une IA explique le score calculé pour vous et compose un ou deux rituels avec ce qui vous convient en boutique. Elle ne change jamais le score.
        </p>
        {!answered && (
          <form action={action} className="mt-6">
            <input type="hidden" name="slug" value={slug} />
            <button type="submit" disabled={pending} className={secondaryButton}>
              {pending && <Spinner />}
              {pending ? "Le conseiller rédige…" : "Pourquoi ce score ?"}
            </button>
          </form>
        )}
      </div>

      <div aria-live="polite">
        {state.error && <p className="bg-danger/10 p-4 text-[15px] text-danger">{state.error}</p>}
        {state.explanation && (
          <>
            <p className="max-w-[40rem] text-[18px] text-pretty">{state.explanation}</p>
            {state.rituals && state.rituals.length > 0 && (
              <ul className="mt-6 grid gap-px sm:grid-cols-2">
                {state.rituals.map((ritual) => (
                  <li key={ritual.title} className="bg-steel p-5">
                    <h3 className="display text-[28px]">{ritual.title}</h3>
                    <p className="mt-1 text-[15px] text-fog">{ritual.why}</p>
                    <ul className="mt-4 flex flex-wrap gap-3">
                      {ritual.items.map((item) => (
                        <li key={item.slug}>
                          <Link href={`/produit/${item.slug}`} className="group flex w-24 flex-col">
                            {item.image && <Image src={item.image} alt="" width={96} height={96} className="steel-light aspect-square w-full object-contain p-1" />}
                            <span className="mt-1.5 line-clamp-2 text-[13px] leading-tight group-hover:underline">{item.name}</span>
                            <span className="mono text-[12px] text-fog">{item.price}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
            <p className="mono mt-4 text-[12px] text-fog">Texte rédigé par une IA à partir de notre calcul. Le score, lui, vient du calcul.</p>
          </>
        )}
      </div>
    </section>
  );
}
