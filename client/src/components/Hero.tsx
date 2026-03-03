import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Play } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useRef, useMemo } from "react";

// Pre-generate particle configs so they don't change on re-render
function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    width: Math.random() * 3 + 1.5,
    left: Math.random() * 100,
    top: Math.random() * 100,
    colorType: i % 4,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
  }));
}

function generateShootingStars(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 60,
    left: Math.random() * 80,
    duration: 1.5 + Math.random() * 2,
    delay: Math.random() * 12 + i * 4,
    angle: -15 + Math.random() * 30,
    length: 60 + Math.random() * 100,
  }));
}

const PARTICLE_COUNT = 30;
const SHOOTING_STAR_COUNT = 5;

export function Hero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const particles = useMemo(() => generateParticles(PARTICLE_COUNT), []);
  const shootingStars = useMemo(() => generateShootingStars(SHOOTING_STAR_COUNT), []);

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
            src="/images/hero-bg.jpg" 
            alt="Cosmic Planetary Landscape" 
            className="w-full h-full object-cover"
          />
        </div>
        {/* Planet ring rotation overlay */}
        <div className="absolute inset-0 pointer-events-none planet-ring-glow"></div>
        {/* Multi-layer gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40"></div>
        {/* Bottom fade to seamlessly blend into content */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      {/* Enhanced floating particles overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        {particles.map((p) => {
          const colors = [
            { bg: 'rgba(34, 211, 238, 0.7)', shadow: '0 0 8px rgba(34, 211, 238, 0.5)' },
            { bg: 'rgba(168, 85, 247, 0.6)', shadow: '0 0 6px rgba(168, 85, 247, 0.4)' },
            { bg: 'rgba(255, 255, 255, 0.5)', shadow: '0 0 4px rgba(255, 255, 255, 0.3)' },
            { bg: 'rgba(217, 170, 80, 0.5)', shadow: '0 0 6px rgba(217, 170, 80, 0.3)' },
          ];
          const color = colors[p.colorType];
          return (
            <div
              key={p.id}
              className="absolute rounded-full hero-particle"
              style={{
                width: `${p.width}px`,
                height: `${p.width}px`,
                left: `${p.left}%`,
                top: `${p.top}%`,
                background: color.bg,
                boxShadow: color.shadow,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          );
        })}

        {/* Shooting stars */}
        {shootingStars.map((s) => (
          <div
            key={`star-${s.id}`}
            className="absolute shooting-star"
            style={{
              top: `${s.top}%`,
              left: `${s.left}%`,
              width: `${s.length}px`,
              animationDuration: `${s.duration}s`,
              animationDelay: `${s.delay}s`,
              transform: `rotate(${s.angle}deg)`,
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 container flex flex-col items-center text-center space-y-8 animate-in fade-in zoom-in duration-1000">
        
        {/* Logo with cosmic glow - transparent icon only */}
        <div className="w-36 h-36 md:w-48 md:h-48 relative mb-2 animate-float">
          {/* Outer glow ring */}
          <div className="absolute inset-[-25%] bg-gradient-to-r from-cyan-500/20 via-purple-500/15 to-cyan-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
          {/* Inner glow */}
          <div className="absolute inset-[-5%] bg-primary/10 rounded-full blur-2xl"></div>
          <img 
            src="/images/hero-logo.png" 
            alt="Psychedelic Universe Logo" 
            className="w-full h-full object-contain logo-cosmic-glow relative z-10 drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]"
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
            Promote & Spread Psychedelic Trance Worldwide
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
