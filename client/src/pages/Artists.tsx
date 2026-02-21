import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Globe, Youtube, Music2, Headphones, Instagram, Facebook, ExternalLink, Search, Users, Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { usePageMeta } from "@/hooks/usePageMeta";

// Genre badge colors
const genreColors: Record<string, string> = {
  "progressive-psy": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  "psychedelic-trance": "bg-purple-500/20 text-purple-400 border-purple-500/30",
  "goa-trance": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  "full-on": "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

const genreLabels: Record<string, string> = {
  "progressive-psy": "Progressive Psytrance",
  "psychedelic-trance": "Psychedelic Trance",
  "goa-trance": "Goa Trance",
  "full-on": "Full-On",
};

// Country flag emoji helper
const getCountryFlag = (country: string): string => {
  const countryFlags: Record<string, string> = {
    "Israel": "🇮🇱",
    "Serbia": "🇷🇸",
    "Switzerland": "🇨🇭",
    "United Kingdom": "🇬🇧",
    "North Macedonia": "🇲🇰",
    "Spain": "🇪🇸",
    "Germany": "🇩🇪",
  };
  return countryFlags[country] || "🌍";
};

export default function Artists() {
  usePageMeta({
    title: "Artist Directory - Top Psytrance Artists",
    description: "Discover 20+ top psychedelic trance artists with bios, social links, and music. Featuring Astrix, Infected Mushroom, Vini Vici, Ace Ventura, and more legends of the scene.",
    canonicalPath: "/artists",
  });

  const { data: artists, isLoading } = trpc.artists.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Filter artists based on search and genre
  const filteredArtists = artists?.filter((artist) => {
    const matchesSearch = artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.realName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.country?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || artist.primaryGenre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  // Get unique genres from artists
  const genres = Array.from(new Set(artists?.map(a => a.primaryGenre).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-background to-purple-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              initial={{ 
                x: Math.random() * 100 + "%", 
                y: "100%",
                opacity: 0 
              }}
              animate={{ 
                y: "-100%",
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4 py-16">
          {/* Back button */}
          <Link href="/">
            <Button variant="ghost" className="mb-8 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Portal
            </Button>
          </Link>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-10 h-10 text-cyan-400" />
              <h1 className="text-4xl md:text-6xl font-bold font-orbitron tracking-wider">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-cyan-300 to-purple-400">
                  ARTIST DIRECTORY
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover the visionaries behind the psychedelic soundscapes. 
              Explore profiles, social links, and music from the top artists in the scene.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search artists by name, real name, or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-6 text-lg bg-surface/50 border-border/50 focus:border-cyan-500/50 rounded-xl"
              />
            </div>

            {/* Genre Filter Pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedGenre === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(null)}
                className={selectedGenre === null ? "bg-cyan-500 text-background" : ""}
              >
                All Genres
              </Button>
              {genres.map((genre) => (
                <Button
                  key={genre}
                  variant={selectedGenre === genre ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
                  className={selectedGenre === genre ? "bg-cyan-500 text-background" : ""}
                >
                  {genreLabels[genre || ""] || genre}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Artists Grid */}
      <div className="container mx-auto px-4 pb-24">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-surface/50 rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredArtists && filteredArtists.length > 0 ? (
          <>
            <p className="text-muted-foreground mb-6 text-center">
              Showing {filteredArtists.length} artist{filteredArtists.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtists.map((artist, index) => (
                <motion.div
                  key={artist.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group relative bg-surface/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/30 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.15)]"
                >
                  {/* Artist Image */}
                  <div className="relative h-48 overflow-hidden">
                    {artist.imageUrl ? (
                      <img
                        src={artist.imageUrl}
                        alt={artist.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-cyan-900/50 to-purple-900/50 flex items-center justify-center">
                        <Music2 className="w-16 h-16 text-cyan-400/50" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    
                    {/* Track count badge */}
                    {artist.trackCount > 0 && (
                      <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-cyan-400 border border-cyan-500/30">
                        {artist.trackCount} tracks
                      </div>
                    )}
                    
                    {/* Rank badge for top artists */}
                    {index < 3 && (
                      <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? "bg-yellow-500 text-yellow-900" :
                        index === 1 ? "bg-gray-300 text-gray-800" :
                        "bg-amber-600 text-amber-100"
                      }`}>
                        #{index + 1}
                      </div>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="p-5">
                    {/* Name and Country */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold font-orbitron text-white group-hover:text-cyan-400 transition-colors">
                        {artist.name}
                      </h3>
                      {artist.country && (
                        <span className="text-lg" title={artist.country}>
                          {getCountryFlag(artist.country)}
                        </span>
                      )}
                    </div>

                    {/* Real Name */}
                    {artist.realName && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {artist.realName}
                      </p>
                    )}

                    {/* Genre Badge */}
                    {artist.primaryGenre && (
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${genreColors[artist.primaryGenre] || "bg-gray-500/20 text-gray-400 border-gray-500/30"}`}>
                        {genreLabels[artist.primaryGenre] || artist.primaryGenre}
                      </span>
                    )}

                    {/* Bio */}
                    {artist.bio && (
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                        {artist.bio}
                      </p>
                    )}

                    {/* Social Links */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {artist.youtubeUrl && (
                        <a
                          href={artist.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="YouTube"
                        >
                          <Youtube className="w-4 h-4" />
                        </a>
                      )}
                      {artist.spotifyUrl && (
                        <a
                          href={artist.spotifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 transition-colors"
                          title="Spotify"
                        >
                          <Headphones className="w-4 h-4" />
                        </a>
                      )}
                      {artist.soundcloudUrl && (
                        <a
                          href={artist.soundcloudUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition-colors"
                          title="SoundCloud"
                        >
                          <Music2 className="w-4 h-4" />
                        </a>
                      )}
                      {artist.instagramUrl && (
                        <a
                          href={artist.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 transition-colors"
                          title="Instagram"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {artist.facebookUrl && (
                        <a
                          href={artist.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                          title="Facebook"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {artist.websiteUrl && (
                        <a
                          href={artist.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 transition-colors"
                          title="Website"
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </div>

                    {/* View on Channel Link */}
                    <a
                      href={`https://www.youtube.com/@PsychedelicUniverse/search?query=${encodeURIComponent(artist.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-sm font-medium transition-colors border border-cyan-500/30"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Channel
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Music2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No artists found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedGenre 
                ? "Try adjusting your search or filter criteria."
                : "Artist profiles will appear here once added."}
            </p>
          </div>
        )}
      </div>

      {/* Artist Contact Section */}
      <div className="container mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative overflow-hidden bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-cyan-500/10 rounded-3xl p-8 md:p-12 border border-cyan-500/20">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-cyan-400" />
                <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  Want to Be Featured Here?
                </h2>
                <Sparkles className="w-8 h-8 text-purple-400" />
              </div>
              
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Are you a psytrance artist or producer? We're always looking to showcase talented artists 
                from the psychedelic music scene. Get in touch and join our growing directory!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:psyuniverse9@gmail.com?subject=Artist%20Directory%20Feature%20Request"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,255,0.3)]"
                >
                  <Mail className="w-5 h-5" />
                  Contact Us
                </a>
                <Link href="/submit">
                  <Button
                    variant="outline"
                    className="px-8 py-4 h-auto rounded-xl border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500"
                  >
                    Submit Your Music
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
