import Link from "next/link";
import { listProducts } from "@/services/productService";
import Reveal from "@/components/ui/Reveal";
import CollectionGrid from "./CollectionGrid";

export default async function CollectionTeaser() {
  const products = await listProducts();

  return (
    <section id="collection" className="py-24 md:py-36 bg-porcelain">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14 md:mb-20">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">The Collection</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance max-w-xl text-ink">
              Five references. One point of view.
            </h2>
          </div>
          <Link
            href="/collection"
            className="text-xs tracking-[0.2em] uppercase text-ink/75 hover:text-brass transition-colors focus-ring"
          >
            View Full Collection →
          </Link>
        </Reveal>

        <CollectionGrid products={products} />
      </div>
    </section>
  );
}
