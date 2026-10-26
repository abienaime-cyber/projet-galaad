import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/tag";
import { hasRange, isAvailable, minPrice, price, type Rated } from "@/lib/shop";

// Vignette : la photo plein cadre, le nom en capitales, le prix en mono. Le score n'apparaît qu'avec un profil de goût.
// Le texte prend la couleur de la section : la même vignette sert sur le noir et sur le gris bleuté.
export function ProductTile({ item, priority, heading: Heading = "h2" }: { item: Rated; priority?: boolean; heading?: "h2" | "h3" }) {
  const { product, match } = item;
  const available = isAvailable(product);
  const formats = product.variants.map((v) => v.label).filter((l) => l !== "Unique");
  return (
    <li className="h-full">
      <Link href={`/produit/${product.slug}`} prefetch={priority} className="group relative flex h-full flex-col shadow-[inset_0_0_0_1px_var(--color-line)] [[data-theme=dark]_&]:shadow-[inset_0_0_0_1px_var(--color-line-dark)]">
        <div className="relative aspect-[4/5] overflow-hidden bg-ink">
          {product.image && (
            <Image
              src={product.image}
              alt=""
              fill
              priority={priority}
              sizes="(min-width: 1280px) 340px, (min-width: 1024px) 25vw, 50vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.06]"
            />
          )}
          {match && (
            <Tag tone={match.score >= 85 ? "matcha" : "light"} className="absolute top-3 left-3" index={String(match.score)}>
              Pour vous
            </Tag>
          )}
          {!available && <Tag tone="dark" className="absolute top-3 right-3">Épuisé</Tag>}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <Heading className="display text-[24px] leading-[0.95] transition-colors group-hover:text-matcha-ink sm:text-[26px] [[data-theme=dark]_&]:group-hover:text-matcha">
            {product.name}
          </Heading>
          {formats.length > 0 && <p className="mono text-fog [[data-theme=dark]_&]:text-fog-dark">{formats.join(" · ")}</p>}
          <p className="mono mt-auto pt-3 text-[15px]">
            {hasRange(product) && "dès "}
            {price(minPrice(product))}
          </p>
        </div>
      </Link>
    </li>
  );
}
