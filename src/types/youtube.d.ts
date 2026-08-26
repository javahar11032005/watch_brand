// Minimal ambient types for the YouTube IFrame Player API — just enough
// surface area for src/lib/youtubeApiLoader.ts and useYouTubePlayer.ts.
declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface PlayerEvent {
    target: Player;
  }

  interface OnStateChangeEvent extends PlayerEvent {
    data: PlayerState;
  }

  interface OnErrorEvent extends PlayerEvent {
    data: number;
  }

  interface PlayerVars {
    autoplay?: 0 | 1;
    mute?: 0 | 1;
    loop?: 0 | 1;
    playlist?: string;
    controls?: 0 | 1;
    modestbranding?: 0 | 1;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    fs?: 0 | 1;
    disablekb?: 0 | 1;
    iv_load_policy?: 1 | 3;
    origin?: string;
  }

  interface Events {
    onReady?: (event: PlayerEvent) => void;
    onStateChange?: (event: OnStateChangeEvent) => void;
    onError?: (event: OnErrorEvent) => void;
  }

  interface PlayerOptions {
    videoId: string;
    playerVars?: PlayerVars;
    events?: Events;
  }

  class Player {
    constructor(element: HTMLElement | string, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    destroy(): void;
    getPlayerState(): PlayerState;
  }
}
