import Image from "next/image";
import Link from "next/link";
import { price, type Fitted } from "@/lib/shop";

export function ProductTile({ item, priority, heading: Heading = "h2" }: { item: Fitted; priority?: boolean; heading?: "h2" | "h3" }) {
  const { product, rec, inStock } = item;
  return (
    <li>
      <Link href={`/produit/${product.slug}`} prefetch={priority} className="group flex h-full flex-col">
        <div className="relative overflow-hidden bg-tile">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              width={500}
              height={625}
              priority={priority}
              sizes="(min-width: 1280px) 340px, (min-width: 768px) 33vw, 50vw"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
            />
          ) : (
            <div className="aspect-[4/5] bg-fill" />
          )}
          {rec && <SizeBadge size={rec.size} inStock={inStock} estimated={rec.estimated} />}
        </div>
        <Heading className="eyebrow mt-4">{product.name}</Heading>
        <p className="mt-1 text-[13px] text-label-2">
          {product.color} · {product.material}
        </p>
        <p className="figures mt-2 text-[14px]">{price(product.priceCents)}</p>
      </Link>
    </li>
  );
}

// Étiquette blanche posée sur la photo, en haut à gauche : la taille se lit avant le nom.
function SizeBadge({ size, inStock, estimated }: { size: string | null; inStock: boolean; estimated: boolean }) {
  const base = "absolute top-3 left-3 inline-flex items-center gap-2 bg-canvas px-2.5 py-1.5";
  if (!size) return <span className={`${base} text-[11px] text-label-2`}>Hors de notre tableau de tailles</span>;
  return (
    <span className={base} title={estimated ? "Taille estimée" : undefined}>
      <span className="text-[11px] text-label-2 max-sm:sr-only">{inStock ? "Votre taille" : "Épuisé en"}</span>
      <span className={`figures text-[14px] leading-none font-semibold ${inStock ? "text-brass" : "text-label-2 line-through"}`}>{size}</span>
    </span>
  );
}
