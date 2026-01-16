import { Hero } from "@/components/Hero";
import { MixGrid } from "@/components/MixGrid";
import { FeaturedMixes } from "@/components/FeaturedMixes";
import { Newsletter } from "@/components/Newsletter";
import { PartnersCarousel } from "@/components/PartnersCarousel";
import { Footer } from "@/components/Footer";

export default function Home() {
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
