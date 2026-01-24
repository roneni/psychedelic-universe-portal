import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Music, Clock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Submit() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 flex items-center">
        <div className="container max-w-2xl">
          <div className="text-center">
            {/* Icon */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
              <Music className="w-12 h-12 text-cyan-400" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyan-400 mb-4">
              Submit Your Music
            </h1>

            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-8">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-medium">Coming Soon</span>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">
              We're building a dedicated submission system for artists and labels to share their music with the Psychedelic Universe community. Stay tuned!
            </p>

            {/* What to expect */}
            <div className="bg-surface/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8 text-left mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-cyan-400" />
                What to Expect
              </h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400">•</span>
                  <span>Easy submission form for tracks, albums, and mixes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400">•</span>
                  <span>Direct connection to our curation team</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400">•</span>
                  <span>Opportunity to be featured on our channel and playlists</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-cyan-400">•</span>
                  <span>Exposure to our global psytrance community</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <p className="text-muted-foreground mb-4">
              In the meantime, you can reach us directly:
            </p>
            <a href="mailto:psyuniverse9@gmail.com">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-8">
                Contact Us
              </Button>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
