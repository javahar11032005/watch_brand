import Reveal from "@/components/ui/Reveal";
import AnimatedNumber from "@/components/ui/AnimatedNumber";

const STATS = [
  { value: 72, suffix: " HRS", label: "Power reserve, Meridian Atelier" },
  { value: 128, suffix: "", label: "Mechanical components, base movement" },
  { value: 10, suffix: " ATM", label: "Water resistance, Nocturne & Chrono" },
  { value: 6, suffix: "", label: "Positions regulated before shipping" },
];

export default function PrecisionStats() {
  return (
    <section className="py-24 md:py-32 bg-porcelain-2 border-y border-taupe">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="max-w-xl mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Precision</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance text-ink">
            Measured, not claimed.
          </h2>
        </Reveal>

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
