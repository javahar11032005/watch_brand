import Reveal from "@/components/ui/Reveal";

export default function WatchIntro() {
  return (
    <section id="story" className="py-32 md:py-48 bg-porcelain-2 flex items-center justify-center text-center">
      <Reveal className="max-w-3xl px-6">
        <p className="text-xs tracking-[0.3em] uppercase text-brass mb-6">Brand Philosophy</p>
        <h2 className="font-serif text-4xl md:text-6xl leading-tight text-balance text-ink">
          Designed around proportion,
          <br />
          <span className="italic text-brass">rather than</span> ornament.
        </h2>
      </Reveal>
    </section>
  );
}
