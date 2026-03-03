import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/usePageMeta";
import { ArrowLeft, Shuffle, SkipForward, ExternalLink, Youtube, Play } from "lucide-react";
import { Link } from "wouter";

// YouTube IFrame API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Mixes playlist ID
const MIXES_PLAYLIST_ID = "PLIVLAENoBSJcudnp-NfZUcJbPYj7SWrws";

export default function RadioMode() {
  usePageMeta({
    title: "24/7 Psytrance Radio",
    description: "Listen to non-stop psychedelic trance music. Curated mixes from top psytrance artists playing 24/7. Goa Trance, Progressive Psy, Full-On, and more.",
    canonicalPath: "/radio",
  });

  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{
    title: string;
    videoId: string;
  } | null>(null);
  const [isHovering, setIsHovering] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);

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
    if (!isApiReady || !playerRef.current) return;

    const ytPlayer = new window.YT.Player(playerRef.current, {
      height: "100%",
      width: "100%",
      playerVars: {
        listType: "playlist",
        list: MIXES_PLAYLIST_ID,
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
        },
        onStateChange: (event: any) => {
          setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          
          // Get current video info
          const videoData = event.target.getVideoData();
          if (videoData && videoData.title) {
            setCurrentVideo({
              title: videoData.title,
              videoId: videoData.video_id,
            });
          }
          
          if (event.data === window.YT.PlayerState.PLAYING) {
            setHasStarted(true);
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

  const handleShuffle = () => {
    if (player) {
      player.setShuffle(true);
      player.nextVideo();
    }
  };

  const handleNext = () => {
    if (player) {
      player.nextVideo();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src="/images/radio-bg.jpg"
          alt="Deep Space Nebula"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/70 backdrop-blur-sm"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-white">
              <ArrowLeft className="w-5 h-5" />
              Back to Portal
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary">
            Radio Mode
          </h1>
          <div className="w-32"></div>
        </div>

        {/* Player Container */}
        <div className="max-w-5xl mx-auto">
          {/* Video Player */}
          <div
            className="relative aspect-video rounded-2xl overflow-hidden border border-primary/30 shadow-[0_0_60px_-15px_rgba(34,211,238,0.3)] bg-black"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div ref={playerRef} className="w-full h-full"></div>

            {/* Play Button Overlay - Shows before video starts */}
            {!hasStarted && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer z-10"
                onClick={() => player?.playVideo()}
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center hover:bg-primary/30 hover:scale-110 transition-all shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]">
                    <Play className="w-12 h-12 text-primary fill-current ml-2" />
                  </div>
                  <p className="text-white text-lg font-medium">Click to Start Playing</p>
                  <p className="text-muted-foreground text-sm">Curated mixes from Psychedelic Universe</p>
                </div>
              </div>
            )}

            {/* Hover Overlay with Clickable Elements */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 transition-opacity duration-300 pointer-events-none ${
                isHovering ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Top Bar - YouTube Link */}
              <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start pointer-events-auto">
                {currentVideo && (
                  <a
                    href={`https://www.youtube.com/watch?v=${currentVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                  >
                    <Youtube className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                  </a>
                )}
              </div>

              {/* Bottom Bar - Track Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
                {currentVideo && (
                  <a
                    href={`https://www.youtube.com/watch?v=${currentVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl md:text-2xl font-bold text-white truncate group-hover:text-primary transition-colors">
                        {currentVideo.title}
                      </h3>
                      <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                        Click to watch on YouTube
                        <ExternalLink className="w-4 h-4" />
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10"
              onClick={handleShuffle}
            >
              <Shuffle className="w-5 h-5" />
              Shuffle
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 border-primary/50 hover:border-primary hover:bg-primary/10"
              onClick={handleNext}
            >
              <SkipForward className="w-5 h-5" />
              Next Mix
            </Button>
          </div>

          {/* Info Text */}
          <div className="text-center mt-12 text-muted-foreground">
            <p className="text-lg">
              Streaming curated mixes from the Psychedelic Universe collection
            </p>
            <p className="text-sm mt-2 opacity-70">
              Hover over the player to see track info and links
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
