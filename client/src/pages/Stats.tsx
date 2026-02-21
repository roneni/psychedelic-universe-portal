import { useEffect, useState } from "react";
import { Link, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageMeta } from "@/hooks/usePageMeta";

import {
  Users,
  Eye,
  Video,
  Clock,
  TrendingUp,
  Globe,
  Play,
  ThumbsUp,
  MessageCircle,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";

// Country code to name mapping
const countryNames: Record<string, string> = {
  US: "United States",
  BR: "Brazil",
  IN: "India",
  MX: "Mexico",
  RU: "Russia",
  DE: "Germany",
  GB: "United Kingdom",
  FR: "France",
  ES: "Spain",
  IT: "Italy",
  AR: "Argentina",
  CO: "Colombia",
  PL: "Poland",
  NL: "Netherlands",
  AU: "Australia",
  CA: "Canada",
  IL: "Israel",
  TR: "Turkey",
  JP: "Japan",
  ID: "Indonesia",
  PH: "Philippines",
  VN: "Vietnam",
  TH: "Thailand",
  ZA: "South Africa",
  EG: "Egypt",
  UA: "Ukraine",
  CL: "Chile",
  PE: "Peru",
  VE: "Venezuela",
  PT: "Portugal",
  BE: "Belgium",
  SE: "Sweden",
  CH: "Switzerland",
  AT: "Austria",
  GR: "Greece",
  CZ: "Czech Republic",
  RO: "Romania",
  HU: "Hungary",
};

function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + "B";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function formatWatchTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    if (hours >= 1000) {
      return formatNumber(hours) + " hours";
    }
    return hours.toLocaleString() + " hours";
  }
  return minutes.toLocaleString() + " min";
}

export default function Stats() {
  usePageMeta({
    title: "Channel Statistics - 633K+ Subscribers",
    description: "Psychedelic Universe YouTube channel statistics: 633K+ subscribers, 155M+ views, 5,500+ published tracks. Top performing videos and real-time analytics.",
    canonicalPath: "/stats",
  });

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const searchParams = useSearch();
  const params = new URLSearchParams(searchParams);
  const connected = params.get("connected");
  const error = params.get("error");

  const { data, isLoading, error: fetchError } = trpc.youtubeAnalytics.getDashboardStats.useQuery();
  const { data: connectionStatus } = trpc.youtubeAnalytics.isConnected.useQuery();

  useEffect(() => {
    if (connected === "true") {
      setNotification({ type: "success", message: "YouTube Analytics connected successfully!" });
      window.history.replaceState({}, "", "/stats");
      setTimeout(() => setNotification(null), 5000);
    }
    if (error === "oauth_failed") {
      setNotification({ type: "error", message: "Failed to connect YouTube Analytics. Please try again." });
      window.history.replaceState({}, "", "/stats");
      setTimeout(() => setNotification(null), 5000);
    }
  }, [connected, error]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === "success" 
            ? "bg-green-500/90 text-white" 
            : "bg-red-500/90 text-white"
        }`}>
          {notification.message}
        </div>
      )}
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Channel Statistics
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Live insights from Psychedelic Universe YouTube channel
            </p>
          </div>

          {isLoading ? (
            <StatsLoading />
          ) : fetchError ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Failed to load statistics</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : data ? (
            <>
              {/* Main Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                  icon={<Users className="h-8 w-8 text-cyan-400" />}
                  title="Subscribers"
                  value={formatNumber(data.channelStats.subscriberCount)}
                  subtitle="Total subscribers"
                  gradient="from-cyan-500/20 to-cyan-500/5"
                />
                <StatCard
                  icon={<Eye className="h-8 w-8 text-purple-400" />}
                  title="Total Views"
                  value={formatNumber(data.channelStats.viewCount)}
                  subtitle="All-time views"
                  gradient="from-purple-500/20 to-purple-500/5"
                />
                <StatCard
                  icon={<Video className="h-8 w-8 text-pink-400" />}
                  title="Videos"
                  value={formatNumber(data.channelStats.videoCount)}
                  subtitle="Published tracks"
                  gradient="from-pink-500/20 to-pink-500/5"
                />
              </div>

              {/* Analytics Section (if OAuth connected) */}
              {data.analytics && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-cyan-400" />
                    Last 28 Days Performance
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MiniStatCard
                      icon={<Eye className="h-5 w-5" />}
                      title="Views"
                      value={formatNumber(data.analytics.views)}
                    />
                    <MiniStatCard
                      icon={<Clock className="h-5 w-5" />}
                      title="Watch Time"
                      value={formatWatchTime(data.analytics.watchTimeMinutes)}
                    />
                    <MiniStatCard
                      icon={<Play className="h-5 w-5" />}
                      title="Avg. View Duration"
                      value={formatDuration(data.analytics.averageViewDuration)}
                    />
                    <MiniStatCard
                      icon={<Users className="h-5 w-5" />}
                      title="New Subscribers"
                      value={`+${formatNumber(data.analytics.subscribersGained)}`}
                      positive
                    />
                  </div>

                  {/* Top Countries */}
                  {data.analytics.topCountries.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-cyan-400" />
                        Top Countries
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {data.analytics.topCountries.slice(0, 10).map((country, index) => (
                          <div
                            key={country.country}
                            className="bg-card/50 rounded-lg p-4 border border-border/50"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-2xl font-bold text-cyan-400">
                                #{index + 1}
                              </span>
                            </div>
                            <p className="font-medium truncate">
                              {countryNames[country.country] || country.country}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatNumber(country.views)} views
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Top Videos */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Play className="h-6 w-6 text-cyan-400" />
                  Top Performing Videos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {data.topVideos.slice(0, 10).map((video, index) => (
                    <VideoCard key={video.id} video={video} rank={index + 1} />
                  ))}
                </div>
              </div>

              {/* Connect YouTube Analytics CTA (if not connected) */}
              {!data.isOAuthConnected && (
                <ConnectAnalyticsCard />
              )}
            </>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  gradient: string;
}) {
  return (
    <Card className={`bg-gradient-to-br ${gradient} border-border/50 overflow-hidden`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          {icon}
        </div>
        <div>
          <p className="text-4xl font-bold mb-1">{value}</p>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStatCard({
  icon,
  title,
  value,
  positive,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          {icon}
          <span className="text-sm">{title}</span>
        </div>
        <p className={`text-2xl font-bold ${positive ? "text-green-400" : ""}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function VideoCard({
  video,
  rank,
}: {
  video: {
    id: string;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnail: string;
    publishedAt: string;
  };
  rank: number;
}) {
  return (
    <a
      href={`https://www.youtube.com/watch?v=${video.id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group"
    >
      <Card className="bg-card/50 border-border/50 overflow-hidden hover:border-cyan-500/50 transition-colors">
        <div className="flex gap-4 p-4">
          <div className="relative flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-32 h-20 object-cover rounded-lg"
            />
            <div className="absolute top-1 left-1 bg-black/80 text-cyan-400 text-xs font-bold px-2 py-1 rounded">
              #{rank}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-2 group-hover:text-cyan-400 transition-colors mb-2">
              {video.title}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {formatNumber(video.viewCount)}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="h-4 w-4" />
                {formatNumber(video.likeCount)}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {formatNumber(video.commentCount)}
              </span>
            </div>
          </div>
          <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-cyan-400 transition-colors flex-shrink-0" />
        </div>
      </Card>
    </a>
  );
}

function ConnectAnalyticsCard() {
  const { data: oauthUrl } = trpc.youtubeAnalytics.getOAuthUrl.useQuery();

  return (
    <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/30">
      <CardContent className="p-8 text-center">
        <LinkIcon className="h-12 w-12 text-cyan-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">Connect YouTube Analytics</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Connect your YouTube account to see detailed analytics including watch time,
          subscriber growth, and geographic distribution.
        </p>
        {oauthUrl && (
          <Button
            asChild
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
          >
            <a href={oauthUrl.url}>Connect YouTube Account</a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function StatsLoading() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-6">
              <Skeleton className="h-8 w-8 rounded mb-4" />
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-card/50 border-border/50">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <Skeleton className="w-32 h-20 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
