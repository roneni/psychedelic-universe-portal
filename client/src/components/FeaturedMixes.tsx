import { YouTubeEmbed } from "./YouTubeEmbed";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const featuredMixes = [
  { id: "mix1", videoId: "dQw4w9WgXcQ", title: "Back to Goa | Retro Goa Trance DJ Mix" }, // Placeholder ID, will update if real one found
  { id: "mix2", videoId: "dQw4w9WgXcQ", title: "Journey To The Depth of the Universe (Pt. 2)" },
  { id: "mix3", videoId: "dQw4w9WgXcQ", title: "Happy New Year 2026 | Progressive Psytrance" }
];

export function FeaturedMixes() {
  return (
    <section className="py-24 bg-black/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
      
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">LATEST TRANSMISSIONS</h2>
            <p className="text-muted-foreground">Fresh mixes from the Psychedelic Universe headquarters.</p>
          </div>
          <Button variant="outline" className="group border-primary/30 hover:border-primary hover:bg-primary/10">
            VIEW ALL VIDEOS <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredMixes.map((mix) => (
            <div key={mix.id} className="space-y-4">
              <YouTubeEmbed videoId={mix.videoId} title={mix.title} />
              <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                {mix.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
