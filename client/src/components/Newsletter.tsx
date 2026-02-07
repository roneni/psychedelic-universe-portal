import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { ShareButtons } from "./ShareButtons";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeMutation = trpc.subscribers.subscribe.useMutation({
    onSuccess: (result) => {
      if (result.success) {
        setIsSubscribed(true);
        setEmail("");
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to subscribe. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    subscribeMutation.mutate({ email });
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent z-0"></div>
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto glass-card gradient-border rounded-3xl p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          {/* Top glow line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent blur-sm"></div>
          
          {isSubscribed ? (
            <>
              <CheckCircle className="w-12 h-12 mx-auto mb-6 text-green-400" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-glow">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-green-300">
                  WELCOME TO THE TRIBE
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                You're now connected to the Psychedelic Universe. Check your inbox for a confirmation.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setIsSubscribed(false)}
                className="border-primary/30 hover:border-primary hover:bg-primary/10"
              >
                Subscribe Another Email
              </Button>
            </>
          ) : (
            <>
              <Mail className="w-12 h-12 mx-auto mb-6 text-primary animate-pulse-slow" />
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4 neon-glow">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300">
                  JOIN THE TRIBE
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                Get mix alerts, festival news, and psychedelic culture updates straight to your inbox.
              </p>
              
              <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto" onSubmit={handleSubmit}>
                <Input 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/50 border-white/10 focus:border-primary h-12 text-lg"
                  disabled={subscribeMutation.isPending}
                />
                <Button 
                  type="submit"
                  size="lg" 
                  className="h-12 px-8 bg-primary hover:bg-primary/80 text-primary-foreground font-bold tracking-wide shadow-[0_0_20px_-5px_rgba(34,211,238,0.5)]"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "SUBSCRIBE"
                  )}
                </Button>
              </form>
              
              <p className="text-xs text-gray-500 mt-6">
                No spam, only good vibes. Unsubscribe at any time.
              </p>
              
              {/* Share Buttons */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-sm text-gray-500 mb-4">Spread the cosmic vibes</p>
                <ShareButtons 
                  variant="compact" 
                  title="Psychedelic Universe - The Global Hub for Psytrance Culture"
                  description="Check out this amazing psytrance music portal!"
                  className="justify-center"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
