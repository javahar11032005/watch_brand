"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import { useInView } from "@/hooks/useInView";

export type CinematicVideoMode = "background" | "hover-preview" | "click-to-play";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
function subscribeHover(callback: () => void) {
  const mql = window.matchMedia(HOVER_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function useSupportsHover(): boolean {
  return useSyncExternalStore(
    subscribeHover,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false
  );
}

type CinematicVideoProps = {
  youtubeId?: string | null;
  posterUrl: string;
  posterAlt: string;
  mode?: CinematicVideoMode;
  className?: string;
  overlay?: React.ReactNode;
  title?: string;
  priority?: boolean;
  /**
   * Set false for anything that must start the instant it mounts (the
   * hero) — skips the IntersectionObserver gate entirely. Defaults to
   * true (lazy) for everything below the fold, per the "don't autoplay
   * everything at once" performance requirement.
   */
  lazy?: boolean;
};

/**
 * A single reusable, failure-proof wrapper around a YouTube video: the
 * poster image is always the base layer, and the player only ever fades in
 * on top once it has genuinely confirmed playback (real IFrame Player API
 * state, not just "the iframe document loaded"). Any error, timeout, or
 * missing id quietly leaves the poster exactly as it was — never YouTube's
 * own "Video unavailable" UI, never an empty box.
 *
 * Swap footage later by changing `youtubeId` (see src/data/media.ts and
 * Product.videoId) — pass null/undefined to always show `posterUrl`.
 */
export default function CinematicVideo({
  youtubeId,
  posterUrl,
  posterAlt,
  mode = "background",
  className = "",
  overlay,
  title = "Kestrel Watch Co.",
  priority = false,
  lazy = true,
}: CinematicVideoProps) {
  const reducedMotion = useReducedMotion();
  const supportsHover = useSupportsHover();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const observedInView = useInView(wrapperRef, { rootMargin: "300px" });
  const inView = lazy ? observedInView : true;

  const [hovering, setHovering] = useState(false);
  const [clicked, setClicked] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const eligible = Boolean(youtubeId) && !reducedMotion;
  const wantsBackgroundPlayer = mode === "background" && eligible && inView;
  const wantsHoverPlayer = mode === "hover-preview" && eligible && supportsHover && inView;
  const wantsClickPlayer = mode === "click-to-play" && eligible && clicked;

  const enabled = wantsBackgroundPlayer || wantsHoverPlayer || wantsClickPlayer;

  const { status, play, pause } = useYouTubePlayer({
    containerRef: playerContainerRef,
    videoId: youtubeId,
    enabled,
    autoplay: mode !== "hover-preview", // hover mode: cue on view, play only on hover
    muted: mode !== "click-to-play",
  });

  useEffect(() => {
    if (mode !== "hover-preview" || status === "idle" || status === "loading") return;
    if (hovering) play();
    else pause();
  }, [hovering, mode, status, play, pause]);

  function handleEnter() {
    if (mode !== "hover-preview" || !supportsHover) return;
    timeoutRef.current = setTimeout(() => setHovering(true), 150);
  }
  function handleLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHovering(false);
  }

  const videoVisible = enabled && status === "playing";

  return (
    <div
      ref={wrapperRef}
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

      {enabled && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            videoVisible ? "opacity-100" : "opacity-0"
          }`}
          style={{ pointerEvents: mode === "click-to-play" ? "auto" : "none" }}
        >
          <div ref={playerContainerRef} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
        </div>
      )}

      {mode === "click-to-play" && !wantsClickPlayer && (
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

      {mode === "click-to-play" && wantsClickPlayer && (status === "idle" || status === "loading") && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border border-porcelain/30 border-t-champagne animate-spin" />
        </div>
      )}

      {overlay}
    </div>
  );
}
