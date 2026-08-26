import { getProductBySlug } from "@/services/productService";
import Reveal from "@/components/ui/Reveal";
import Configurator from "./Configurator";

export default async function ConfiguratorSection() {
  const product = await getProductBySlug("meridian-atelier").catch(() => null);
  if (!product) return null;

  return (
    <section id="configurator" className="py-24 md:py-36 bg-porcelain-2">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="max-w-2xl mb-14 md:mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">The Atelier</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance text-ink">
            Configure your Meridian.
          </h2>
          <p className="mt-5 text-slate leading-relaxed max-w-lg">
            Choose a case, a dial, a strap — watch the price and specification update as you go.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <Configurator product={product} />
        </Reveal>
      </div>
    </section>
  );
}
