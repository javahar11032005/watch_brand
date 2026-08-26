"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Expand, ZoomIn } from "lucide-react";
import { useYouTubePlayer } from "@/hooks/useYouTubePlayer";
import ImageLightbox from "./ImageLightbox";

type ProductMediaViewerProps = {
  youtubeId: string | null;
  posterUrl: string;
  posterAlt: string;
  title: string;
  className?: string;
};

/**
 * The main product-detail viewer: a square/portrait cinematic frame. When a
 * campaign clip is available it plays on demand with custom play/pause/mute
 * controls and a fullscreen expand — never YouTube's own player chrome
 * (controls are fully custom, driven by the real IFrame Player API so we
 * always know true playback state). When there's no video, the poster
 * becomes a click-to-zoom lightbox image instead. Either way the watch is
 * always visibly on screen; nothing here can render as an empty box.
 */
export default function ProductMediaViewer({
  youtubeId,
  posterUrl,
  posterAlt,
  title,
  className = "",
}: ProductMediaViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [muted, setMuted] = useState(true);

  const hasVideo = Boolean(youtubeId);

  const { status, play, pause, toggleMute, isMuted } = useYouTubePlayer({
    containerRef: playerContainerRef,
    videoId: youtubeId,
    enabled: hasVideo && started,
    autoplay: true,
    muted: true,
    loop: true,
  });

  useEffect(() => {
    const handler = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const playing = status === "playing";
  const videoVisible = started && playing;
  const failed = started && status === "error";

  function handleToggleFullscreen() {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  function handleToggleMute() {
    toggleMute();
    setMuted(!isMuted());
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative aspect-square overflow-hidden bg-porcelain-3 group ${
        isFullscreen ? "flex items-center justify-center bg-charcoal" : ""
      } ${className}`}
    >
      <Image
        src={posterUrl}
        alt={posterAlt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className={`object-cover transition-opacity duration-700 ${videoVisible ? "opacity-0" : "opacity-100"}`}
        priority
      />

      {hasVideo && started && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${videoVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div ref={playerContainerRef} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full" />
        </div>
      )}

      {/* Play button — only before the viewer has ever started, and only when a video actually exists */}
      {hasVideo && !started && !failed && (
        <button
          onClick={() => setStarted(true)}
          className="absolute inset-0 flex items-center justify-center focus-ring"
          aria-label={`Play ${title}`}
        >
          <div className="absolute inset-0 bg-charcoal/15 group-hover:bg-charcoal/25 transition-colors duration-300" />
          <span className="relative z-10 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-porcelain/60 group-hover:border-champagne group-hover:scale-105 transition-all duration-300 bg-charcoal/50 backdrop-blur-sm">
            <Play size={20} className="ml-1 text-porcelain" fill="currentColor" />
          </span>
        </button>
      )}

      {hasVideo && started && (status === "idle" || status === "loading") && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full border border-ink/20 border-t-brass animate-spin" />
        </div>
      )}

      {/* No video (or it failed): the poster itself is the zoomable product image */}
      {(!hasVideo || failed) && (
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 flex items-end justify-end p-4 focus-ring"
          aria-label={`Zoom into ${title}`}
        >
          <span className="flex items-center justify-center w-11 h-11 rounded-full bg-porcelain/90 text-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn size={18} strokeWidth={1.5} />
          </span>
        </button>
      )}

      {/* Custom controls — no native YouTube UI is ever shown */}
      {hasVideo && started && !failed && (
        <div className="absolute bottom-0 inset-x-0 flex items-center gap-3 p-4 bg-gradient-to-t from-charcoal/70 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          <button
            onClick={playing ? pause : play}
            aria-label={playing ? "Pause" : "Play"}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-porcelain/40 text-porcelain hover:border-champagne hover:text-champagne transition-colors focus-ring"
          >
            {playing ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
          <button
            onClick={handleToggleMute}
            aria-label={muted ? "Unmute" : "Mute"}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-porcelain/40 text-porcelain hover:border-champagne hover:text-champagne transition-colors focus-ring"
          >
            {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>
          <div className="flex-1" />
          <button
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Expand"}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-porcelain/40 text-porcelain hover:border-champagne hover:text-champagne transition-colors focus-ring"
          >
            <Expand size={14} />
          </button>
        </div>
      )}

      <ImageLightbox
        open={lightboxOpen}
        imageUrl={posterUrl}
        alt={posterAlt}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
