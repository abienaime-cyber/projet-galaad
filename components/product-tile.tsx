import Image from "next/image";
import Link from "next/link";
import { StaggerItem } from "@/components/motion";
import { price, type Fitted } from "@/lib/shop";

// Carte du MASTER : fond blanc, rayon 12 px, ombre qui monte au survol. À poser dans une liste <Stagger>.
export function ProductTile({ item, priority, heading: Heading = "h2" }: { item: Fitted; priority?: boolean; heading?: "h2" | "h3" }) {
  const { product, rec, inStock } = item;
  return (
    <StaggerItem>
      <Link
        href={`/produit/${product.slug}`}
        prefetch={priority}
        className="group card flex h-full flex-col overflow-hidden transition-[box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="relative bg-muted">
          {product.image ? (
            <Image
              src={product.image}
              alt=""
              width={500}
              height={625}
              priority={priority}
              sizes="(min-width: 1280px) 300px, (min-width: 768px) 25vw, 50vw"
              className="aspect-[4/5] w-full object-cover"
            />
          ) : (
            <div className="aspect-[4/5]" />
          )}
          {rec && <SizeBadge size={rec.size} inStock={inStock} estimated={rec.estimated} />}
        </div>
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <Heading className="font-sans text-[14px] leading-snug font-semibold sm:text-[15px]">{product.name}</Heading>
          <p className="mt-1 text-[13px] text-muted-foreground">
            {product.color} · {product.material}
          </p>
          <p className="figures mt-auto pt-3 text-[15px] font-semibold">{price(product.priceCents)}</p>
        </div>
      </Link>
    </StaggerItem>
  );
}

// Pastille blanche posée sur la photo, en haut à gauche : la taille se lit avant le nom.
function SizeBadge({ size, inStock, estimated }: { size: string | null; inStock: boolean; estimated: boolean }) {
  const base = "absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-sm";
  if (!size) return <span className={`${base} text-[12px] text-muted-foreground`}>Hors de notre tableau de tailles</span>;
  return (
    <span className={base} title={estimated ? "Taille estimée" : undefined}>
      <span className="text-[12px] text-muted-foreground max-sm:sr-only">{inStock ? "Votre taille" : "Épuisé en"}</span>
      <span className={`figures text-[14px] leading-none font-bold ${inStock ? "text-accent" : "text-muted-foreground line-through"}`}>{size}</span>
    </span>
  );
}
