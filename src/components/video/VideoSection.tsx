import Reveal from "@/components/ui/Reveal";
import CinematicVideo from "@/components/video/CinematicVideo";
import { media } from "@/data/media";

export default function VideoSection() {
  return (
    <section className="relative py-24 md:py-36 bg-porcelain overflow-hidden" id="film">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <Reveal className="mb-10 md:mb-14 max-w-2xl">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">The First Impression</p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-balance text-ink">
            A closer look at what precision actually looks like.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <CinematicVideo
            youtubeId={media.hero.youtubeId}
            posterUrl={media.hero.posterUrl}
            posterAlt={media.hero.posterAlt}
            mode="click-to-play"
            title={media.hero.title}
            className="aspect-video w-full bg-charcoal-2"
          />
        </Reveal>

        <p className="mt-4 text-xs text-slate max-w-lg">
          Placeholder campaign footage, standing in for a client-shot film — swap the video id in{" "}
          <code className="text-ink/50">src/data/media.ts</code> at any time.
        </p>
      </div>
    </section>
  );
}
