import { Button } from "@/components/ui/button";
import { Youtube, Radio, Facebook, Instagram, Twitter } from "lucide-react";
import { SubscriberCounter } from "./SubscriberCounter";

export function Footer() {
  return (
    <footer className="bg-black/80 border-t border-white/10 pt-16 pb-32 md:pb-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-primary/5 blur-3xl pointer-events-none"></div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
              <span className="text-xl font-bold tracking-wider">PSYCHEDELIC UNIVERSE</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The global hub for psychedelic trance culture. Connecting artists, labels, and fans through the power of sound since 2013.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">EXPLORE</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Goa Trance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Progressive Psy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Full-On</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Psychill / Ambient</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Festivals 2026</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">INFO</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Submit Music</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Advertising</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Primary Actions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-6 text-white">STAY CONNECTED</h4>
            <Button className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold tracking-wide shadow-lg group relative overflow-hidden">
              <Youtube className="mr-2 w-5 h-5 group-hover:animate-pulse relative z-10" />
              <span className="relative z-10">SUBSCRIBE</span>
              <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full relative z-10 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <SubscriberCounter className="text-white" />
              </span>
            </Button>
            <Button variant="outline" className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:text-primary font-bold tracking-wide">
              <Radio className="mr-2 w-5 h-5" />
              FOLLOW THE STREAM
            </Button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; 2026 Psychedelic Universe. All rights reserved. Made with cosmic energy.</p>
        </div>
      </div>
    </footer>
  );
}
