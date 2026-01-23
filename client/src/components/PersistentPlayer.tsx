import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  Youtube,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Main playlist with 5000+ tracks
const MAIN_PLAYLIST_ID = "PLIVLAENoBSJfgJbBPOUFmjoKxkMeKMM4P";

export function PersistentPlayer() {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState([80]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<{
    title: string;
    videoId: string;
  } | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Load YouTube IFrame API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setIsApiReady(true);
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      setIsApiReady(true);
    };

    return () => {
      window.onYouTubeIframeAPIReady = () => {};
    };
  }, []);

  // Initialize player when API is ready
  useEffect(() => {
    if (!isApiReady || !playerRef.current || player) return;

    const ytPlayer = new window.YT.Player(playerRef.current, {
      height: "1",
      width: "1",
      playerVars: {
        listType: "playlist",
        list: MAIN_PLAYLIST_ID,
        autoplay: 0,
        controls: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
      },
      events: {
        onReady: (event: any) => {
          setPlayer(event.target);
          event.target.setShuffle(true);
          event.target.setVolume(80);
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);

          // Get current video info
          const videoData = event.target.getVideoData();
          if (videoData && videoData.title) {
            setCurrentTrack({
              title: videoData.title,
              videoId: videoData.video_id,
            });
          }
        },
      },
    });

    return () => {
      if (ytPlayer && ytPlayer.destroy) {
        ytPlayer.destroy();
      }
    };
  }, [isApiReady]);

  // Handle volume changes
  useEffect(() => {
    if (player && player.setVolume) {
      player.setVolume(isMuted ? 0 : volume[0]);
    }
  }, [volume, isMuted, player]);

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleNext = () => {
    if (player) {
      player.nextVideo();
    }
  };

  const handlePrev = () => {
    if (player) {
      player.previousVideo();
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isExpanded ? "translate-y-0" : "translate-y-[calc(100%-4px)]"
      )}
      ref={playerContainerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Hidden YouTube Player */}
      <div className="absolute opacity-0 pointer-events-none w-1 h-1 overflow-hidden">
        <div ref={playerRef}></div>
      </div>

      {/* Collapse/Expand Handle */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 border-t border-x border-primary/30 rounded-t-xl px-6 py-1 cursor-pointer hover:bg-primary/10 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-8 h-1 bg-muted-foreground rounded-full"></div>
      </div>

      {/* Player Container */}
      <div className="bg-black/90 backdrop-blur-xl border-t border-primary/30 shadow-[0_-10px_40px_-15px_rgba(34,211,238,0.2)] p-4 md:px-8">
        <div className="container flex items-center justify-between gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-4 w-1/3">
            <div
              className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border border-white/10 relative",
                isPlaying && "animate-pulse-slow"
              )}
            >
              <img
                src="/images/logo.png"
                alt="Cover"
                className="w-full h-full object-contain bg-black"
              />
              {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <div className="flex gap-1 items-end h-4">
                    <div className="w-1 bg-primary animate-[bounce_1s_infinite] h-2"></div>
                    <div className="w-1 bg-primary animate-[bounce_1.2s_infinite] h-4"></div>
                    <div className="w-1 bg-primary animate-[bounce_0.8s_infinite] h-3"></div>
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:block overflow-hidden flex-1 min-w-0">
              {currentTrack ? (
                <a
                  href={`https://www.youtube.com/watch?v=${currentTrack.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <h4 className="text-white font-bold truncate group-hover:text-primary transition-colors">
                    {currentTrack.title}
                  </h4>
                  <p
                    className={cn(
                      "text-primary text-sm truncate flex items-center gap-2 transition-opacity",
                      isHovering ? "opacity-100" : "opacity-70"
                    )}
                  >
                    {isHovering ? (
                      <>
                        <Youtube className="w-4 h-4 text-red-500" />
                        Watch on YouTube
                        <ExternalLink className="w-3 h-3" />
                      </>
                    ) : (
                      "Psychedelic Universe"
                    )}
                  </p>
                </a>
              ) : (
                <>
                  <h4 className="text-white font-bold truncate">
                    Click play to start
                  </h4>
                  <p className="text-primary text-sm truncate">
                    5,000+ tracks ready
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 w-1/3">
            <div className="flex items-center gap-4 md:gap-6">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-white hidden md:flex"
                onClick={handlePrev}
              >
                <SkipBack className="w-5 h-5" />
              </Button>

              <Button
                size="icon"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_20px_-5px_rgba(34,211,238,0.5)] transition-all hover:scale-105"
                onClick={togglePlay}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current ml-1" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-white hidden md:flex"
                onClick={handleNext}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>

            {/* Progress Bar (Visual Only) */}
            <div className="w-full max-w-md flex items-center gap-2 text-xs text-muted-foreground hidden md:flex">
              <span className="text-primary">♪</span>
              <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full bg-primary transition-all",
                    isPlaying ? "w-full animate-pulse" : "w-0"
                  )}
                ></div>
              </div>
              <span>5,000+ tracks</span>
            </div>
          </div>

          {/* Volume & YouTube Link */}
          <div className="flex items-center justify-end gap-4 w-1/3">
            {/* YouTube Logo - Visible on Hover */}
            {currentTrack && (
              <a
                href={`https://www.youtube.com/watch?v=${currentTrack.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "transition-opacity hidden md:block",
                  isHovering ? "opacity-100" : "opacity-0"
                )}
              >
                <Youtube className="w-8 h-8 text-red-500 hover:scale-110 transition-transform" />
              </a>
            )}

            <div className="flex items-center gap-2 group">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="text-muted-foreground hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>
              <div className="w-24 hidden md:block transition-opacity opacity-50 group-hover:opacity-100">
                <Slider
                  value={volume}
                  max={100}
                  step={1}
                  className="cursor-pointer"
                  onValueChange={setVolume}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
