import Link from "next/link";
import { primaryButton } from "@/components/field";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1180px] px-4 pt-24 text-center sm:px-8">
      <h1 className="text-[40px] md:text-[54px]">Cette page est introuvable.</h1>
      <p className="mx-auto mt-4 max-w-[30rem] text-[19px] text-muted-foreground">L’article a peut-être été retiré de la boutique.</p>
      <Link href="/costumes" className={`${primaryButton} mt-8`}>
        Voir les costumes
      </Link>
    </div>
  );
}
