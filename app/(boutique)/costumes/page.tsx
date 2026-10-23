import type { Metadata } from "next";
import { CatalogPage } from "../catalog-page";

export const metadata: Metadata = { title: "Costumes" };

export default function SuitsPage({ searchParams }: PageProps<"/costumes">) {
  return <CatalogPage category="suit" title="Costumes" tagline="À votre taille, du 44 au 58." searchParams={searchParams} />;
}
