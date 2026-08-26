import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { media } from "@/data/media";

/**
 * A short, minimal replacement for the old Story/Craftsmanship sections —
 * one heading, a few lines of copy, one small supporting image. Nothing
 * scroll-jacked, nothing full-bleed.
 */
export default function BrandPhilosophy() {
  return (
    <section id="story" className="py-20 md:py-28 bg-porcelain">
      <div className="mx-auto max-w-3xl px-6 md:px-10 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Brand Philosophy</p>
          <h2 className="font-serif text-3xl md:text-4xl leading-tight text-balance text-ink mb-6">
            Designed around proportion, rather than ornament.
          </h2>
          <p className="text-slate leading-relaxed max-w-lg mx-auto">
            Kestrel began with a single question: what would a watch look like if it stopped
            trying to impress you? Every case is stripped back until only what matters remains —
            a legible dial, proportions that disappear on the wrist, and a movement finished as
            carefully on the inside as the case is on the outside.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative aspect-[16/9] w-full max-w-md mx-auto mt-10 overflow-hidden bg-porcelain-3">
          <Image
            src={media.craftsmanship.wrist.url}
            alt={media.craftsmanship.wrist.alt}
            fill
            sizes="(max-width: 768px) 90vw, 448px"
            className="object-cover"
          />
        </Reveal>
      </div>
    </section>
  );
}
