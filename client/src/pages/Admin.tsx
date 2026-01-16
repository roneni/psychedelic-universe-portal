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
import { Music, Users, Settings, Mail, Plus, Trash2, Edit, Save, X, ArrowLeft, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

type Category = "goa-trance" | "progressive-psy" | "full-on" | "psychill";

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
  category: "goa-trance",
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
  const [activeTab, setActiveTab] = useState("mixes");
  const [editingMixId, setEditingMixId] = useState<number | null>(null);
  const [editingPartnerId, setEditingPartnerId] = useState<number | null>(null);
  const [mixForm, setMixForm] = useState<MixFormData>(defaultMixForm);
  const [partnerForm, setPartnerForm] = useState<PartnerFormData>(defaultPartnerForm);
  const [showMixForm, setShowMixForm] = useState(false);
  const [showPartnerForm, setShowPartnerForm] = useState(false);

  // Queries
  const mixesQuery = trpc.mixes.list.useQuery();
  const partnersQuery = trpc.partners.list.useQuery();
  const subscribersQuery = trpc.subscribers.list.useQuery(undefined, {
    enabled: user?.role === "admin",
  });
  const settingsQuery = trpc.settings.list.useQuery(undefined, {
    enabled: user?.role === "admin",
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-slate-900/50 border border-slate-800">
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
                              <SelectItem value="goa-trance">Goa Trance</SelectItem>
                              <SelectItem value="progressive-psy">Progressive Psy</SelectItem>
                              <SelectItem value="full-on">Full-On</SelectItem>
                              <SelectItem value="psychill">Psychill / Ambient</SelectItem>
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
                    onSave={(key, value) => upsertSetting.mutate({ key, value })}
                  />
                  <SettingRow
                    label="YouTube Channel ID"
                    settingKey="youtube_channel_id"
                    placeholder="UCyRw5ZEQ2mVwNKq9GnSTHRA"
                    description="Your YouTube channel ID for the subscriber counter"
                    settings={settingsQuery.data}
                    onSave={(key, value) => upsertSetting.mutate({ key, value })}
                  />
                  <SettingRow
                    label="YouTube API Key"
                    settingKey="youtube_api_key"
                    placeholder="AIzaSy..."
                    description="Your YouTube Data API key"
                    settings={settingsQuery.data}
                    onSave={(key, value) => upsertSetting.mutate({ key, value })}
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

interface SettingRowProps {
  label: string;
  settingKey: string;
  placeholder: string;
  description: string;
  settings: { key: string; value: string | null }[] | undefined;
  onSave: (key: string, value: string) => void;
}

function SettingRow({ label, settingKey, placeholder, description, settings, onSave }: SettingRowProps) {
  const currentValue = settings?.find((s) => s.key === settingKey)?.value || "";
  const [value, setValue] = useState(currentValue);
  const [isDirty, setIsDirty] = useState(false);

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

  const handleSave = () => {
    onSave(settingKey, value);
    setIsDirty(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-slate-300">{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-slate-900 border-slate-700 text-slate-100"
        />
        <Button 
          onClick={handleSave} 
          disabled={!isDirty} 
          variant={isDirty ? "default" : "outline"}
          className={isDirty ? "bg-cyan-500 hover:bg-cyan-600 text-slate-950" : "border-slate-700 text-slate-400"}
        >
          <Save className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
