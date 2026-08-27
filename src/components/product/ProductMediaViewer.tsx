"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Expand, ZoomIn, X } from "lucide-react";
import ImageLightbox from "./ImageLightbox";

type ProductMediaViewerProps = {
  /** Local file under /public, e.g. "/videos/watches/homepage.mp4" — never a YouTube id. */
  videoSrc: string | null;
  posterUrl: string;
  posterAlt: string;
  title: string;
  className?: string;
};

/**
 * The main product-detail viewer: a square/portrait cinematic frame. When a
 * campaign clip is available it plays on demand with fully custom play/
 * pause/mute/expand controls over a plain self-hosted <video> element — no
 * third-party player embed exists here, so there is no branding to fight.
 * When there's no video, the poster becomes a click-to-zoom lightbox image
 * instead. Either way the watch is always visibly on screen.
 */
export default function ProductMediaViewer({
  videoSrc,
  posterUrl,
  posterAlt,
  title,
  className = "",
}: ProductMediaViewerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  // Starts unmuted: clicking "Watch Film" is itself a deliberate user
  // gesture, unlike an ambient autoplay background clip, so sound is
  // expected without an extra manual unmute step.
  const [muted, setMuted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasVideo = Boolean(videoSrc) && !failed;

  useEffect(() => {
    const handler = () => setIsFullscreen(document.fullscreenElement === wrapperRef.current);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  function handleStart() {
    setStarted(true);
    requestAnimationFrame(() => {
      videoRef.current?.play().catch(() => setFailed(true));
    });
  }

  function handleClose() {
    videoRef.current?.pause();
    setStarted(false);
    setPlaying(false);
  }

  function handleTogglePlay() {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setFailed(true));
    else el.pause();
  }

  function handleToggleMute() {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
  }

  function handleToggleFullscreen() {
    if (!wrapperRef.current) return;
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }

  const videoVisible = started && hasVideo;

  return (
    <div
      ref={wrapperRef}
      className={`relative aspect-square overflow-hidden bg-porcelain-3 group ${
        isFullscreen ? "flex items-center justify-center bg-charcoal" : ""
      } ${className}`}
    >
      <div className="absolute inset-0">
        <Image
          src={posterUrl}
          alt={posterAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover object-center transition-opacity duration-700 ${videoVisible ? "opacity-0" : "opacity-100"}`}
          priority
        />

        {hasVideo && videoSrc && started && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={posterUrl}
            muted={muted}
            loop
            playsInline
            controls={false}
            aria-label={title}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 opacity-100"
          />
        )}
      </div>

      {/* Play button — only before the viewer has ever started, and only when a video actually exists.
          User-initiated by design: the image is the first thing shown, the film is opt-in. */}
      {hasVideo && !started && (
        <button
          onClick={handleStart}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 focus-ring"
          aria-label={`Watch the film for ${title}`}
        >
          <div className="absolute inset-0 bg-charcoal/10 group-hover:bg-charcoal/20 transition-colors duration-300" />
          <span className="relative z-10 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border border-porcelain/60 group-hover:border-champagne group-hover:scale-105 transition-all duration-300 bg-charcoal/50 backdrop-blur-sm">
            <Play size={20} className="ml-1 text-porcelain" fill="currentColor" />
          </span>
          <span className="relative z-10 text-[10px] tracking-[0.25em] uppercase text-porcelain bg-charcoal/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
            Watch Film
          </span>
        </button>
      )}

      {/* No video (or it failed): the poster itself is the zoomable product image */}
      {!hasVideo && (
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

      {/* Custom controls — a plain <video> element, so there is no native branding to remove */}
      {hasVideo && started && (
        <div className="absolute bottom-0 inset-x-0 flex items-center gap-3 p-4 bg-gradient-to-t from-charcoal/70 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleTogglePlay}
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
          <button
            onClick={handleClose}
            aria-label="Close film"
            className="flex items-center justify-center w-9 h-9 rounded-full border border-porcelain/40 text-porcelain hover:border-champagne hover:text-champagne transition-colors focus-ring"
          >
            <X size={14} />
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
