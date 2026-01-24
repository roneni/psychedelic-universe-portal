import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Youtube, Calendar, MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none"></div>
          <div className="container max-w-4xl relative z-10">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyan-400 mb-4">About Us</h1>
              <p className="text-xl text-muted-foreground">The Story Behind Psychedelic Universe</p>
            </div>
          </div>
        </section>

        {/* Founder Story */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="bg-surface/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 md:p-12">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-white">Our Journey</h2>
                  <p className="text-muted-foreground">From raves to a global community</p>
                </div>
              </div>

              <div className="prose prose-invert prose-cyan max-w-none">
                <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                  I founded the channel in 2013 because of my love for trance. It started at raves, continued in Goa, which I visited twice, and since then it has always been with me.
                </p>
                <p className="text-lg text-foreground/90 leading-relaxed mb-6">
                  I decided to establish the site for exactly the same reason. This site will provide a response to the needs and elements that are not available on the channel, and in this way I aspire to reach additional audiences 🙏🏼
                </p>
              </div>

              {/* Timeline */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background/50 rounded-xl p-6 border border-border/20">
                  <Calendar className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Founded 2013</h3>
                  <p className="text-sm text-muted-foreground">Started sharing psychedelic trance music with the world</p>
                </div>
                <div className="bg-background/50 rounded-xl p-6 border border-border/20">
                  <MapPin className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Inspired by Goa</h3>
                  <p className="text-sm text-muted-foreground">Two transformative trips to the birthplace of psytrance</p>
                </div>
                <div className="bg-background/50 rounded-xl p-6 border border-border/20">
                  <Youtube className="w-8 h-8 text-cyan-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">5,000+ Tracks</h3>
                  <p className="text-sm text-muted-foreground">Curating the best psytrance from around the globe</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="text-center">
              <h2 className="text-3xl font-orbitron font-bold text-white mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                To promote and spread psychedelic trance culture worldwide, connecting artists, labels, and fans through the power of trance. We believe in the transformative power of music and its ability to unite people across borders and cultures.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container max-w-4xl">
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 text-center border border-cyan-500/20">
              <h3 className="text-2xl font-semibold text-white mb-4">Join the Tribe</h3>
              <p className="text-muted-foreground mb-6">Subscribe to our YouTube channel and become part of the Psychedelic Universe community</p>
              <a 
                href="http://bit.ly/PsyUniverseSubscribe" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button className="bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold px-8">
                  <Youtube className="mr-2 w-5 h-5" />
                  Subscribe Now
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
