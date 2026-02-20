import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { Music, Users, Globe, Radio } from "lucide-react";

const GOA_BG_URL = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663076706091/cCNxBDRWiclmdYHz.jpg";

const stats = [
  { icon: Music, label: "Tracks", value: "5,000+", href: "/radio" },
  { icon: Users, label: "Subscribers", value: "633K+", href: "https://bit.ly/PsyUniverseSubscribe" },
  { icon: Globe, label: "Festivals", value: "56+", href: "/festivals" },
  { icon: Radio, label: "Live Radio", value: "24/7", href: "/radio" },
];

export function GoaTransition() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("goa-visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = sectionRef.current?.querySelectorAll(".goa-fade-in");
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ marginTop: "-2rem" }}
    >
      {/* Transition gradient: cosmic dark → warm Goa tones */}
      <div className="absolute inset-0 z-0">
        {/* Top: blends with hero's dark bottom */}
        <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background via-background/80 to-transparent z-10"></div>

        {/* Goa beach background */}
        <div className="absolute inset-0">
          <img
            src={GOA_BG_URL}
            alt="Goa Beach Twilight"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Warm overlay to enhance Goa mood */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-900/20 to-background/95 z-[2]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30 z-[2]"></div>

        {/* Bottom: fades back to cosmic dark for next section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container py-32 md:py-44">
        {/* Section heading */}
        <div className="text-center mb-16 goa-fade-in opacity-0 translate-y-8 transition-all duration-1000">
          <p className="text-amber-400/90 text-sm md:text-base tracking-[0.3em] uppercase mb-3 font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Where It All Began
          </p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold neon-glow-gold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400">
              Born in Goa
            </span>
          </h2>
          <p className="mt-5 text-gray-200/90 max-w-2xl mx-auto text-base md:text-lg leading-relaxed font-light drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            From the beaches of Anjuna to the dance floors of the world, psychedelic trance 
            carries the spirit of Goa in every beat. We bring that energy to your screen.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto goa-fade-in opacity-0 translate-y-8 transition-all duration-1000 delay-300">
          {stats.map((stat) => {
            const isExternal = stat.href.startsWith("http");
            const CardContent = (
              <div className="glass-card rounded-xl p-5 md:p-6 text-center group hover:border-amber-400/30 transition-all duration-500 cursor-pointer goa-stat-card" style={{ background: 'rgba(10, 10, 30, 0.7)', backdropFilter: 'blur(20px)' }}>
                <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-amber-400/10 mb-3 group-hover:bg-amber-400/20 transition-colors">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Orbitron', sans-serif" }}>
                  {stat.value}
                </div>
                <div className="text-xs md:text-sm text-gray-400 tracking-wider uppercase">
                  {stat.label}
                </div>
              </div>
            );

            if (isExternal) {
              return (
                <a key={stat.label} href={stat.href} target="_blank" rel="noopener noreferrer">
                  {CardContent}
                </a>
              );
            }
            return (
              <Link key={stat.label} href={stat.href}>
                {CardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
