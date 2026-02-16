import { useAuth } from "@/_core/hooks/useAuth";
import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { MixGrid } from "@/components/MixGrid";
import { FeaturedMixes } from "@/components/FeaturedMixes";
import { Newsletter } from "@/components/Newsletter";
import { PartnersCarousel } from "@/components/PartnersCarousel";
import { Footer } from "@/components/Footer";
import { GoaTransition } from "@/components/GoaTransition";

export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground cosmic-bg">
      {/* Nebula color blobs - floating ambient light */}
      <div className="nebula-blob nebula-blob-1"></div>
      <div className="nebula-blob nebula-blob-2"></div>
      <div className="nebula-blob nebula-blob-3"></div>
      
      <Navigation />
      <main className="flex-1 pt-16 relative z-[1]">
        <Hero />
        <GoaTransition />
        <div className="cosmic-divider my-0"></div>
        <MixGrid />
        <div className="cosmic-divider my-0"></div>
        <FeaturedMixes />
        <PartnersCarousel />
        <div className="cosmic-divider my-0"></div>
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
