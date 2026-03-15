import { useState, useRef } from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  ArrowLeft,
  Upload,
  X,
  CheckCircle,
  Tent,
  Globe,
  Mail,
  MapPin,
  Camera,
  Music,
  Calendar,
  Loader2,
} from "lucide-react";

const GENRES = [
  "Psytrance",
  "Progressive Psytrance",
  "Dark Psytrance",
  "Goa Trance",
  "Full-On",
  "Techno",
  "Ambient",
  "Chill",
  "Other",
];

// Popular psytrance countries first, then rest alphabetical
const COUNTRIES = [
  "Israel",
  "Germany",
  "Portugal",
  "Brazil",
  "India",
  "Greece",
  "Hungary",
  "United Kingdom",
  "Mexico",
  "Peru",
  "Thailand",
  "South Africa",
  // Rest alphabetical
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina",
  "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bangladesh",
  "Belgium", "Bolivia", "Bosnia and Herzegovina", "Bulgaria", "Cambodia",
  "Cameroon", "Canada", "Chile", "China", "Colombia", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Estonia", "Ethiopia", "Finland",
  "France", "Georgia", "Ghana", "Guatemala", "Honduras", "Iceland",
  "Indonesia", "Iran", "Iraq", "Ireland", "Italy", "Jamaica", "Japan",
  "Jordan", "Kazakhstan", "Kenya", "Latvia", "Lebanon", "Lithuania",
  "Luxembourg", "Malaysia", "Malta", "Morocco", "Myanmar", "Namibia",
  "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Nigeria", "Norway",
  "Pakistan", "Palestine", "Panama", "Paraguay", "Philippines", "Poland",
  "Romania", "Russia", "Saudi Arabia", "Serbia", "Singapore", "Slovakia",
  "Slovenia", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
  "Taiwan", "Tanzania", "Tunisia", "Turkey", "Uganda", "Ukraine",
  "United Arab Emirates", "United States", "Uruguay", "Venezuela", "Vietnam",
  "Zimbabwe",
];

interface ImageUpload {
  file: File | null;
  preview: string;
  uploading: boolean;
  url: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export default function FestivalSubmit() {
  usePageMeta({
    title: "Submit Your Festival | Psychedelic Universe",
    description:
      "Submit your psytrance or psychedelic festival to be featured on the Psychedelic Universe festival calendar.",
    canonicalPath: "/festivals/submit",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [festivalName, setFestivalName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [locationName, setLocationName] = useState("");
  const [locationCountry, setLocationCountry] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [lineup, setLineup] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [ticketUrl, setTicketUrl] = useState("");

  // Image uploads
  const [logo, setLogo] = useState<ImageUpload>({
    file: null,
    preview: "",
    uploading: false,
    url: "",
  });
  const [photos, setPhotos] = useState<ImageUpload[]>([
    { file: null, preview: "", uploading: false, url: "" },
    { file: null, preview: "", uploading: false, url: "" },
    { file: null, preview: "", uploading: false, url: "" },
  ]);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createSubmission = trpc.festivalSubmissions.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setIsSubmitting(false);
    },
    onError: (err) => {
      toast.error(err.message);
      setIsSubmitting(false);
    },
  });

  const uploadImage = trpc.festivalSubmissions.uploadImage.useMutation();

  const slugify = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const handleImageSelect = async (
    file: File,
    setter: (val: ImageUpload) => void,
    fieldName: string
  ) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Only PNG, JPG, and WebP images are accepted",
      }));
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "Image must be under 5MB",
      }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });

    const preview = URL.createObjectURL(file);
    setter({ file, preview, uploading: true, url: "" });

    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const slug = slugify(festivalName || "unnamed");
      const result = await uploadImage.mutateAsync({
        fileName: file.name,
        fileData: base64,
        contentType: file.type,
        slug,
      });
      setter({ file, preview, uploading: false, url: result.url });
    } catch {
      setter({ file, preview, uploading: false, url: "" });
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  const clearImage = (
    setter: (val: ImageUpload) => void,
    inputRef: React.RefObject<HTMLInputElement | null>
  ) => {
    setter({ file: null, preview: "", uploading: false, url: "" });
    if (inputRef.current) inputRef.current.value = "";
  };

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!festivalName.trim()) newErrors.festivalName = "Festival name is required";
    if (!description.trim() || description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";
    if (selectedGenres.length === 0)
      newErrors.genres = "Select at least one genre";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate && startDate > endDate)
      newErrors.endDate = "End date must be after start date";
    if (!locationName.trim()) newErrors.locationName = "Venue/location is required";
    if (!locationCountry) newErrors.locationCountry = "Country is required";
    if (!contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!contactEmail.trim()) newErrors.contactEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail))
      newErrors.contactEmail = "Please enter a valid email";

    // Check if any images are still uploading
    if (logo.uploading || photos.some((p) => p.uploading)) {
      newErrors.images = "Please wait for all images to finish uploading";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    createSubmission.mutate({
      festivalName: festivalName.trim(),
      websiteUrl: websiteUrl.trim() || undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      locationName: locationName.trim(),
      locationCountry,
      startDate,
      endDate,
      genres: selectedGenres.join(", "),
      description: description.trim(),
      lineup: lineup.trim() || undefined,
      logoUrl: logo.url || undefined,
      photo1Url: photos[0].url || undefined,
      photo2Url: photos[1].url || undefined,
      photo3Url: photos[2].url || undefined,
      facebookUrl: facebookUrl.trim() || undefined,
      instagramUrl: instagramUrl.trim() || undefined,
      ticketUrl: ticketUrl.trim() || undefined,
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden">
        <Navigation />
        <main className="flex-1 pt-16 flex items-center justify-center">
          <div className="text-center max-w-lg mx-auto px-4 py-20">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            </div>
            <h1 className="font-orbitron text-3xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Submission Received!
              </span>
            </h1>
            <p className="text-muted-foreground text-lg mb-2">
              Thank you! Your festival has been submitted for review.
            </p>
            <p className="text-muted-foreground/70 text-sm mb-8">
              Featured festivals appear at the top of our Festivals page.
              Submissions are reviewed within 48 hours.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/festivals">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-slate-950">
                  <Tent className="w-4 h-4 mr-2" /> View Festivals
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Navigation />
      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 via-cyan-500/5 to-transparent" />
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <Link
              href="/festivals"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Festival Calendar
            </Link>

            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6">
                <Tent className="w-4 h-4" />
                Submit Your Festival
              </div>
              <h1 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Get Your Festival Listed
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Share your psychedelic festival with the Psychedelic Universe
                community. Fill out the details below and our team will review
                your submission.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-8 pb-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Section 1: Festival Details */}
              <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 md:p-8">
                <h2 className="font-orbitron text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Tent className="w-5 h-5 text-cyan-400" />
                  Festival Details
                </h2>
                <div className="space-y-5">
                  <div>
                    <Label className="text-foreground">
                      Festival Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={festivalName}
                      onChange={(e) => setFestivalName(e.target.value)}
                      placeholder="e.g., Boom Festival"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                    {errors.festivalName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.festivalName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-foreground">Website</Label>
                    <Input
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://yourfestival.com"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                  </div>

                  <div>
                    <Label className="text-foreground">
                      Description <span className="text-red-400">*</span>
                    </Label>
                    <Textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about your festival - what makes it special, the vibe, the experience..."
                      rows={4}
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-foreground">
                      Genres <span className="text-red-400">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {GENRES.map((genre) => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => toggleGenre(genre)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            selectedGenres.includes(genre)
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                              : "bg-muted/30 text-muted-foreground border border-border/30 hover:border-border/60"
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                    {errors.genres && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.genres}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground">
                        Start Date <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="mt-1.5 bg-muted/30 border-border/50"
                      />
                      {errors.startDate && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label className="text-foreground">
                        End Date <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="mt-1.5 bg-muted/30 border-border/50"
                      />
                      {errors.endDate && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Location */}
              <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 md:p-8">
                <h2 className="font-orbitron text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Location
                </h2>
                <div className="space-y-5">
                  <div>
                    <Label className="text-foreground">
                      Venue / Location Name{" "}
                      <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={locationName}
                      onChange={(e) => setLocationName(e.target.value)}
                      placeholder="e.g., Idanha-a-Nova, Beira Baixa"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                    {errors.locationName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.locationName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-foreground">
                      Country <span className="text-red-400">*</span>
                    </Label>
                    <select
                      value={locationCountry}
                      onChange={(e) => setLocationCountry(e.target.value)}
                      className="mt-1.5 w-full rounded-md bg-muted/30 border border-border/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((c, i) => (
                        <option key={c} value={c}>
                          {i < 12 ? `${c}` : c}
                        </option>
                      ))}
                    </select>
                    {errors.locationCountry && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.locationCountry}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Contact */}
              <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 md:p-8">
                <h2 className="font-orbitron text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-400" />
                  Contact Information
                </h2>
                <div className="space-y-5">
                  <div>
                    <Label className="text-foreground">
                      Your Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Your name or organization name"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                    {errors.contactName && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.contactName}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-foreground">
                      Email <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="contact@yourfestival.com"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                    {errors.contactEmail && (
                      <p className="text-red-400 text-xs mt-1">
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Media */}
              <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 md:p-8">
                <h2 className="font-orbitron text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Camera className="w-5 h-5 text-amber-400" />
                  Media
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Upload your festival logo and up to 3 photos. Max 5MB each
                  (PNG, JPG, WebP).
                </p>

                {errors.images && (
                  <p className="text-red-400 text-xs mb-4">{errors.images}</p>
                )}

                {/* Logo */}
                <div className="mb-6">
                  <Label className="text-foreground mb-2 block">
                    Festival Logo
                  </Label>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file, setLogo, "logo");
                    }}
                  />
                  {logo.preview ? (
                    <div className="relative inline-block">
                      <img
                        src={logo.preview}
                        alt="Logo preview"
                        className="w-32 h-32 object-contain rounded-xl border border-border/30 bg-muted/20"
                      />
                      {logo.uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                          <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => clearImage(setLogo, logoInputRef)}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="w-32 h-32 rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                    >
                      <Upload className="w-6 h-6" />
                      <span className="text-xs">Upload Logo</span>
                    </button>
                  )}
                  {errors.logo && (
                    <p className="text-red-400 text-xs mt-1">{errors.logo}</p>
                  )}
                </div>

                {/* Photos */}
                <Label className="text-foreground mb-2 block">
                  Festival Photos (up to 3)
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {photos.map((photo, idx) => (
                    <div key={idx}>
                      <input
                        ref={photoInputRefs[idx]}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageSelect(
                              file,
                              (val) => {
                                setPhotos((prev) => {
                                  const next = [...prev];
                                  next[idx] = val;
                                  return next;
                                });
                              },
                              `photo${idx}`
                            );
                          }
                        }}
                      />
                      {photo.preview ? (
                        <div className="relative">
                          <img
                            src={photo.preview}
                            alt={`Photo ${idx + 1} preview`}
                            className="w-full aspect-video object-cover rounded-xl border border-border/30"
                          />
                          {photo.uploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              clearImage(
                                (val) => {
                                  setPhotos((prev) => {
                                    const next = [...prev];
                                    next[idx] = val;
                                    return next;
                                  });
                                },
                                photoInputRefs[idx]
                              )
                            }
                            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => photoInputRefs[idx].current?.click()}
                          className="w-full aspect-video rounded-xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
                        >
                          <Camera className="w-5 h-5" />
                          <span className="text-xs">Photo {idx + 1}</span>
                        </button>
                      )}
                      {errors[`photo${idx}`] && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors[`photo${idx}`]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 5: Links */}
              <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 md:p-8">
                <h2 className="font-orbitron text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Social Links
                </h2>
                <div className="space-y-5">
                  <div>
                    <Label className="text-foreground">Facebook</Label>
                    <Input
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/yourfestival"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Instagram</Label>
                    <Input
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/yourfestival"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                  </div>
                  <div>
                    <Label className="text-foreground">Ticket URL</Label>
                    <Input
                      value={ticketUrl}
                      onChange={(e) => setTicketUrl(e.target.value)}
                      placeholder="https://tickets.yourfestival.com"
                      className="mt-1.5 bg-muted/30 border-border/50"
                    />
                  </div>
                </div>
              </div>

              {/* Section 6: Lineup */}
              <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-6 md:p-8">
                <h2 className="font-orbitron text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Music className="w-5 h-5 text-fuchsia-400" />
                  Lineup
                </h2>
                <div>
                  <Label className="text-foreground">
                    Artists (one per line)
                  </Label>
                  <Textarea
                    value={lineup}
                    onChange={(e) => setLineup(e.target.value)}
                    placeholder={"Astrix\nVini Vici\nAce Ventura\nBlast Delay\n..."}
                    rows={6}
                    className="mt-1.5 bg-muted/30 border-border/50 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="text-center space-y-4">
                <p className="text-muted-foreground/60 text-sm">
                  Submissions are reviewed within 48 hours.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 py-6 text-lg font-orbitron bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 rounded-xl shadow-[0_0_30px_-5px_rgba(34,211,238,0.4)] hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.6)] transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5 mr-2" />
                      Submit Festival
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
