import { useAuth } from "@/_core/hooks/useAuth";
import { usePageMeta } from "@/hooks/usePageMeta";
import { trpc } from "@/lib/trpc";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  Play,
  Music,
  Shield,
  Volume2,
  Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useMemo } from "react";

/**
 * Underground Vault - A private listening room for exclusive mixes
 * Access is restricted to authenticated users who know the passphrase.
 * The passphrase is shared only through the newsletter or community channels.
 * 
 * This approach keeps the content low-profile while still sharing it
 * with trusted community members.
 */

// The mixes are stored here (admin can update via the Admin panel in the future)
// For now, this is a static list that Ronen can update
const VAULT_MIXES: Array<{
  id: string;
  title: string;
  description: string;
  duration: string;
  youtubeId: string;
}> = [];

// The passphrase is verified server-side
const VAULT_DESCRIPTION = `This is a private listening room for exclusive mixes that exist outside the main channel. 
Access is limited to trusted members of the Psychedelic Universe community. 
The passphrase is shared through our newsletter and community channels.`;

export default function Underground() {
  usePageMeta({
    title: "The Underground Vault",
    description: "Exclusive private listening room for Psychedelic Universe community members. Access rare and unreleased psytrance mixes with a passphrase.",
    canonicalPath: "/underground",
  });

  const { user, isAuthenticated } = useAuth();
  const [passphrase, setPassphrase] = useState("");
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [activeMix, setActiveMix] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Check if user has vault access (stored in session)
  const { data: vaultAccess } = trpc.vault.checkAccess.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const verifyPassphrase = trpc.vault.verify.useMutation({
    onSuccess: (data) => {
      if (data.granted) {
        setIsUnlocked(true);
        setError("");
      } else {
        setError("Invalid passphrase. This room is for those who know the way.");
        setPassphrase("");
      }
    },
    onError: () => {
      setError("Something went wrong. Try again.");
    },
  });

  const { data: vaultMixes = [] } = trpc.vault.listMixes.useQuery(undefined, {
    enabled: isUnlocked || vaultAccess?.hasAccess === true,
  });

  useEffect(() => {
    if (vaultAccess?.hasAccess) {
      setIsUnlocked(true);
    }
  }, [vaultAccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;
    setIsVerifying(true);
    verifyPassphrase.mutate({ passphrase: passphrase.trim() });
    setTimeout(() => setIsVerifying(false), 1000);
  };

  // Not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1 pt-24 pb-32">
          <div className="container max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-8">
                <Lock className="w-10 h-10 text-purple-400" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">The Underground</h1>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                A private listening room for the inner circle. Sign in to enter.
              </p>
              <a href={getLoginUrl()}>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Sign In to Enter
                </Button>
              </a>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Locked state - need passphrase
  if (!isUnlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <main className="flex-1 pt-24 pb-32">
          <div className="container max-w-2xl">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-8">
                <Lock className="w-12 h-12 text-purple-400" />
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                The Underground
              </h1>
              
              <p className="text-muted-foreground max-w-lg mx-auto mb-2 text-sm leading-relaxed">
                {VAULT_DESCRIPTION}
              </p>

              <div className="flex items-center justify-center gap-2 text-xs text-purple-400/60 mb-10">
                <Shield className="w-3 h-3" />
                <span>Content in this room is for personal listening only</span>
              </div>

              <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
                <div className="relative mb-4">
                  <input
                    type={showPassphrase ? "text" : "password"}
                    value={passphrase}
                    onChange={(e) => { setPassphrase(e.target.value); setError(""); }}
                    placeholder="Enter the passphrase..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-purple-500/30 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/50 transition-all"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassphrase ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-sm mb-4"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={!passphrase.trim() || isVerifying}
                  className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-medium"
                >
                  {isVerifying ? "Verifying..." : "Enter the Vault"}
                </Button>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Unlocked - show the mixes
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 pt-24 pb-32">
        <div className="container max-w-4xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
                <Headphones className="w-4 h-4" />
                Private Listening Room
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                The Underground
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                Welcome, {user?.name || "traveler"}. These are exclusive mixes curated for the inner circle. 
                Please keep this content within our community.
              </p>
            </div>

            {vaultMixes.length === 0 ? (
              <div className="text-center py-16">
                <Music className="w-16 h-16 text-purple-400/30 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">The Vault is Being Prepared</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Exclusive mixes are being curated for this space. Check back soon - 
                  the first drops will be announced through the newsletter.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {vaultMixes.map((mix: any, index: number) => (
                  <motion.div
                    key={mix.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-xl border transition-all ${
                      activeMix === mix.id
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => setActiveMix(activeMix === mix.id ? null : mix.id)}
                        className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 hover:bg-purple-500/30 transition-colors flex-shrink-0"
                      >
                        {activeMix === mix.id ? (
                          <Volume2 className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white mb-1">{mix.title}</h3>
                        {mix.description && (
                          <p className="text-sm text-muted-foreground mb-2">{mix.description}</p>
                        )}
                        <span className="text-xs text-purple-400/60">{mix.duration || "Full Mix"}</span>
                      </div>
                    </div>

                    <AnimatePresence>
                      {activeMix === mix.id && mix.youtubeId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 overflow-hidden"
                        >
                          <div className="aspect-video rounded-lg overflow-hidden">
                            <iframe
                              src={`https://www.youtube.com/embed/${mix.youtubeId}?autoplay=1`}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-12 p-4 rounded-xl border border-purple-500/10 bg-purple-500/5 text-center">
              <p className="text-xs text-purple-400/50">
                <Shield className="w-3 h-3 inline mr-1" />
                This content is shared in trust. Please respect the artists and keep it within our community.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
