import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Loader2, Shuffle } from "lucide-react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useState, useEffect, useRef } from "react";

const genreInfo: Record<string, { title: string; description: string; image: string }> = {
  "progressive-psy": {
    title: "Progressive Psytrance",
    description: "Deep, rolling basslines and hypnotic atmospheres for the modern dancefloor.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663076706091/BgRhmMWVCYtOlaEA.jpg"
  },
  "psychedelic-trance": {
    title: "Psychedelic Trance",
    description: "Driving basslines, FM synthesis, and futuristic sounds from the UK psy scene.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663076706091/WJSgWEwjOavDAFXF.jpg"
  },
  "goa-trance": {
    title: "Goa Trance",
    description: "The roots of the movement. Melodic, spiritual, and organic sounds from the golden era.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663076706091/AKbdiOIXkkfdBaUp.jpg"
  },
  "full-on": {
    title: "Full-On",
    description: "High energy, driving beats, and dynamic melodies designed to blast the night away.",
    image: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663076706091/hBtFcRhegmWlMbPh.jpg"
  }
};

export default function Genre() {
  const { id } = useParams<{ id: string }>();
  const genre = genreInfo[id || ""] || genreInfo["progressive-psy"];
  const { data: mixes, isLoading } = trpc.mixes.byCategory.useQuery({ category: id as any });

  usePageMeta({
    title: `${genre.title} Mixes`,
    description: `${genre.description} Browse and play curated ${genre.title} mixes from Psychedelic Universe's collection of 5,000+ tracks.`,
    canonicalPath: `/genre/${id}`,
  });
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shuffledMixes, setShuffledMixes] = useState<typeof mixes>([]);
  const playerRef = useRef<HTMLIFrameElement>(null);

  // Initialize shuffled mixes when data loads
  useEffect(() => {
    if (mixes && mixes.length > 0) {
      setShuffledMixes([...mixes]);
    }
  }, [mixes]);

  const handleShuffle = () => {
    if (shuffledMixes && shuffledMixes.length > 0) {
      const shuffled = [...shuffledMixes].sort(() => Math.random() - 0.5);
      setShuffledMixes(shuffled);
      setCurrentIndex(0);
      setIsPlaying(true);
    }
  };

  const handlePlay = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    if (shuffledMixes && currentIndex < shuffledMixes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentMix = shuffledMixes?.[currentIndex];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative h-[40vh] overflow-hidden">
        <img 
          src={genre.image} 
          alt={genre.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
        <div className="relative z-10 container h-full flex flex-col justify-end pb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-primary hover:text-primary/80">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portal
            </Button>
          </Link>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{genre.title}</h1>
          <p className="text-lg text-gray-300 max-w-2xl">{genre.description}</p>
          
          {shuffledMixes && shuffledMixes.length > 0 && (
            <div className="flex gap-4 mt-6">
              <Button 
                onClick={() => handlePlay(0)} 
                className="bg-primary hover:bg-primary/90 text-background font-semibold"
              >
                <Play className="w-5 h-5 mr-2 fill-current" /> Play All
              </Button>
              <Button 
                onClick={handleShuffle}
                variant="outline" 
                className="border-primary/50 hover:bg-primary/10"
              >
                <Shuffle className="w-5 h-5 mr-2" /> Shuffle
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Player Section */}
      {isPlaying && currentMix && (
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-lg border-b border-primary/20">
          <div className="container py-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-primary mb-1">Now Playing</p>
                <p className="text-white font-medium truncate">{currentMix.title}</p>
                {currentMix.artist && (
                  <p className="text-sm text-gray-400">{currentMix.artist}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  Prev
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleNext}
                  disabled={!shuffledMixes || currentIndex >= shuffledMixes.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
            <div className="mt-4 aspect-video max-h-[300px] rounded-lg overflow-hidden">
              <iframe
                ref={playerRef}
                src={`https://www.youtube.com/embed/${currentMix.youtubeId}?autoplay=1&rel=0`}
                title={currentMix.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Tracks List */}
      <div className="container py-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : shuffledMixes && shuffledMixes.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{shuffledMixes.length} Tracks</h2>
            </div>
            <div className="space-y-2">
              {shuffledMixes.map((mix, index) => (
                <div
                  key={mix.id}
                  onClick={() => handlePlay(index)}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                    currentIndex === index && isPlaying
                      ? "bg-primary/20 border border-primary/50"
                      : "bg-black/20 hover:bg-black/40 border border-transparent"
                  }`}
                >
                  <div className="w-10 h-10 flex items-center justify-center">
                    {currentIndex === index && isPlaying ? (
                      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                    ) : (
                      <span className="text-gray-500">{index + 1}</span>
                    )}
                  </div>
                  <img
                    src={mix.thumbnailUrl || `https://img.youtube.com/vi/${mix.youtubeId}/mqdefault.jpg`}
                    alt={mix.title}
                    className="w-16 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${currentIndex === index && isPlaying ? "text-primary" : "text-white"}`}>
                      {mix.title}
                    </p>
                    {mix.artist && (
                      <p className="text-sm text-gray-400 truncate">{mix.artist}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 hover:bg-primary/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlay(index);
                    }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </Button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No tracks in this genre yet.</p>
            <p className="text-sm text-gray-500">Tracks are being populated from the YouTube playlist.</p>
          </div>
        )}
      </div>
    </div>
  );
}
