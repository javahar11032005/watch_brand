import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import { media } from "@/data/media";

const STATS = [
  { value: 60, suffix: " HRS", label: "Power reserve, Meridian Nocturne" },
  { value: 128, suffix: "", label: "Mechanical components, base movement" },
  { value: 10, suffix: " ATM", label: "Water resistance, Nocturne & Chrono" },
  { value: 6, suffix: "", label: "Positions regulated before shipping" },
];

export default function PrecisionStats() {
  return (
    <section id="precision" className="py-24 md:py-32 bg-porcelain-2 border-y border-taupe">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center mb-16 md:mb-20">
          <Reveal>
            <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Precision</p>
            <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance text-ink mb-5">
              Measured, not claimed.
            </h2>
            <p className="text-slate leading-relaxed max-w-md">
              Every Meridian movement is regulated across six positions before it ever reaches a
              case, and timed again once it does. We don&apos;t print a number on the dial we
              haven&apos;t verified ourselves.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="relative aspect-[4/3] w-full max-w-sm md:ml-auto overflow-hidden bg-porcelain-3">
            <Image
              src={media.macro.movement.url}
              alt={media.macro.movement.alt}
              fill
              sizes="(max-width: 768px) 90vw, 420px"
              className="object-cover"
            />
          </Reveal>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.08}>
              <p className="font-serif text-4xl md:text-6xl text-ink">
                <AnimatedNumber value={stat.value} />
                <span className="text-2xl md:text-3xl text-brass">{stat.suffix}</span>
              </p>
              <p className="mt-3 text-xs md:text-sm text-slate leading-snug max-w-[16ch]">
                {stat.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
