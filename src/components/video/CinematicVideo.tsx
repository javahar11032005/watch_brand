"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type CinematicVideoMode = "background" | "hover-preview" | "click-to-play";

type CinematicVideoProps = {
  /** Local file under /public, e.g. "/videos/hero-movement.mp4". Never a YouTube id — this is a real <video> element, so there is no external branding to fight. */
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [clicked, setClicked] = useState(false);

  const eligible = Boolean(videoSrc) && !reducedMotion && !failed;
  const active = mode === "click-to-play" ? clicked && eligible : eligible;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !active) return;

    if (mode === "background") {
      // Belt-and-suspenders: some browsers gate autoplay on the live DOM
      // property rather than the initial `muted` attribute, so set it
      // explicitly right before play() instead of trusting JSX alone.
      el.muted = true;
    }

    if (mode === "background" || mode === "click-to-play") {
      el.play().catch(() => setFailed(true));
    }
  }, [active, mode]);

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
      className={`relative overflow-hidden ${className}`}
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
          autoPlay={mode !== "click-to-play"}
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
