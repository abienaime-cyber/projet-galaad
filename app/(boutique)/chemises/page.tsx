import type { Metadata } from "next";
import { CatalogPage } from "../catalog-page";

export const metadata: Metadata = { title: "Chemises" };

export default function ShirtsPage({ searchParams }: PageProps<"/chemises">) {
  return <CatalogPage category="shirt" title="Chemises" tagline="À votre taille, du S au 3XL" searchParams={searchParams} />;
}
