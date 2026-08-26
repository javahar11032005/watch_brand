import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function ProductStorySection({
  eyebrow,
  title,
  story,
  imageUrl,
  imageAlt,
}: {
  eyebrow: string;
  title: string;
  story: string;
  imageUrl: string;
  imageAlt: string;
}) {
  return (
    <section className="py-24 md:py-36 bg-porcelain">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid md:grid-cols-2 gap-10 md:gap-20 items-center">
        <Reveal className="relative aspect-[4/5] overflow-hidden order-2 md:order-1">
          <Image src={imageUrl} alt={imageAlt} fill sizes="45vw" className="object-cover" />
        </Reveal>
        <Reveal delay={0.1} className="order-1 md:order-2">
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">{eyebrow}</p>
          <h2 className="font-serif text-3xl md:text-5xl leading-tight text-balance text-ink mb-6">
            {title}
          </h2>
          <p className="text-slate leading-relaxed">{story}</p>
        </Reveal>
      </div>
    </section>
  );
}
