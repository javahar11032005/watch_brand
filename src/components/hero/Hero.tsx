"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import CinematicVideo from "@/components/video/CinematicVideo";
import Reveal from "@/components/ui/Reveal";
import { media } from "@/data/media";

function scrollToNextSection() {
  const hero = document.getElementById("hero");
  const next = hero?.nextElementSibling as HTMLElement | null;
  next?.scrollIntoView({ behavior: "smooth" });
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  return (
    <>
      {/* Full-screen background video — untouched */}
      <section
        id="hero"
        ref={sectionRef}
        className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-charcoal"
      >
        <motion.div className="absolute inset-0" style={{ scale, opacity }}>
          <CinematicVideo
            videoSrc={media.hero.videoSrc}
            posterUrl={media.hero.posterUrl}
            posterAlt={media.hero.posterAlt}
            mode="background"
            className="absolute inset-0"
            title={media.hero.title}
            priority
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30" />
        <div className="absolute inset-0 bg-charcoal/20" />

        <motion.button
          onClick={scrollToNextSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/50 hover:text-ivory/80 transition-colors focus-ring"
          aria-label="Scroll to explore"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase">Scroll to Explore</span>
          <ChevronDown size={20} strokeWidth={1} className="animate-bounce" />
        </motion.button>
      </section>

      {/* Hero copy — now its own section, revealed on scroll after the video */}
      <section className="bg-porcelain py-20 md:py-28 px-6 text-center">
        <Reveal>
          <p className="text-xs md:text-sm tracking-[0.35em] uppercase text-brass mb-5">
            Kestrel Watch Co.
          </p>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] text-balance text-ink">
            Time, <span className="italic text-brass">refined.</span>
          </h1>
          <p className="mt-6 max-w-md mx-auto text-sm md:text-base text-slate leading-relaxed">
            Precision, craftsmanship and the quiet art of mechanical watchmaking.
          </p>

          <div className="mt-10">
            <Link
              href="/collection"
              className="px-7 py-3.5 text-xs tracking-[0.2em] uppercase bg-ink text-porcelain hover:bg-brass transition-colors focus-ring"
            >
              Explore the Collection
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
