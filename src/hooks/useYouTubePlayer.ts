"use client";

import { useEffect, useRef, useState } from "react";
import { loadYouTubeIframeApi } from "@/lib/youtubeApiLoader";

export type YouTubePlayerStatus = "idle" | "loading" | "ready" | "playing" | "paused" | "error";

type UseYouTubePlayerOptions = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  videoId: string | null | undefined;
  enabled: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  /** How long to wait for onReady before treating this as a failed embed. */
  readyTimeoutMs?: number;
};

/**
 * Wraps the real YouTube IFrame Player API (not a bare <iframe src=...>) so
 * we get genuine playback state and error codes via postMessage — the only
 * reliable way to know a video actually started, since a blocked/embed-
 * disabled video still returns a 200 for the iframe document itself.
 *
 * Callers should treat `status === "error"` (or the pre-ready timeout) as
 * "fall back to the poster image" — never render YouTube's own error UI.
 */
export function useYouTubePlayer({
  containerRef,
  videoId,
  enabled,
  autoplay = false,
  muted = true,
  loop = false,
  readyTimeoutMs = 7000,
}: UseYouTubePlayerOptions) {
  const [status, setStatus] = useState<YouTubePlayerStatus>("idle");
  const playerRef = useRef<YT.Player | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!enabled || !videoId || !containerRef.current) {
      return;
    }

    let cancelled = false;
    readyRef.current = false;
    setStatus("loading");

    const timeoutId = setTimeout(() => {
      if (!cancelled && !readyRef.current) setStatus("error");
    }, readyTimeoutMs);

    loadYouTubeIframeApi()
      .then((YTNamespace) => {
        if (cancelled || !containerRef.current) return;

        const player = new YTNamespace.Player(containerRef.current, {
          videoId,
          playerVars: {
            autoplay: autoplay ? 1 : 0,
            mute: muted ? 1 : 0,
            loop: loop ? 1 : 0,
            playlist: loop ? videoId : undefined,
            controls: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            fs: 0,
            disablekb: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              readyRef.current = true;
              clearTimeout(timeoutId);
              setStatus("ready");
              if (autoplay) player.playVideo();
            },
            onStateChange: (event) => {
              if (cancelled) return;
              if (event.data === YTNamespace.PlayerState.PLAYING) setStatus("playing");
              else if (event.data === YTNamespace.PlayerState.PAUSED) setStatus("paused");
              else if (event.data === YTNamespace.PlayerState.ENDED && loop) {
                player.seekTo(0, true);
                player.playVideo();
              }
            },
            onError: () => {
              if (cancelled) return;
              clearTimeout(timeoutId);
              setStatus("error");
            },
          },
        });

        playerRef.current = player;
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      playerRef.current?.destroy();
      playerRef.current = null;
      setStatus("idle");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, videoId, autoplay, muted, loop]);

  return {
    status,
    play: () => playerRef.current?.playVideo(),
    pause: () => playerRef.current?.pauseVideo(),
    toggleMute: () => {
      const p = playerRef.current;
      if (!p) return;
      if (p.isMuted()) p.unMute();
      else p.mute();
    },
    isMuted: () => playerRef.current?.isMuted() ?? muted,
  };
}
