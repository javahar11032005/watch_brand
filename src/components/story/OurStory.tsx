import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { media } from "@/data/media";

/**
 * Replaces the old WatchIntro + ScrollStory + CraftsmanshipJourney trio —
 * three separate sections, one of them a 400vh GSAP-pinned scroll-jack on a
 * full-bleed dark background — with a single compact, editorial section.
 * Small/medium images only, no scroll-jacking, no full-screen photography;
 * two text-only bookends frame two short image+text moments in the middle.
 */
export default function OurStory() {
  return (
    <section id="story" className="py-24 md:py-36 bg-porcelain">
      <div className="mx-auto max-w-[1000px] px-6 md:px-10">
        <Reveal className="text-center max-w-xl mx-auto mb-16 md:mb-24">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Our Story</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance text-ink">
            Behind the Timepiece
          </h2>
        </Reveal>

        <div className="space-y-20 md:space-y-28">
          {/* 01 — The Idea (text only) */}
          <Reveal className="max-w-lg mx-auto text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-brass mb-4">01 — The Idea</p>
            <p className="text-ink/80 leading-relaxed text-balance">
              Kestrel began with a single question: what would a watch look like if it stopped
              trying to impress you? Not smaller ambitions — quieter ones. A case that disappears
              on the wrist. A dial with nothing on it that doesn&apos;t tell you the time.
            </p>
          </Reveal>

          {/* 02 — The Craft (image + text) */}
          <Reveal className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative aspect-[4/3] w-full max-w-sm mx-auto md:mx-0 overflow-hidden bg-porcelain-3">
              <Image
                src={media.craftsmanship.finishing.url}
                alt={media.craftsmanship.finishing.alt}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-brass mb-4">02 — The Craft</p>
              <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 text-balance">
                Finished by hand, under a loupe.
              </h3>
              <p className="text-slate leading-relaxed max-w-sm">
                Bevels, brushing and polishing happen one component at a time, the same way they
                did when the workshop opened. Nothing on a Meridian dial is stamped — every index
                is set by hand, to a tolerance you can measure but never quite see.
              </p>
            </div>
          </Reveal>

          {/* 03 — The Material (text + image, reversed) */}
          <Reveal className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative aspect-[4/3] w-full max-w-sm mx-auto md:mx-0 overflow-hidden bg-porcelain-3 md:order-2">
              <Image
                src={media.macro.gears.url}
                alt={media.macro.gears.alt}
                fill
                sizes="(max-width: 768px) 90vw, 420px"
                className="object-cover"
              />
            </div>
            <div className="md:order-1">
              <p className="text-xs tracking-[0.25em] uppercase text-brass mb-4">03 — The Material</p>
              <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4 text-balance">
                Every surface tells you how it was made.
              </h3>
              <p className="text-slate leading-relaxed max-w-sm">
                Cases begin as solid billet, cut on a five-axis mill. The crystal is domed
                sapphire, coated against glare on both faces. Every material is chosen for how it
                wears over decades, not how it photographs on day one.
              </p>
            </div>
          </Reveal>

          {/* 04 — Precision, Refined (text only) */}
          <Reveal className="max-w-lg mx-auto text-center pt-4 border-t border-taupe">
            <p className="text-xs tracking-[0.25em] uppercase text-brass mb-4">04 — Precision, Refined</p>
            <p className="font-serif text-xl md:text-2xl text-ink italic leading-snug text-balance">
              Tradition taught us how a watch should be made. Precision is what tells us it&apos;s
              ready to leave the workshop.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
