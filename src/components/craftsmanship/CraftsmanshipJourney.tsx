import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { media } from "@/data/media";

const STAGES = [
  {
    key: "design",
    label: "Design",
    copy: "Every reference starts as a proportion study, not a sketch of a dial — case, lug and crown drawn together until the silhouette holds on its own.",
    image: null,
  },
  {
    key: "machining",
    label: "Machining",
    copy: "Cases are cut from solid billet on a five-axis mill, held to tolerances measured in microns rather than millimetres.",
    image: media.craftsmanship.machining,
  },
  {
    key: "finishing",
    label: "Finishing",
    copy: "Bevels, brushing and polishing are still done by hand, under a loupe, one component at a time.",
    image: media.craftsmanship.finishing,
  },
  {
    key: "assembly",
    label: "Assembly",
    copy: "A single watchmaker assembles, regulates and casts each movement — their initials are engraved on the rotor when it's done.",
    image: media.craftsmanship.assembly,
  },
  {
    key: "testing",
    label: "Testing",
    copy: "Every watch is timed across six positions over ten days before it's allowed to leave the workshop.",
    image: media.craftsmanship.testing,
  },
  {
    key: "wrist",
    label: "Wrist",
    copy: "The only test that actually matters. It leaves Alderbrook only once it passes this one too.",
    image: media.craftsmanship.wrist,
  },
];

export default function CraftsmanshipJourney() {
  return (
    <section id="craftsmanship" className="py-24 md:py-36 bg-porcelain">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="max-w-2xl mb-16 md:mb-24">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Craftsmanship</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance text-ink">
            From billet to wrist, in six stages.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {STAGES.map((stage, i) => (
            <Reveal key={stage.key} delay={(i % 3) * 0.08}>
              <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-porcelain-3">
                {stage.image ? (
                  <>
                    <Image
                      src={stage.image.url}
                      alt={stage.image.alt}
                      fill
                      sizes="(max-width: 768px) 90vw, 33vw"
                      className="object-cover grayscale-[0.15] contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
                    <span className="absolute top-4 left-4 text-xs tracking-[0.2em] uppercase text-ivory/70">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </>
                ) : (
                  <>
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(155deg, #e1d8c3 0%, #ece5d4 100%)",
                      }}
                    />
                    <span className="absolute top-4 left-4 text-xs tracking-[0.2em] uppercase text-ink/50">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </>
                )}
              </div>
              <h3 className="font-serif text-xl mb-3 text-ink">{stage.label}</h3>
              <p className="text-sm text-slate leading-relaxed">{stage.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
