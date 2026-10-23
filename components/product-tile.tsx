import Image from "next/image";
import Link from "next/link";
import { price, type Fitted } from "@/lib/shop";

export function ProductTile({ item, priority }: { item: Fitted; priority?: boolean }) {
  const { product, rec, inStock } = item;
  return (
    <li>
      <Link
        href={`/produit/${product.slug}`}
        prefetch={priority}
        className="group flex h-full flex-col rounded-[20px] bg-tile p-2 pb-5 sm:rounded-[28px] sm:p-3 sm:pb-7 transition-transform duration-150 ease-out active:scale-[0.99]"
      >
        <div className="overflow-hidden rounded-[14px] sm:rounded-[18px]">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              width={500}
              height={625}
              priority={priority}
              sizes="(min-width: 1024px) 300px, 50vw"
              className="aspect-[4/5] w-full object-cover transition-transform duration-300 ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover:scale-[1.03]"
            />
          ) : (
            <div className="aspect-[4/5] bg-fill" />
          )}
        </div>
        <h3 className="mx-2 mt-4 text-[15px] sm:mx-5 sm:mt-5 sm:text-[19px] leading-tight font-semibold tracking-[-0.02em] text-balance">{product.name}</h3>
        <p className="mx-2 mt-1 text-xs text-label-2 sm:mx-5 sm:text-sm">
          {product.color} · {product.material}
        </p>
        <div className="mx-2 mt-auto flex flex-wrap items-end justify-between gap-x-3 gap-y-2 pt-4 sm:mx-5 sm:pt-5">
          <span className="text-[15px] tabular-nums sm:text-[17px]">{price(product.priceCents)}</span>
          {rec && <SizeBadge size={rec.size} inStock={inStock} estimated={rec.estimated} />}
        </div>
      </Link>
    </li>
  );
}

function SizeBadge({ size, inStock, estimated }: { size: string | null; inStock: boolean; estimated: boolean }) {
  if (!size) return <span className="text-xs text-label-2">Hors de notre tableau de tailles</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-label-2">
      <span className="max-sm:sr-only">{inStock ? "Votre taille" : "Épuisé en"}</span>
      <span
        className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2.5 text-[13px] font-semibold tabular-nums ${
          inStock ? "bg-accent text-white" : "bg-fill text-label-2 line-through"
        }`}
        title={estimated ? "Taille estimée" : undefined}
      >
        {size}
      </span>
    </span>
  );
}
