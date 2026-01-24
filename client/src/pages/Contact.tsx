import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Mail, Youtube, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

// SoundCloud icon component
function SoundCloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.084-.1zm-.899 1.025c-.051 0-.09.037-.099.09l-.165 1.14.165 1.108c.009.053.048.09.099.09.05 0 .09-.037.099-.09l.195-1.108-.195-1.14c-.009-.053-.048-.09-.099-.09zm1.83-1.085c-.061 0-.104.053-.111.112l-.21 2.2.21 2.14c.007.06.05.113.111.113.06 0 .103-.053.111-.113l.24-2.14-.24-2.2c-.008-.06-.051-.112-.111-.112zm.944-.424c-.069 0-.12.06-.127.127l-.195 2.624.195 2.555c.007.068.058.127.127.127.068 0 .12-.06.127-.127l.225-2.555-.225-2.624c-.007-.068-.059-.127-.127-.127zm.96-.195c-.076 0-.135.067-.142.142l-.18 2.819.18 2.7c.007.076.066.142.142.142.075 0 .135-.066.142-.142l.21-2.7-.21-2.819c-.007-.075-.067-.142-.142-.142zm.975-.12c-.084 0-.15.075-.157.157l-.165 2.939.165 2.775c.007.083.073.157.157.157.083 0 .15-.074.157-.157l.195-2.775-.195-2.939c-.007-.082-.074-.157-.157-.157zm.99-.075c-.09 0-.165.082-.172.172l-.15 3.014.15 2.834c.007.09.082.172.172.172.09 0 .165-.082.172-.172l.18-2.834-.18-3.014c-.007-.09-.082-.172-.172-.172zm1.005-.06c-.098 0-.18.09-.187.187l-.135 3.074.135 2.879c.007.098.09.187.187.187.098 0 .18-.09.187-.187l.165-2.879-.165-3.074c-.007-.098-.09-.187-.187-.187zm1.02-.045c-.105 0-.195.097-.202.202l-.12 3.119.12 2.909c.007.105.097.202.202.202.105 0 .195-.097.202-.202l.15-2.909-.15-3.119c-.007-.105-.097-.202-.202-.202zm1.02-.015c-.112 0-.21.105-.217.217l-.105 3.134.105 2.924c.007.113.105.218.217.218.113 0 .21-.105.218-.218l.135-2.924-.135-3.134c-.008-.112-.105-.217-.218-.217zm1.035.015c-.12 0-.225.112-.232.232l-.09 3.119.09 2.909c.007.12.112.232.232.232.12 0 .225-.112.232-.232l.12-2.909-.12-3.119c-.007-.12-.112-.232-.232-.232zm1.05.045c-.127 0-.24.12-.247.247l-.075 3.074.075 2.864c.007.128.12.248.247.248.128 0 .24-.12.248-.248l.105-2.864-.105-3.074c-.008-.127-.12-.247-.248-.247zm1.065.075c-.135 0-.255.127-.262.262l-.06 2.999.06 2.819c.007.135.127.262.262.262.135 0 .255-.127.262-.262l.09-2.819-.09-2.999c-.007-.135-.127-.262-.262-.262zm1.08.12c-.142 0-.27.135-.277.277l-.045 2.879.045 2.759c.007.143.135.278.277.278.143 0 .27-.135.278-.278l.075-2.759-.075-2.879c-.008-.142-.135-.277-.278-.277zm1.095.165c-.15 0-.285.142-.292.292l-.03 2.714.03 2.684c.007.15.142.292.292.292.15 0 .285-.142.292-.292l.06-2.684-.06-2.714c-.007-.15-.142-.292-.292-.292zm3.555.18c-.232 0-.45.045-.66.12-.135-1.515-1.395-2.699-2.939-2.699-.375 0-.735.075-1.065.195-.127.045-.165.097-.165.195v5.399c0 .105.082.195.187.202h4.642c.915 0 1.665-.75 1.665-1.665 0-.915-.75-1.747-1.665-1.747z"/>
    </svg>
  );
}

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyan-400 mb-4">Contact Us</h1>
            <p className="text-xl text-muted-foreground">Get in touch with Psychedelic Universe</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Contact */}
            <div className="bg-surface/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Email</h2>
                  <p className="text-sm text-muted-foreground">For general inquiries</p>
                </div>
              </div>
              <a 
                href="mailto:psyuniverse9@gmail.com"
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg font-medium"
              >
                psyuniverse9@gmail.com
              </a>
              <p className="text-muted-foreground text-sm mt-4">
                We typically respond within 24-48 hours.
              </p>
            </div>

            {/* Social Links */}
            <div className="bg-surface/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Social Media</h2>
                  <p className="text-sm text-muted-foreground">Connect with us</p>
                </div>
              </div>
              <div className="space-y-4">
                <a 
                  href="https://www.youtube.com/@PsychedelicUniverse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-[#FF0000] transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                  <span>YouTube Channel</span>
                </a>
                <a 
                  href="https://soundcloud.com/psychedelic_universe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-muted-foreground hover:text-[#FF5500] transition-colors"
                >
                  <SoundCloudIcon className="w-5 h-5" />
                  <span>SoundCloud</span>
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">What can we help you with?</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">•</span>
                <span><strong className="text-white">Music Submissions:</strong> Visit our <a href="/submit" className="text-cyan-400 hover:underline">Submit Music</a> page</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">•</span>
                <span><strong className="text-white">Collaborations:</strong> We're open to partnerships with labels and artists</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">•</span>
                <span><strong className="text-white">Technical Issues:</strong> Report any bugs or problems with the website</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">•</span>
                <span><strong className="text-white">General Questions:</strong> Anything else related to Psychedelic Universe</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
