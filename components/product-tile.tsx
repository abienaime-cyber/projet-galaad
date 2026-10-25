import Image from "next/image";
import Link from "next/link";
import { Tag } from "@/components/tag";
import { hasRange, isAvailable, minPrice, price, type Rated } from "@/lib/shop";

// Vignette : le rendu 3D sur acier, le nom en capitales, le prix en mono. Le score n'apparaît qu'avec un profil de goût.
export function ProductTile({ item, priority, heading: Heading = "h2" }: { item: Rated; priority?: boolean; heading?: "h2" | "h3" }) {
  const { product, match } = item;
  const available = isAvailable(product);
  const formats = product.variants.map((v) => v.label).filter((l) => l !== "Unique");
  return (
    <li className="h-full">
      <Link
        href={`/produit/${product.slug}`}
        prefetch={priority}
        className="group relative flex h-full flex-col bg-paper/55 shadow-[inset_0_0_0_1px_var(--color-line)] transition-[background-color] duration-200 hover:bg-paper/90"
      >
        <div className="steel-light relative overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              width={600}
              height={600}
              priority={priority}
              sizes="(min-width: 1280px) 340px, (min-width: 768px) 33vw, 50vw"
              className="aspect-square w-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="aspect-square" />
          )}
          {match && (
            <Tag tone={match.score >= 85 ? "matcha" : "light"} className="absolute top-3 left-3" index={String(match.score)}>
              Pour vous
            </Tag>
          )}
          {!available && <Tag tone="dark" className="absolute top-3 right-3">Épuisé</Tag>}
        </div>
        <div className="flex flex-1 flex-col gap-1 p-4">
          <Heading className="display text-[24px] leading-[0.95] sm:text-[26px]">{product.name}</Heading>
          {formats.length > 0 && <p className="mono text-fog">{formats.join(" · ")}</p>}
          <p className="mono mt-auto pt-3 text-[15px]">
            {hasRange(product) && "dès "}
            {price(minPrice(product))}
          </p>
        </div>
      </Link>
    </li>
  );
}
