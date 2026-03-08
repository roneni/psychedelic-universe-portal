import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Music, Users, Settings, Mail, Plus, Trash2, Edit, Save, X, ArrowLeft, LogOut, BarChart3, ExternalLink, Eye, EyeOff, Check, Activity, Handshake, Disc3, Globe, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

type Category = "progressive-psy" | "psychedelic-trance" | "goa-trance" | "full-on";

interface MixFormData {
  title: string;
  youtubeId: string;
  category: Category;
  description: string;
  featured: boolean;
  sortOrder: number;
}

interface PartnerFormData {
  name: string;
  logoUrl: string;
  websiteUrl: string;
  quote: string;
  active: boolean;
  sortOrder: number;
}

const defaultMixForm: MixFormData = {
  title: "",
  youtubeId: "",
  category: "progressive-psy",
  description: "",
  featured: false,
  sortOrder: 0,
};

const defaultPartnerForm: PartnerFormData = {
  name: "",
  logoUrl: "",
  websiteUrl: "",
  quote: "",
  active: true,
  sortOrder: 0,
};

export default function Admin() {
  const { user, loading, logout } = useAuth();
  // Handle URL params from OAuth redirect (e.g., ?tab=analytics&ga4=connected)
  const urlParams = new URLSearchParams(window.location.search);
  const initialTab = urlParams.get("tab") || "analytics";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [editingMixId, setEditingMixId] = useState<number | null>(null);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [mixForm, setMixForm] = useState<MixFormData>(defaultMixForm);
  const [partnerForm, setPartnerForm] = useState<PartnerFormData>(defaultPartnerForm);
  const [showMixForm, setShowMixForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  // Show toast on GA4 connection result
  useEffect(() => {
    const ga4Status = urlParams.get("ga4");
    if (ga4Status === "connected") toast.success("Google Analytics connected successfully!");
    if (ga4Status === "error") toast.error("Failed to connect Google Analytics. Please try again.");
    if (ga4Status) window.history.replaceState({}, "", "/admin");
  }, []);

  // Queries
  const mixesQuery = trpc.mixes.list.useQuery();
  const partnersQuery = trpc.partners.list.useQuery();
  const subscribersQuery = trpc.subscribers.list.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const settingsQuery = trpc.settings.list.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const userCountQuery = trpc.users.count.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const contentStatsQuery = trpc.admin.getContentStats.useQuery(undefined, {
    enabled: user?.role === "admin",
  });

  // GA4 Analytics queries
  const ga4ConnectedQuery = trpc.analytics.isConnected.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const ga4OAuthUrlQuery = trpc.analytics.getOAuthUrl.useQuery(undefined, {
    enabled: user?.role === "admin" && ga4ConnectedQuery.data?.connected === false,
  });
  const ga4OverviewQuery = trpc.analytics.getOverview.useQuery(undefined, {
    enabled: user?.role === "admin" && ga4ConnectedQuery.data?.connected === true,
  });
  const ga4TopPagesQuery = trpc.analytics.getTopPages.useQuery(undefined, {
    enabled: user?.role === "admin" && ga4ConnectedQuery.data?.connected === true,
  });
  const ga4TrafficQuery = trpc.analytics.getTrafficSources.useQuery(undefined, {
    enabled: user?.role === "admin" && ga4ConnectedQuery.data?.connected === true,
  });
  const ga4CountriesQuery = trpc.analytics.getCountries.useQuery(undefined, {
    enabled: user?.role === "admin" && ga4ConnectedQuery.data?.connected === true,
  });
  const ga4PageViewsQuery = trpc.analytics.getPageViewsOverTime.useQuery(undefined, {
    enabled: user?.role === "admin" && ga4ConnectedQuery.data?.connected === true,
  });

  // Mutations
  const createMix = trpc.mixes.create.useMutation({
    onSuccess: () => {
      toast.success("Mix created successfully!");
      mixesQuery.refetch();
      setShowMixForm(false);
      setMixForm(defaultMixForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMix = trpc.mixes.update.useMutation({
    onSuccess: () => {
      toast.success("Mix updated successfully!");
      mixesQuery.refetch();
      setEditingMixId(null);
      setMixForm(defaultMixForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMix = trpc.mixes.delete.useMutation({
    onSuccess: () => {
      toast.success("Mix deleted successfully!");
      mixesQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const createPartner = trpc.partners.create.useMutation({
    onSuccess: () => {
      toast.success("Partner created successfully!");
      partnersQuery.refetch();
      setShowPartnerForm(false);
      setPartnerForm(defaultPartnerForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const updatePartner = trpc.partners.update.useMutation({
    onSuccess: () => {
      toast.success("Partner updated successfully!");
      partnersQuery.refetch();
      setEditingPartnerId(null);
      setPartnerForm(defaultPartnerForm);
    },
    onError: (err) => toast.error(err.message),
  });

  const deletePartner = trpc.partners.delete.useMutation({
    onSuccess: () => {
      toast.success("Partner deleted successfully!");
      partnersQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const removeSubscriber = trpc.subscribers.remove.useMutation({
    onSuccess: () => {
      toast.success("Subscriber removed!");
      subscribersQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  const upsertSetting = trpc.settings.upsert.useMutation({
    onSuccess: () => {
      toast.success("Setting saved!");
      settingsQuery.refetch();
    },
    onError: (err) => toast.error(err.message),
  });

  // Check admin access
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="w-96 bg-slate-900/80 border-slate-800">
          <CardHeader>
            <CardTitle className="text-cyan-400">Sign In Required</CardTitle>
            <CardDescription className="text-slate-400">Please sign in to access the admin dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => window.location.href = getLoginUrl()}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Card className="w-96 bg-slate-900/80 border-slate-800">
          <CardHeader>
            <CardTitle className="text-red-400">Access Denied</CardTitle>
            <CardDescription className="text-slate-400">You need admin privileges to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleMixSubmit = () => {
    if (editingMixId) {
      updateMix.mutate({ id: editingMixId, ...mixForm });
    } else {
      createMix.mutate(mixForm);
    }
  };

  const handlePartnerSubmit = () => {
    if (editingPartnerId) {
      updatePartner.mutate({ id: editingPartnerId, ...partnerForm });
    } else {
      createPartner.mutate(partnerForm);
    }
  };

  const startEditMix = (mix: NonNullable<typeof mixesQuery.data>[number]) => {
    setMixForm({
      title: mix.title,
      youtubeId: mix.youtubeId,
      category: mix.category as Category,
      description: mix.description || "",
      featured: mix.featured,
      sortOrder: mix.sortOrder,
    });
    setEditingMixId(mix.id);
    setShowMixForm(true);
  };

  const startEditPartner = (partner: NonNullable<typeof partnersQuery.data>[number]) => {
    setPartnerForm({
      name: partner.name,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl || "",
      quote: partner.quote || "",
      active: partner.active,
      sortOrder: partner.sortOrder,
    });
    setEditingPartnerId(partner.id);
    setShowPartnerForm(true);
  };

  const cancelMixEdit = () => {
    setEditingMixId(null);
    setShowMixForm(false);
    setMixForm(defaultMixForm);
  };

  const cancelPartnerEdit = () => {
    setEditingPartnerId(null);
    setShowPartnerForm(false);
    setPartnerForm(defaultPartnerForm);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-100">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Site
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-800" />
            <h1 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Welcome, <span className="text-cyan-400">{user.name}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-red-400">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Music className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{mixesQuery.data?.length ?? "—"}</p>
                <p className="text-xs text-slate-400">Total Mixes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Handshake className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{partnersQuery.data?.length ?? "—"}</p>
                <p className="text-xs text-slate-400">Total Partners</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{subscribersQuery.data?.length ?? "—"}</p>
                <p className="text-xs text-slate-400">Subscribers</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-100">{userCountQuery.data ?? "—"}</p>
                <p className="text-xs text-slate-400">Registered Users</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">Live</p>
                <p className="text-xs text-slate-400">Site Status</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="analytics" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <BarChart3 className="w-4 h-4 mr-2" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="mixes" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Music className="w-4 h-4 mr-2" /> Mixes
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Users className="w-4 h-4 mr-2" /> Partners
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Mail className="w-4 h-4 mr-2" /> Subscribers
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              {/* Section 1: Connection Status */}
              {ga4ConnectedQuery.isLoading ? (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="p-8 text-center">
                    <div className="animate-pulse text-cyan-400">Checking GA4 connection...</div>
                  </CardContent>
                </Card>
              ) : ga4ConnectedQuery.data?.connected ? (
                <>
                  {/* Connected badge */}
                  <div className="flex items-center gap-2 px-1">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-sm font-medium">GA4 Connected</span>
                    <span className="text-xs text-slate-500 font-mono ml-2">G-4DMCLVD7MV</span>
                  </div>

                  {/* Section 2: Overview Cards */}
                  {ga4OverviewQuery.data && 'pageViews' in ga4OverviewQuery.data ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <OverviewCard label="Page Views" value={ga4OverviewQuery.data.pageViews} change={ga4OverviewQuery.data.changes.pageViews} />
                      <OverviewCard label="Users" value={ga4OverviewQuery.data.users} change={ga4OverviewQuery.data.changes.users} />
                      <OverviewCard label="Sessions" value={ga4OverviewQuery.data.sessions} change={ga4OverviewQuery.data.changes.sessions} />
                      <OverviewCard label="Avg Duration" value={ga4OverviewQuery.data.avgDuration} change={ga4OverviewQuery.data.changes.avgDuration} format="duration" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i} className="bg-slate-900/50 border-slate-800">
                          <CardContent className="p-4 space-y-2">
                            <div className="h-3 w-16 bg-slate-800 rounded animate-pulse" />
                            <div className="h-7 w-20 bg-slate-800 rounded animate-pulse" />
                            <div className="h-3 w-24 bg-slate-800 rounded animate-pulse" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Section 3: Page Views Chart */}
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                      <CardTitle className="text-slate-100">Page Views — Last 30 Days</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {ga4PageViewsQuery.data && 'daily' in ga4PageViewsQuery.data ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={ga4PageViewsQuery.data.daily}>
                            <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                            <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #334155", borderRadius: "8px" }}
                              labelStyle={{ color: "#94a3b8" }}
                              itemStyle={{ color: "#22d3ee" }}
                            />
                            <Line type="monotone" dataKey="views" stroke="#22d3ee" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center">
                          <div className="animate-pulse text-slate-500">Loading chart data...</div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Section 4: Data Tables */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Top Pages */}
                    <Card className="bg-slate-900/50 border-slate-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-slate-100">Top Pages</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {ga4TopPagesQuery.data && 'pages' in ga4TopPagesQuery.data ? (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {ga4TopPagesQuery.data.pages.map((p, i) => (
                              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/50 last:border-0">
                                <span className="text-slate-300 truncate mr-2 max-w-[140px]" title={p.path}>{p.path}</span>
                                <span className="text-cyan-400 font-medium tabular-nums">{p.views.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-sm py-4 text-center animate-pulse">Loading...</div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Traffic Sources */}
                    <Card className="bg-slate-900/50 border-slate-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-slate-100">Traffic Sources</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {ga4TrafficQuery.data && 'sources' in ga4TrafficQuery.data ? (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {ga4TrafficQuery.data.sources.map((s, i) => (
                              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/50 last:border-0">
                                <span className="text-slate-300 truncate mr-2 max-w-[140px]" title={s.source}>{s.source}</span>
                                <span className="text-cyan-400 font-medium tabular-nums">{s.sessions.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-sm py-4 text-center animate-pulse">Loading...</div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Countries */}
                    <Card className="bg-slate-900/50 border-slate-800">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-slate-100">Top Countries</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {ga4CountriesQuery.data && 'countries' in ga4CountriesQuery.data ? (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto">
                            {ga4CountriesQuery.data.countries.map((c, i) => (
                              <div key={i} className="flex items-center justify-between text-sm py-1.5 border-b border-slate-800/50 last:border-0">
                                <span className="text-slate-300 truncate mr-2">{c.country}</span>
                                <span className="text-cyan-400 font-medium tabular-nums">{c.users.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-sm py-4 text-center animate-pulse">Loading...</div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                /* Not connected — show Connect button */
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-slate-100">Connect Google Analytics</CardTitle>
                    <CardDescription className="text-slate-400">
                      Link your GA4 property to view analytics data directly in your admin panel.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-slate-300">GA4 tracking is active on your site</span>
                      <span className="ml-auto text-xs text-slate-500 font-mono">G-4DMCLVD7MV</span>
                    </div>
                    <Button
                      onClick={() => {
                        if (ga4OAuthUrlQuery.data?.url) {
                          window.location.href = ga4OAuthUrlQuery.data.url;
                        }
                      }}
                      disabled={!ga4OAuthUrlQuery.data?.url}
                      className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
                    >
                      <ArrowUpRight className="w-4 h-4 mr-2" /> Connect Google Analytics
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Section 5: Quick Links (always shown) */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50">
                      <BarChart3 className="w-5 h-5 text-cyan-400" />
                      <span className="text-slate-100 font-medium">Google Analytics</span>
                      <ExternalLink className="w-4 h-4 text-slate-500 ml-auto" />
                    </a>
                    <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50">
                      <Globe className="w-5 h-5 text-green-400" />
                      <span className="text-slate-100 font-medium">Search Console</span>
                      <ExternalLink className="w-4 h-4 text-slate-500 ml-auto" />
                    </a>
                    <a href="https://studio.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50">
                      <Disc3 className="w-5 h-5 text-red-400" />
                      <span className="text-slate-100 font-medium">YouTube Studio</span>
                      <ExternalLink className="w-4 h-4 text-slate-500 ml-auto" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Content Stats */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-slate-100">Content Overview</CardTitle>
                  <CardDescription className="text-slate-400">Breakdown of your site content</CardDescription>
                </CardHeader>
                <CardContent>
                  {contentStatsQuery.data ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {contentStatsQuery.data.mixesByCategory.map((cat) => (
                        <div key={cat.category} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                          <p className="text-lg font-bold text-slate-100">{cat.count}</p>
                          <p className="text-xs text-slate-400 capitalize">{cat.category.replace(/-/g, " ")}</p>
                        </div>
                      ))}
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-lg font-bold text-cyan-400">{contentStatsQuery.data.featuredCount}</p>
                        <p className="text-xs text-slate-400">Featured Mixes</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-lg font-bold text-slate-100">
                          {contentStatsQuery.data.partnerStats.active}
                          <span className="text-sm font-normal text-slate-500"> / {contentStatsQuery.data.partnerStats.total}</span>
                        </p>
                        <p className="text-xs text-slate-400">Active / Total Partners</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                        <p className="text-lg font-bold text-slate-100">{contentStatsQuery.data.subscriberCount}</p>
                        <p className="text-xs text-slate-400">Subscribers</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-slate-500 py-8 animate-pulse">Loading content stats...</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* MIXES TAB */}
          <TabsContent value="mixes">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">Manage Mixes</CardTitle>
                  <CardDescription className="text-slate-400">Add, edit, or remove YouTube mixes from your catalog.</CardDescription>
                </div>
                <Button 
                  onClick={() => { setShowMixForm(true); setEditingMixId(null); setMixForm(defaultMixForm); }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Mix
                </Button>
              </CardHeader>
              <CardContent>
                {showMixForm && (
                  <Card className="mb-6 border-cyan-500/50 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-cyan-400">{editingMixId ? "Edit Mix" : "New Mix"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Title</Label>
                          <Input
                            value={mixForm.title}
                            onChange={(e) => setMixForm({ ...mixForm, title: e.target.value })}
                            placeholder="Mix title"
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">YouTube ID</Label>
                          <Input
                            value={mixForm.youtubeId}
                            onChange={(e) => setMixForm({ ...mixForm, youtubeId: e.target.value })}
                            placeholder="e.g., dQw4w9WgXcQ"
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Category</Label>
                          <Select
                            value={mixForm.category}
                            onValueChange={(v) => setMixForm({ ...mixForm, category: v as Category })}
                          >
                            <SelectTrigger className="bg-slate-900 border-slate-700 text-slate-100">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                              <SelectItem value="progressive-psy">Progressive Psytrance</SelectItem>
                              <SelectItem value="psychedelic-trance">Psychedelic Trance</SelectItem>
                              <SelectItem value="goa-trance">Goa Trance</SelectItem>
                              <SelectItem value="full-on">Full-On</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Sort Order</Label>
                          <Input
                            type="number"
                            value={mixForm.sortOrder}
                            onChange={(e) => setMixForm({ ...mixForm, sortOrder: parseInt(e.target.value) || 0 })}
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Description</Label>
                        <Textarea
                          value={mixForm.description}
                          onChange={(e) => setMixForm({ ...mixForm, description: e.target.value })}
                          placeholder="Optional description"
                          className="bg-slate-900 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={mixForm.featured}
                          onCheckedChange={(v) => setMixForm({ ...mixForm, featured: v })}
                        />
                        <Label className="text-slate-300">Featured</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handleMixSubmit} 
                          disabled={createMix.isPending || updateMix.isPending}
                          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
                        >
                          <Save className="w-4 h-4 mr-2" /> {editingMixId ? "Update" : "Create"}
                        </Button>
                        <Button variant="outline" onClick={cancelMixEdit} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                          <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {mixesQuery.data?.map((mix) => (
                    <div
                      key={mix.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={`https://img.youtube.com/vi/${mix.youtubeId}/mqdefault.jpg`}
                          alt={mix.title}
                          className="w-24 h-14 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium text-slate-100">{mix.title}</h4>
                          <p className="text-sm text-slate-400">
                            {mix.category} {mix.featured && <span className="text-cyan-400">• Featured</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => startEditMix(mix)} className="text-slate-400 hover:text-cyan-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-red-400"
                          onClick={() => deleteMix.mutate({ id: mix.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!mixesQuery.data || mixesQuery.data.length === 0) && (
                    <p className="text-center text-slate-500 py-8">No mixes yet. Add your first mix above!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PARTNERS TAB */}
          <TabsContent value="partners">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-slate-100">Manage Partners</CardTitle>
                  <CardDescription className="text-slate-400">Add, edit, or remove brand partners from the carousel.</CardDescription>
                </div>
                <Button 
                  onClick={() => { setShowPartnerForm(true); setEditingPartnerId(null); setPartnerForm(defaultPartnerForm); }}
                  className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Partner
                </Button>
              </CardHeader>
              <CardContent>
                {showPartnerForm && (
                  <Card className="mb-6 border-cyan-500/50 bg-slate-800/50">
                    <CardHeader>
                      <CardTitle className="text-lg text-cyan-400">{editingPartnerId ? "Edit Partner" : "New Partner"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Name</Label>
                          <Input
                            value={partnerForm.name}
                            onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                            placeholder="Partner name"
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Logo URL</Label>
                          <Input
                            value={partnerForm.logoUrl}
                            onChange={(e) => setPartnerForm({ ...partnerForm, logoUrl: e.target.value })}
                            placeholder="https://..."
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-slate-300">Website URL</Label>
                          <Input
                            value={partnerForm.websiteUrl}
                            onChange={(e) => setPartnerForm({ ...partnerForm, websiteUrl: e.target.value })}
                            placeholder="https://..."
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-300">Sort Order</Label>
                          <Input
                            type="number"
                            value={partnerForm.sortOrder}
                            onChange={(e) => setPartnerForm({ ...partnerForm, sortOrder: parseInt(e.target.value) || 0 })}
                            className="bg-slate-900 border-slate-700 text-slate-100"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-300">Quote / Testimonial</Label>
                        <Textarea
                          value={partnerForm.quote}
                          onChange={(e) => setPartnerForm({ ...partnerForm, quote: e.target.value })}
                          placeholder="Optional testimonial"
                          className="bg-slate-900 border-slate-700 text-slate-100"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={partnerForm.active}
                          onCheckedChange={(v) => setPartnerForm({ ...partnerForm, active: v })}
                        />
                        <Label className="text-slate-300">Active</Label>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          onClick={handlePartnerSubmit} 
                          disabled={createPartner.isPending || updatePartner.isPending}
                          className="bg-cyan-500 hover:bg-cyan-600 text-slate-950"
                        >
                          <Save className="w-4 h-4 mr-2" /> {editingPartnerId ? "Update" : "Create"}
                        </Button>
                        <Button variant="outline" onClick={cancelPartnerEdit} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                          <X className="w-4 h-4 mr-2" /> Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {partnersQuery.data?.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={partner.logoUrl}
                          alt={partner.name}
                          className="w-16 h-16 object-contain rounded bg-white p-1"
                        />
                        <div>
                          <h4 className="font-medium text-slate-100">{partner.name}</h4>
                          <p className="text-sm text-slate-400">
                            {partner.active ? <span className="text-green-400">Active</span> : <span className="text-slate-500">Inactive</span>} • Order: {partner.sortOrder}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => startEditPartner(partner)} className="text-slate-400 hover:text-cyan-400">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-red-400"
                          onClick={() => deletePartner.mutate({ id: partner.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!partnersQuery.data || partnersQuery.data.length === 0) && (
                    <p className="text-center text-slate-500 py-8">No partners yet. Add your first partner above!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SUBSCRIBERS TAB */}
          <TabsContent value="subscribers">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Newsletter Subscribers</CardTitle>
                <CardDescription className="text-slate-400">
                  {subscribersQuery.data?.length || 0} total subscribers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {subscribersQuery.data?.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors border border-slate-700/50"
                    >
                      <div>
                        <p className="font-medium text-slate-100">{sub.email}</p>
                        <p className="text-sm text-slate-400">
                          Subscribed: {new Date(sub.subscribedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => removeSubscriber.mutate({ id: sub.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {(!subscribersQuery.data || subscribersQuery.data.length === 0) && (
                    <p className="text-center text-slate-500 py-8">No subscribers yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-slate-100">Site Settings</CardTitle>
                <CardDescription className="text-slate-400">Configure your site settings like stream URL, social links, etc.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <SettingRow
                    label="Radio Stream URL"
                    settingKey="radio_stream_url"
                    placeholder="https://stream.example.com/listen"
                    description="The URL of your Icecast/Shoutcast stream"
                    settings={settingsQuery.data}
                    onSave={(key, value) => new Promise<void>((resolve, reject) => upsertSetting.mutate({ key, value }, { onSuccess: () => resolve(), onError: (e) => reject(e) }))}
                  />
                  <SettingRow
                    label="YouTube Channel ID"
                    settingKey="youtube_channel_id"
                    placeholder="UCyRw5ZEQ2mVwNKq9GnSTHRA"
                    description="Your YouTube channel ID for the subscriber counter"
                    settings={settingsQuery.data}
                    onSave={(key, value) => new Promise<void>((resolve, reject) => upsertSetting.mutate({ key, value }, { onSuccess: () => resolve(), onError: (e) => reject(e) }))}
                  />
                  <SettingRow
                    label="YouTube API Key"
                    settingKey="youtube_api_key"
                    placeholder="AIzaSy..."
                    description="Your YouTube Data API key"
                    isSecret
                    settings={settingsQuery.data}
                    onSave={(key, value) => new Promise<void>((resolve, reject) => upsertSetting.mutate({ key, value }, { onSuccess: () => resolve(), onError: (e) => reject(e) }))}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function OverviewCard({ label, value, change, format }: { label: string; value: number; change: number; format?: "number" | "duration" }) {
  const displayValue = format === "duration"
    ? `${Math.floor(value / 60)}m ${Math.round(value % 60)}s`
    : value.toLocaleString();

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-4">
        <p className="text-xs text-slate-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-slate-100">{displayValue}</p>
        <div className={`flex items-center gap-1 text-xs mt-1 ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
          {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(change)}% vs prev 30d</span>
        </div>
      </CardContent>
    </Card>
  );
}

interface SettingRowProps {
  label: string;
  settingKey: string;
  placeholder: string;
  description: string;
  isSecret?: boolean;
  settings: { key: string; value: string | null }[] | undefined;
  onSave: (key: string, value: string) => Promise<void>;
}

function SettingRow({ label, settingKey, placeholder, description, isSecret, settings, onSave }: SettingRowProps) {
  const currentValue = settings?.find((s) => s.key === settingKey)?.value || "";
  const [value, setValue] = useState(currentValue);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  // Update local state when settings load
  useEffect(() => {
    const newValue = settings?.find((s) => s.key === settingKey)?.value || "";
    setValue(newValue);
    setIsDirty(false);
  }, [settings, settingKey]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setIsDirty(newValue !== currentValue);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(settingKey, value);
      setIsDirty(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            type={isSecret && !showSecret ? "password" : "text"}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={`bg-slate-900 border-slate-700 text-slate-100 ${isSecret ? "pr-10" : ""}`}
          />
          {isSecret && (
            <button
              type="button"
              onClick={() => setShowSecret(!showSecret)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
            >
              {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        <Button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          variant={isDirty ? "default" : "outline"}
          className={isDirty ? "bg-cyan-500 hover:bg-cyan-600 text-slate-950" : "border-slate-600 text-slate-500 hover:text-slate-300 hover:border-slate-500"}
        >
          {isSaving ? (
            <span className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full inline-block" />
          ) : showSaved ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </Button>
      </div>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
