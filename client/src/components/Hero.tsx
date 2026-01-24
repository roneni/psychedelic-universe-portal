import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Play } from "lucide-react";
import { Link } from "wouter";

export function Hero() {
  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero-bg.jpg" 
          alt="Deep Space Nebula" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px] bg-gradient-to-b from-transparent via-background/20 to-background"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        
        {/* Logo */}
        <div className="w-48 h-48 md:w-64 md:h-64 relative mb-4 animate-float">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <img 
            src="/images/logo.png" 
            alt="Psychedelic Universe Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan-400 to-secondary drop-shadow-sm">
            PSYCHEDELIC UNIVERSE
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
            Promoting & Spreading Psychedelic Trance Worldwide since 2013
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-xl pt-4">
          <SearchBar placeholder="Search 5,000+ tracks/albums/mixes by artist or track name..." />
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Link href="/radio">
            <Button 
              size="lg" 
              className="group relative px-8 py-8 text-xl rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/50 hover:border-primary transition-all duration-500 shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.6)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <span className="flex items-center gap-3 relative z-10">
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-500"></span>
                </span>
                LISTEN LIVE 24/7
                <Play className="w-6 h-6 fill-current ml-1" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-[-15vh] left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <div className="w-6 h-10 border-2 border-muted-foreground rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-muted-foreground rounded-full animate-scroll-down"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
