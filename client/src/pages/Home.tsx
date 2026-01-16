import { useAuth } from "@/_core/hooks/useAuth";
import { Hero } from "@/components/Hero";
import { MixGrid } from "@/components/MixGrid";
import { FeaturedMixes } from "@/components/FeaturedMixes";
import { Newsletter } from "@/components/Newsletter";
import { PartnersCarousel } from "@/components/PartnersCarousel";
import { Footer } from "@/components/Footer";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <main className="flex-1">
        <Hero />
        <MixGrid />
        <FeaturedMixes />
        <PartnersCarousel />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
}
