"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import Reveal from "@/components/ui/Reveal";
import { media } from "@/data/media";

const STAGES = [
  {
    eyebrow: "01 — The Material",
    title: "Every surface tells you how it was made.",
    copy: "Cases begin as solid billet, cut on a five-axis mill. Brushed and polished steel meet at a hand-set bevel; the crystal is domed sapphire with anti-reflective coating on both faces.",
    image: media.craftsmanship.machining,
  },
  {
    eyebrow: "02 — The Craft",
    title: "Finished by hand, under a loupe.",
    copy: "Bevels, brushing and polishing happen one component at a time. Applied indexes are set by hand at a five-degree tolerance — nothing on the dial is accidental.",
    image: media.craftsmanship.finishing,
  },
  {
    eyebrow: "03 — The Movement",
    title: "Turn it over.",
    copy: "A free-sprung balance, a skeletonised rotor, bridges finished with Côtes de Genève by hand before assembly — not after.",
    image: media.macro.movement,
  },
  {
    eyebrow: "04 — The Precision",
    title: "128 components, aligned to a fortieth of a millimetre.",
    copy: "Every Meridian movement is regulated across six positions before it ever reaches a case, and again once it does.",
    image: media.craftsmanship.testing,
  },
];

export default function ScrollStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (!containerRef.current) return;
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
          setActiveStage(idx);
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section id="craft" className="py-24 md:py-36 bg-charcoal">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 space-y-24">
          {STAGES.map((stage) => (
            <Reveal key={stage.title} className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs tracking-[0.3em] uppercase text-champagne mb-4">{stage.eyebrow}</p>
                <h3 className="font-serif text-3xl md:text-4xl mb-5 text-balance">{stage.title}</h3>
                <p className="text-ivory/70 leading-relaxed max-w-md">{stage.copy}</p>
              </div>
              <div className="relative aspect-square overflow-hidden bg-charcoal-2">
                <Image src={stage.image.url} alt={stage.image.alt} fill sizes="45vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="craft" ref={containerRef} className="relative bg-charcoal" style={{ height: `${STAGES.length * 100}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="mx-auto max-w-[1400px] h-full px-6 md:px-10 grid md:grid-cols-2 items-center gap-10">
          <div className="relative order-2 md:order-1">
            {STAGES.map((stage, i) => (
              <div
                key={stage.title}
                className="absolute inset-0 flex flex-col justify-center transition-opacity duration-700"
                style={{ opacity: activeStage === i ? 1 : 0, pointerEvents: activeStage === i ? "auto" : "none" }}
              >
                <p className="text-xs tracking-[0.3em] uppercase text-champagne mb-4">{stage.eyebrow}</p>
                <h3 className="font-serif text-3xl md:text-5xl mb-6 text-balance">{stage.title}</h3>
                <p className="text-ivory/70 leading-relaxed max-w-md">{stage.copy}</p>
              </div>
            ))}
          </div>

          <div className="relative order-1 md:order-2 aspect-square overflow-hidden">
            {STAGES.map((stage, i) => (
              <Image
                key={stage.title}
                src={stage.image.url}
                alt={stage.image.alt}
                fill
                sizes="45vw"
                className="object-cover transition-opacity duration-700"
                style={{ opacity: activeStage === i ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
          {STAGES.map((stage, i) => (
            <span
              key={stage.title}
              className="h-px w-8 transition-colors duration-500"
              style={{ background: activeStage === i ? "#c8b89a" : "rgba(242,239,232,0.2)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
