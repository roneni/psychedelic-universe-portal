import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export function Newsletter() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background z-0"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto bg-card/30 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"></div>
          
          <Mail className="w-12 h-12 mx-auto mb-6 text-primary animate-pulse-slow" />
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">JOIN THE TRIBE</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Get exclusive mix alerts, festival news, and psychedelic culture updates delivered straight to your digital consciousness.
          </p>
          
          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-black/50 border-white/10 focus:border-primary h-12 text-lg"
            />
            <Button size="lg" className="h-12 px-8 bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-wide shadow-[0_0_20px_-5px_rgba(34,211,238,0.5)]">
              SUBSCRIBE
            </Button>
          </form>
          
          <p className="text-xs text-muted-foreground mt-6">
            No spam, only good vibes. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
