import { Button } from "@/components/ui/button";
import { Youtube, Radio, Music2 } from "lucide-react";
import { SubscriberCounter } from "./SubscriberCounter";
import { Link } from "wouter";

// SoundCloud icon component
function SoundCloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.084-.1zm-.899 1.025c-.051 0-.09.037-.099.09l-.165 1.14.165 1.108c.009.053.048.09.099.09.05 0 .09-.037.099-.09l.195-1.108-.195-1.14c-.009-.053-.048-.09-.099-.09zm1.83-1.085c-.061 0-.104.053-.111.112l-.21 2.2.21 2.14c.007.06.05.113.111.113.06 0 .103-.053.111-.113l.24-2.14-.24-2.2c-.008-.06-.051-.112-.111-.112zm.944-.424c-.069 0-.12.06-.127.127l-.195 2.624.195 2.555c.007.068.058.127.127.127.068 0 .12-.06.127-.127l.225-2.555-.225-2.624c-.007-.068-.059-.127-.127-.127zm.96-.195c-.076 0-.135.067-.142.142l-.18 2.819.18 2.7c.007.076.066.142.142.142.075 0 .135-.066.142-.142l.21-2.7-.21-2.819c-.007-.075-.067-.142-.142-.142zm.975-.12c-.084 0-.15.075-.157.157l-.165 2.939.165 2.775c.007.083.073.157.157.157.083 0 .15-.074.157-.157l.195-2.775-.195-2.939c-.007-.082-.074-.157-.157-.157zm.99-.075c-.09 0-.165.082-.172.172l-.15 3.014.15 2.834c.007.09.082.172.172.172.09 0 .165-.082.172-.172l.18-2.834-.18-3.014c-.007-.09-.082-.172-.172-.172zm1.005-.06c-.098 0-.18.09-.187.187l-.135 3.074.135 2.879c.007.098.09.187.187.187.098 0 .18-.09.187-.187l.165-2.879-.165-3.074c-.007-.098-.09-.187-.187-.187zm1.02-.045c-.105 0-.195.097-.202.202l-.12 3.119.12 2.909c.007.105.097.202.202.202.105 0 .195-.097.202-.202l.15-2.909-.15-3.119c-.007-.105-.097-.202-.202-.202zm1.02-.015c-.112 0-.21.105-.217.217l-.105 3.134.105 2.924c.007.113.105.218.217.218.113 0 .21-.105.218-.218l.135-2.924-.135-3.134c-.008-.112-.105-.217-.218-.217zm1.035.015c-.12 0-.225.112-.232.232l-.09 3.119.09 2.909c.007.12.112.232.232.232.12 0 .225-.112.232-.232l.12-2.909-.12-3.119c-.007-.12-.112-.232-.232-.232zm1.05.045c-.127 0-.24.12-.247.247l-.075 3.074.075 2.864c.007.128.12.248.247.248.128 0 .24-.12.248-.248l.105-2.864-.105-3.074c-.008-.127-.12-.247-.248-.247zm1.065.075c-.135 0-.255.127-.262.262l-.06 2.999.06 2.819c.007.135.127.262.262.262.135 0 .255-.127.262-.262l.09-2.819-.09-2.999c-.007-.135-.127-.262-.262-.262zm1.08.12c-.142 0-.27.135-.277.277l-.045 2.879.045 2.759c.007.143.135.278.277.278.143 0 .27-.135.278-.278l.075-2.759-.075-2.879c-.008-.142-.135-.277-.278-.277zm1.095.165c-.15 0-.285.142-.292.292l-.03 2.714.03 2.684c.007.15.142.292.292.292.15 0 .285-.142.292-.292l.06-2.684-.06-2.714c-.007-.15-.142-.292-.292-.292zm3.555.18c-.232 0-.45.045-.66.12-.135-1.515-1.395-2.699-2.939-2.699-.375 0-.735.075-1.065.195-.127.045-.165.097-.165.195v5.399c0 .105.082.195.187.202h4.642c.915 0 1.665-.75 1.665-1.665 0-.915-.75-1.747-1.665-1.747z"/>
    </svg>
  );
}

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
              The global hub for psychedelic trance culture. Connecting artists, labels, and fans through the power of trance since 2013.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.youtube.com/@PsychedelicUniverse" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#FF0000] transition-colors"
              >
                <Youtube className="w-6 h-6" />
              </a>
              <a 
                href="https://soundcloud.com/psychedelic_universe" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#FF5500] transition-colors"
              >
                <SoundCloudIcon className="w-6 h-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">EXPLORE</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/genre/progressive-psy" className="hover:text-primary transition-colors">Progressive Psytrance</Link></li>
              <li><Link href="/genre/psychedelic-trance" className="hover:text-primary transition-colors">Psychedelic Trance</Link></li>
              <li><Link href="/genre/goa-trance" className="hover:text-primary transition-colors">Goa Trance</Link></li>
              <li><Link href="/genre/full-on" className="hover:text-primary transition-colors">Full-On</Link></li>
              <li><Link href="/artists" className="hover:text-primary transition-colors">Artists</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">INFO</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/submit" className="hover:text-primary transition-colors">Submit Music</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/suggestions" className="hover:text-primary transition-colors">Suggestions</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Primary Actions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-6 text-white">STAY CONNECTED</h4>
            <a 
              href="http://bit.ly/PsyUniverseSubscribe" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold tracking-wide shadow-lg group relative overflow-hidden">
                <Youtube className="mr-2 w-5 h-5 group-hover:animate-pulse relative z-10" />
                <span className="relative z-10">SUBSCRIBE</span>
                <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full relative z-10 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  <SubscriberCounter className="text-white" />
                </span>
              </Button>
            </a>
            <a 
              href="https://soundcloud.com/psychedelic_universe" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="w-full border-[#FF5500]/50 text-[#FF5500] hover:bg-[#FF5500]/10 hover:text-[#FF5500] font-bold tracking-wide mt-3">
                <SoundCloudIcon className="mr-2 w-5 h-5" />
                FOLLOW ON SOUNDCLOUD
              </Button>
            </a>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-xs text-muted-foreground">
          <p>&copy; 2026 Psychedelic Universe. All rights reserved. Made with cosmic energy.</p>
        </div>
      </div>
    </footer>
  );
}
