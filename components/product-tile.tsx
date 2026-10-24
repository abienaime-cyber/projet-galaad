import Image from "next/image";
import Link from "next/link";
import { price, type Fitted } from "@/lib/shop";

export function ProductTile({ item, priority }: { item: Fitted; priority?: boolean }) {
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
              sizes="(min-width: 1024px) 460px, 50vw"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
            />
          ) : (
            <div className="aspect-[4/5] bg-fill" />
          )}
          {rec && <SizeBadge size={rec.size} inStock={inStock} estimated={rec.estimated} />}
        </div>
        <h2 className="mt-4 text-[17px] sm:mt-5 sm:text-[21px]">{product.name}</h2>
        <p className="mt-1 text-xs text-label-2 sm:text-sm">
          {product.color} · {product.material}
        </p>
        <p className="mt-2 text-sm tabular-nums sm:text-[15px]">{price(product.priceCents)}</p>
      </Link>
    </li>
  );
}

// Posée sur la photo, en bas à gauche : la taille se lit avant le nom.
function SizeBadge({ size, inStock, estimated }: { size: string | null; inStock: boolean; estimated: boolean }) {
  const base = "absolute bottom-0 left-0 inline-flex items-center gap-2 bg-canvas/80 px-3 py-2 backdrop-blur-md reduced-transparency:bg-canvas";
  if (!size) return <span className={`${base} text-[11px] text-label-2`}>Hors de notre tableau de tailles</span>;
  return (
    <span className={base} title={estimated ? "Taille estimée" : undefined}>
      <span className="eyebrow text-[10px] text-label-2 max-sm:sr-only">{inStock ? "Votre taille" : "Épuisé en"}</span>
      <span className={`figures text-[17px] leading-none ${inStock ? "text-brass" : "text-label-2 line-through"}`}>{size}</span>
    </span>
  );
}
