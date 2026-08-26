import { listProducts } from "@/services/productService";
import Reveal from "@/components/ui/Reveal";
import CollectionGrid from "./CollectionGrid";

export default async function RelatedWatches({
  collectionKey,
  excludeSlug,
}: {
  collectionKey: string;
  excludeSlug: string;
}) {
  const products = (await listProducts({ collectionKey })).filter((p) => p.slug !== excludeSlug);
  if (products.length === 0) return null;

  return (
    <section className="mb-4">
      <Reveal className="mb-10">
        <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Related Watches</p>
        <h2 className="font-serif text-3xl md:text-4xl text-balance text-ink">More from the house.</h2>
      </Reveal>
      <CollectionGrid products={products.slice(0, 3)} />
    </section>
  );
}
