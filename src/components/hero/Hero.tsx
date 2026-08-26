"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import CinematicVideo from "@/components/video/CinematicVideo";
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
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-charcoal"
    >
      <motion.div className="absolute inset-0" style={{ scale, opacity }}>
        <CinematicVideo
          youtubeId={media.hero.youtubeId}
          posterUrl={media.hero.posterUrl}
          posterAlt={media.hero.posterAlt}
          mode="background"
          className="absolute inset-0"
          title={media.hero.title}
          priority
          lazy={false}
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/30" />
      <div className="absolute inset-0 bg-charcoal/20" />

      <div className="relative z-10 h-full flex flex-col items-center justify-end pb-28 md:pb-32 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-xs md:text-sm tracking-[0.35em] uppercase text-champagne mb-5"
        >
          Kestrel Watch Co.
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="font-serif text-[13vw] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl text-balance"
        >
          Time, <span className="italic text-champagne">refined.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="mt-6 max-w-md text-sm md:text-base text-ivory/70 leading-relaxed"
        >
          Precision, craftsmanship and the quiet art of mechanical watchmaking.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/collection"
            className="px-7 py-3.5 text-xs tracking-[0.2em] uppercase bg-ivory text-charcoal hover:bg-champagne transition-colors focus-ring"
          >
            Explore the Collection
          </Link>
          <Link
            href="#craft"
            className="px-7 py-3.5 text-xs tracking-[0.2em] uppercase border border-ivory/30 hover:border-champagne hover:text-champagne transition-colors focus-ring"
          >
            Discover the Craft
          </Link>
        </motion.div>
      </div>

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
  );
}
