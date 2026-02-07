import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Play } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef } from "react";

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);

  // Subtle parallax on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const scrollY = window.scrollY;
        bgRef.current.style.transform = `translateY(${scrollY * 0.3}px) scale(1.1)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <div ref={bgRef} className="absolute inset-[-10%] transition-transform duration-100 ease-out">
          <img 
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663076706091/IWXNNUxJgZREdluX.jpg" 
            alt="Cosmic Planetary Landscape" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40"></div>
        {/* Bottom fade to seamlessly blend into content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Floating particles overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 3 === 0 
                ? 'rgba(34, 211, 238, 0.6)' 
                : i % 3 === 1 
                  ? 'rgba(168, 85, 247, 0.5)' 
                  : 'rgba(255, 255, 255, 0.4)',
              animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              boxShadow: i % 3 === 0 
                ? '0 0 6px rgba(34, 211, 238, 0.4)' 
                : 'none',
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 container flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        
        {/* Logo with cosmic glow */}
        <div className="w-40 h-40 md:w-56 md:h-56 relative mb-2 animate-float">
          {/* Outer glow ring */}
          <div className="absolute inset-[-20%] bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          {/* Inner glow */}
          <div className="absolute inset-0 bg-primary/15 rounded-full blur-2xl"></div>
          <img 
            src="/images/logo.png" 
            alt="Psychedelic Universe Logo" 
            className="w-full h-full object-contain logo-cosmic-glow relative z-10"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-5 max-w-4xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter neon-glow">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-purple-400">
              PSYCHEDELIC
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-cyan-300">
              UNIVERSE
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300/90 font-light tracking-[0.2em] uppercase">
            Promoting & Spreading Psychedelic Trance Worldwide
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-xl pt-2">
          <SearchBar placeholder="Search 5,000+ tracks, albums, mixes..." />
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link href="/radio">
            <Button 
              size="lg" 
              className="group relative px-8 py-8 text-xl rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/40 hover:border-primary transition-all duration-500 shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)] hover:shadow-[0_0_50px_-10px_rgba(34,211,238,0.6)] overflow-hidden"
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
        <div className="absolute bottom-[-10vh] left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-6 h-10 border-2 border-cyan-400/40 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-cyan-400/60 rounded-full animate-scroll-down"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
