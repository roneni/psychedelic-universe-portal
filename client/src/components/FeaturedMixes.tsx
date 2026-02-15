import { YouTubeEmbed } from "./YouTubeEmbed";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { FavoriteButton } from "@/components/FavoriteButton";

// Fallback data for when database is empty - using real Psychedelic Universe videos
// IMPORTANT: Only add videos from the Psychedelic Universe channel (@PsychedelicUniverse)
// Verify channel name before adding any video ID to prevent non-channel content
const fallbackMixes = [
  { id: 1, videoId: "cZr28nrsLUI", title: "Journey To The Depth of the Universe (Pt. 2) DJ Mix" },
  { id: 2, videoId: "57hl5ZnGB_s", title: "November 2025 Progressive Psytrance DJ Mix" },
  { id: 3, videoId: "_ZQ1E-1MUKw", title: "StarLab - Oceans from Silence" }
];

export function FeaturedMixes() {
  const { data: mixes, isLoading } = trpc.mixes.featured.useQuery();

  // Use database mixes if available, otherwise use fallback
  const displayMixes = mixes && mixes.length > 0 
    ? mixes.map(mix => ({ id: mix.id, videoId: mix.youtubeId, title: mix.title }))
    : fallbackMixes;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle cosmic background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent z-0"></div>
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold neon-glow">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
                LATEST TRANSMISSIONS
              </span>
            </h2>
            <p className="text-gray-400 mt-2">Fresh from the Psychedelic Universe channel.</p>
          </div>
          <Button 
            variant="outline" 
            className="group border-primary/30 hover:border-primary hover:bg-primary/10 glass-card"
            onClick={() => window.open("https://www.youtube.com/@PsychedelicUniverse/videos", "_blank")}
          >
            VIEW ALL VIDEOS <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayMixes.map((mix) => (
              <div key={mix.id} className="space-y-4 glass-card rounded-xl p-4 gradient-border cosmic-tilt">
                <YouTubeEmbed videoId={mix.videoId} title={mix.title} />
                <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors cursor-pointer px-1">
                  {mix.title}
                </h3>
                <FavoriteButton mixId={mix.id} size="sm" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
