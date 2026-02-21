import { useAuth } from "@/_core/hooks/useAuth";
import { usePageMeta } from "@/hooks/usePageMeta";
import { trpc } from "@/lib/trpc";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import {
  ArrowLeft,
  Trophy,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Calendar,
  Zap,
  Crown,
  Medal,
  Award,
  Sparkles,
  Users,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useMemo } from "react";

const KARMA_ACTION_INFO: Record<string, { label: string; icon: typeof Star; color: string; points: string }> = {
  signup: { label: "Join the Tribe", icon: Users, color: "text-emerald-400", points: "+50" },
  favorite: { label: "Favorite a Mix", icon: Heart, color: "text-pink-400", points: "+5" },
  suggestion: { label: "Submit a Suggestion", icon: MessageSquare, color: "text-blue-400", points: "+15" },
  newsletter: { label: "Subscribe to Newsletter", icon: Zap, color: "text-yellow-400", points: "+10" },
  daily_visit: { label: "Daily Visit", icon: Calendar, color: "text-cyan-400", points: "+2" },
  share: { label: "Share Content", icon: Share2, color: "text-purple-400", points: "+10" },
  artist_submit: { label: "Submit an Artist", icon: Star, color: "text-orange-400", points: "+20" },
};

function getRankIcon(position: number) {
  if (position === 1) return <Crown className="w-6 h-6 text-yellow-400" />;
  if (position === 2) return <Medal className="w-6 h-6 text-gray-300" />;
  if (position === 3) return <Award className="w-6 h-6 text-amber-600" />;
  return <span className="w-6 h-6 flex items-center justify-center text-sm text-gray-400 font-mono">#{position}</span>;
}

function getRankBorder(position: number) {
  if (position === 1) return "border-yellow-400/30 bg-yellow-400/5";
  if (position === 2) return "border-gray-300/30 bg-gray-300/5";
  if (position === 3) return "border-amber-600/30 bg-amber-600/5";
  return "border-white/5 bg-white/[0.02]";
}

function getKarmaLevel(karma: number): { level: string; min: number; max: number; color: string } {
  if (karma >= 500) return { level: "Cosmic Traveler", min: 500, max: 1000, color: "text-yellow-400" };
  if (karma >= 200) return { level: "Astral Voyager", min: 200, max: 500, color: "text-purple-400" };
  if (karma >= 100) return { level: "Frequency Rider", min: 100, max: 200, color: "text-cyan-400" };
  if (karma >= 50) return { level: "Sound Explorer", min: 50, max: 100, color: "text-emerald-400" };
  return { level: "New Arrival", min: 0, max: 50, color: "text-gray-400" };
}

export default function Community() {
  usePageMeta({
    title: "Community - Karma Leaderboard & Levels",
    description: "Join the Psychedelic Universe community. Earn Karma points, climb the leaderboard, unlock levels from Space Cadet to Cosmic Overlord. Connect with 633K+ psytrance fans.",
    canonicalPath: "/community",
  });

  const { user, isAuthenticated } = useAuth();
  
  const { data: leaderboard = [] } = trpc.karma.leaderboard.useQuery({ limit: 20 });
  const { data: myKarma } = trpc.karma.myKarma.useQuery(undefined, { enabled: isAuthenticated });
  const { data: myHistory = [] } = trpc.karma.myHistory.useQuery({ limit: 10 }, { enabled: isAuthenticated });
  
  // Record daily visit
  const recordVisit = trpc.karma.recordVisit.useMutation();
  useEffect(() => {
    if (isAuthenticated) {
      recordVisit.mutate();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const karmaLevel = useMemo(() => getKarmaLevel(myKarma?.totalKarma || 0), [myKarma?.totalKarma]);
  const progressPercent = useMemo(() => {
    const total = myKarma?.totalKarma || 0;
    const range = karmaLevel.max - karmaLevel.min;
    return Math.min(100, ((total - karmaLevel.min) / range) * 100);
  }, [myKarma?.totalKarma, karmaLevel]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1 pt-24 pb-32">
        {/* Header */}
        <div className="container max-w-5xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              Community
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
              The Tribe
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every action earns Karma. Favorite mixes, share content, visit daily, and climb the ranks. 
              The most engaged members of our community earn recognition and exclusive perks.
            </p>
          </div>

          {/* User Profile Card (if logged in) */}
          {isAuthenticated && myKarma ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5"
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
                  {(user?.name || "?")[0].toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold text-white">{user?.name || "Anonymous"}</h2>
                  <p className={`text-sm font-medium ${karmaLevel.color}`}>{karmaLevel.level}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{myKarma.totalKarma}</div>
                  <div className="text-xs text-muted-foreground">Karma Points</div>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{karmaLevel.level}</span>
                  <span>{myKarma.totalKarma} / {karmaLevel.max} karma</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"
                  />
                </div>
              </div>

              {/* Recent activity */}
              {myHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recent Activity</h3>
                  <div className="space-y-1">
                    {myHistory.slice(0, 5).map((entry: any) => {
                      const info = KARMA_ACTION_INFO[entry.action];
                      return (
                        <div key={entry.id} className="flex items-center gap-2 text-sm">
                          {info && <info.icon className={`w-3 h-3 ${info.color}`} />}
                          <span className="text-gray-400">{info?.label || entry.action}</span>
                          <span className="ml-auto text-xs font-mono text-emerald-400">{entry.points > 0 ? "+" : ""}{entry.points}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 p-8 rounded-2xl border border-dashed border-primary/30 bg-primary/5 text-center"
            >
              <Users className="w-12 h-12 text-primary mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">Join the Tribe</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Sign in to start earning Karma, track your activity, and appear on the leaderboard.
              </p>
              <a href={getLoginUrl()}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Sign In to Start Earning
                </Button>
              </a>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Leaderboard */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Karma Leaderboard</h2>
              </div>

              {leaderboard.length === 0 ? (
                <div className="p-8 rounded-xl border border-white/5 bg-white/[0.02] text-center">
                  <TrendingUp className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground">No karma earned yet. Be the first!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border ${getRankBorder(index + 1)} transition-colors hover:bg-white/[0.04]`}
                    >
                      {getRankIcon(index + 1)}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {(entry.name || "?")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">
                          {entry.name || "Anonymous Traveler"}
                          {user && entry.userId === user.id && (
                            <span className="ml-2 text-xs text-primary">(you)</span>
                          )}
                        </p>
                        <p className={`text-xs ${getKarmaLevel(entry.totalKarma).color}`}>
                          {getKarmaLevel(entry.totalKarma).level}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">{entry.totalKarma}</div>
                        <div className="text-xs text-muted-foreground">karma</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* How to Earn Karma */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Earn Karma</h2>
              </div>

              <div className="space-y-3">
                {Object.entries(KARMA_ACTION_INFO).map(([key, info]) => (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <info.icon className={`w-5 h-5 ${info.color} flex-shrink-0`} />
                    <span className="text-sm text-gray-300 flex-1">{info.label}</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">{info.points}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">Karma Levels</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-yellow-400">Cosmic Traveler</span><span className="text-gray-400">500+</span></div>
                  <div className="flex justify-between"><span className="text-purple-400">Astral Voyager</span><span className="text-gray-400">200+</span></div>
                  <div className="flex justify-between"><span className="text-cyan-400">Frequency Rider</span><span className="text-gray-400">100+</span></div>
                  <div className="flex justify-between"><span className="text-emerald-400">Sound Explorer</span><span className="text-gray-400">50+</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">New Arrival</span><span className="text-gray-400">0+</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
