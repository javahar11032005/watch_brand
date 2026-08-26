"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type CinematicVideoMode = "background" | "hover-preview" | "click-to-play" | "in-view";

type CinematicVideoProps = {
  /** Local file under /public, e.g. "/videos/watches/homepage.mp4". Never a YouTube id — this is a real <video> element, so there is no external branding to fight. */
  videoSrc?: string | null;
  posterUrl: string;
  posterAlt: string;
  mode?: CinematicVideoMode;
  className?: string;
  overlay?: React.ReactNode;
  title?: string;
  priority?: boolean;
};

/**
 * A single reusable video wrapper built on a plain, self-hosted <video>
 * element — no third-party player, no YouTube branding of any kind, and no
 * script to load before playback can start. The poster is always the base
 * layer; the video only fades in once it has actually started decoding
 * frames, so a slow network or missing file never shows an empty box.
 *
 * Swap footage later by changing `videoSrc` (see src/data/media.ts) — pass
 * null/undefined to always show `posterUrl` with no video at all.
 */
export default function CinematicVideo({
  videoSrc,
  posterUrl,
  posterAlt,
  mode = "background",
  className = "",
  overlay,
  title = "Kestrel Watch Co.",
  priority = false,
}: CinematicVideoProps) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [inView, setInView] = useState(false);

  const eligible = Boolean(videoSrc) && !reducedMotion && !failed;
  const active =
    mode === "click-to-play" ? clicked && eligible : mode === "in-view" ? inView && eligible : eligible;

  // "in-view" plays only while the card is actually on screen — scrolling
  // five autoplaying videos in at once on a grid is both wasteful and, per
  // browser autoplay heuristics, unreliable. Pauses again once scrolled
  // past so it doesn't keep decoding off-screen.
  useEffect(() => {
    if (mode !== "in-view" || !containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.4,
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [mode]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (mode === "in-view") {
      el.muted = true;
      if (inView) el.play().catch(() => setFailed(true));
      else el.pause();
      return;
    }

    if (!active) return;

    if (mode === "background") {
      // Belt-and-suspenders: some browsers gate autoplay on the live DOM
      // property rather than the initial `muted` attribute, so set it
      // explicitly right before play() instead of trusting JSX alone.
      el.muted = true;
    }

    if (mode === "background" || mode === "click-to-play") {
      el.play().catch(() => setFailed(true));
    }
  }, [active, mode, inView]);

  function handleEnter() {
    if (mode !== "hover-preview") return;
    videoRef.current?.play().catch(() => setFailed(true));
  }
  function handleLeave() {
    if (mode !== "hover-preview") return;
    videoRef.current?.pause();
  }

  const videoVisible = active && playing;

  return (
    <div
      ref={containerRef}
      // No hardcoded `relative` here on purpose: every current caller passes
      // `absolute inset-0` via `className`, and Tailwind's position utilities
      // conflict when both `relative` and `absolute` land on the same
      // element (same specificity — whichever is defined later in Tailwind's
      // own stylesheet wins the cascade, not whichever is listed later in
      // this string) collapsing the whole video/poster to zero height. The
      // caller's className is required to supply its own position utility.
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <Image
        src={posterUrl}
        alt={posterAlt}
        fill
        priority={priority}
        sizes="100vw"
        className={`object-cover transition-opacity duration-700 ${
          videoVisible ? "opacity-0" : "opacity-100"
        }`}
      />

      {eligible && videoSrc && (mode !== "click-to-play" || clicked) && (
        <video
          ref={videoRef}
          src={videoSrc}
          poster={posterUrl}
          muted={mode !== "click-to-play"}
          loop
          playsInline
          autoPlay={mode === "background"}
          controls={false}
          aria-label={title}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            videoVisible ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {mode === "click-to-play" && !clicked && eligible && (
        <button
          onClick={() => setClicked(true)}
          className="absolute inset-0 flex items-center justify-center group focus-ring"
          aria-label={`Play ${title}`}
        >
          <div className="absolute inset-0 bg-navy/30 group-hover:bg-navy/10 transition-colors duration-300" />
          <span className="relative z-10 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-porcelain/50 group-hover:border-champagne group-hover:scale-105 transition-all duration-300 bg-navy/40 backdrop-blur-sm">
            <Play size={20} className="ml-1 text-porcelain group-hover:text-champagne transition-colors" fill="currentColor" />
          </span>
        </button>
      )}

      {overlay}
    </div>
  );
}
