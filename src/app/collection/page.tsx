import type { Metadata } from "next";
import { listProducts } from "@/services/productService";
import CollectionGrid from "@/components/collection/CollectionGrid";
import Reveal from "@/components/ui/Reveal";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Collection — Kestrel Watch Co.",
  description: "Five Meridian references, each a different reading of the same house philosophy.",
};

export default async function CollectionPage() {
  const products = await listProducts();

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-porcelain">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">The Collection</p>
          <h1 className="font-serif text-5xl md:text-6xl leading-tight text-balance text-ink">
            The Meridian line.
          </h1>
          <p className="mt-5 text-slate leading-relaxed max-w-lg">
            Five references, one philosophy: precision expressed through proportion, not
            ornament. Every case, dial and strap combination is configurable on its own page.
          </p>
        </Reveal>

        <CollectionGrid products={products} />
      </div>
    </div>
  );
}
