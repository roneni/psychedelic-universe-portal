import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Globe,
  Search,
  Filter,
  ExternalLink,
  Clock,
  Tent,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

// Festival data compiled from goabase.net, psymedia.co.za, psycalendar.com, psytranceportal.com
// Last updated: February 7, 2026

interface Festival {
  name: string;
  location: string;
  country: string;
  continent: string;
  startDate: string; // ISO date
  endDate: string;
  duration: string;
  size?: "small" | "medium" | "large" | "major";
  website?: string;
  featured?: boolean;
  genre?: string;
}

const festivals: Festival[] = [
  // February 2026
  { name: "HillTop Festival 2026", location: "Vagator, Goa", country: "India", continent: "Asia", startDate: "2026-02-05", endDate: "2026-02-08", duration: "3 days", size: "large", website: "https://hilltopgoa.com", genre: "Psychedelic Trance" },
  { name: "The Alternative Festival 2026", location: "Koh Ta Kiev", country: "Cambodia", continent: "Asia", startDate: "2026-02-19", endDate: "2026-02-24", duration: "5 days", size: "medium", genre: "Multi-genre" },
  { name: "Envision Festival", location: "Uvita", country: "Costa Rica", continent: "Central America", startDate: "2026-02-23", endDate: "2026-03-02", duration: "7 days", size: "large", website: "https://envisionfestival.com", genre: "Multi-genre" },
  { name: "YATRA Festival '26 × MO:DEM", location: "Takaka, Golden Bay", country: "New Zealand", continent: "Oceania", startDate: "2026-02-27", endDate: "2026-03-02", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Tribal Gathering", location: "Hippie Beach", country: "Panama", continent: "Central America", startDate: "2026-02-27", endDate: "2026-03-16", duration: "17 days", size: "large", website: "https://tribalgathering.com", genre: "Multi-genre" },
  { name: "Chilca Ovni Festival", location: "Lima", country: "Peru", continent: "South America", startDate: "2026-02-27", endDate: "2026-03-01", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "PuriMoksha 2026", location: "Israel", country: "Israel", continent: "Middle East", startDate: "2026-02-27", endDate: "2026-02-27", duration: "1 day", size: "large", genre: "Multi-genre" },

  // March 2026
  { name: "Fractal Festival 2026", location: "Usakos", country: "Namibia", continent: "Africa", startDate: "2026-03-12", endDate: "2026-03-15", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Miracle Festival", location: "Taiwan", country: "Taiwan", continent: "Asia", startDate: "2026-03-13", endDate: "2026-03-15", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Nahual Can Music + Arts Gathering", location: "Palenque", country: "Mexico", continent: "Central America", startDate: "2026-03-27", endDate: "2026-03-29", duration: "2 days", size: "medium", genre: "Multi-genre" },

  // April 2026
  { name: "Psycristance", location: "Chiapas", country: "Mexico", continent: "Central America", startDate: "2026-04-02", endDate: "2026-04-05", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "High Mountain Gathering VII", location: "Pokhara", country: "Nepal", continent: "Asia", startDate: "2026-04-13", endDate: "2026-04-15", duration: "2 days", size: "small", genre: "Psychedelic Trance" },
  { name: "AfrikaBurn", location: "Western South Africa", country: "South Africa", continent: "Africa", startDate: "2026-04-27", endDate: "2026-05-03", duration: "6 days", size: "large", website: "https://afrikaburn.com", genre: "Multi-genre" },
  { name: "Sati Festival", location: "The Holy Mountain", country: "Greece", continent: "Europe", startDate: "2026-04-30", endDate: "2026-05-03", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Hai in den Mai Festival", location: "Stemwede", country: "Germany", continent: "Europe", startDate: "2026-04-30", endDate: "2026-05-03", duration: "3 days", size: "large", website: "https://waldfrieden.de", genre: "Psychedelic Trance" },

  // May 2026
  { name: "Arkana Festival 2026", location: "Cusco", country: "Peru", continent: "South America", startDate: "2026-05-01", endDate: "2026-05-03", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Burning Nest", location: "nr Exeter, Devon", country: "United Kingdom", continent: "Europe", startDate: "2026-05-18", endDate: "2026-05-25", duration: "7 days", size: "medium", genre: "Multi-genre" },
  { name: "Ikarus Festival", location: "Southern Germany", country: "Germany", continent: "Europe", startDate: "2026-05-22", endDate: "2026-05-25", duration: "3 days", size: "large", genre: "Psychedelic Trance" },
  { name: "Quantum Awakening Festival 3.0", location: "Hammonton, New Jersey", country: "USA", continent: "North America", startDate: "2026-05-22", endDate: "2026-05-25", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Psychedelic Experience Open Air", location: "Gallin-Kuppentin", country: "Germany", continent: "Europe", startDate: "2026-05-29", endDate: "2026-06-01", duration: "3 days", size: "large", genre: "Psychedelic Trance" },
  { name: "Aura Festival", location: "Barcelona", country: "Spain", continent: "Europe", startDate: "2026-05-29", endDate: "2026-05-31", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Refractor 2026", location: "Valdeverdeja", country: "Spain", continent: "Europe", startDate: "2026-05-29", endDate: "2026-05-31", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },

  // June 2026
  { name: "Pulsar Festival 2026", location: "Cachoeira Alta", country: "Brazil", continent: "South America", startDate: "2026-06-03", endDate: "2026-06-08", duration: "5 days", size: "large", genre: "Psychedelic Trance" },
  { name: "Okami Festival", location: "Haute-Garonne", country: "France", continent: "Europe", startDate: "2026-06-03", endDate: "2026-06-07", duration: "4 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Zauberlippen Festival", location: "Schramberg", country: "Germany", continent: "Europe", startDate: "2026-06-04", endDate: "2026-06-08", duration: "4 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Amazon Festival 2026", location: "Rurrenabaque", country: "Bolivia", continent: "South America", startDate: "2026-06-05", endDate: "2026-06-07", duration: "2 days", size: "small", genre: "Psychedelic Trance" },
  { name: "KUMBHALA Festival", location: "Madrid", country: "Spain", continent: "Europe", startDate: "2026-06-05", endDate: "2026-06-07", duration: "2 days", size: "large", genre: "Psychedelic Trance" },
  { name: "Spirit Base Festival", location: "Vyrovice", country: "Czechia", continent: "Europe", startDate: "2026-06-11", endDate: "2026-06-14", duration: "3 days", size: "large", genre: "Psychedelic Trance" },
  { name: "Existance Festival", location: "Charlton Park, Wiltshire", country: "United Kingdom", continent: "Europe", startDate: "2026-06-11", endDate: "2026-06-14", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Outdoor Selection Festival", location: "Effingen", country: "Switzerland", continent: "Europe", startDate: "2026-06-12", endDate: "2026-06-14", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Waking Life Festival", location: "Crato", country: "Portugal", continent: "Europe", startDate: "2026-06-16", endDate: "2026-06-22", duration: "6 days", size: "large", website: "https://www.wakinglife.pt", genre: "Multi-genre" },
  { name: "Forest Star Festival", location: "Västra Götaland", country: "Sweden", continent: "Europe", startDate: "2026-06-18", endDate: "2026-06-22", duration: "4 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Fantàsia Festival", location: "Tuscany", country: "Italy", continent: "Europe", startDate: "2026-06-18", endDate: "2026-06-22", duration: "4 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Solomonari Festival", location: "nr Sibiu", country: "Romania", continent: "Europe", startDate: "2026-06-18", endDate: "2026-06-21", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Solar Light Festival", location: "Ancona", country: "Italy", continent: "Europe", startDate: "2026-06-19", endDate: "2026-06-21", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "ForRest Explosion Festival", location: "Parchim", country: "Germany", continent: "Europe", startDate: "2026-06-19", endDate: "2026-06-21", duration: "2 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "UFO BUFO Festival", location: "Hadinka", country: "Czechia", continent: "Europe", startDate: "2026-06-24", endDate: "2026-06-28", duration: "4 days", size: "large", genre: "Psychedelic Trance" },
  { name: "Burning Mountain Festival", location: "Zernez", country: "Switzerland", continent: "Europe", startDate: "2026-06-25", endDate: "2026-06-28", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Back To Nature Festival", location: "Datça/Muğla", country: "Turkey", continent: "Europe", startDate: "2026-06-25", endDate: "2026-06-29", duration: "4 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Colibri Spirit Festival", location: "Corfu", country: "Greece", continent: "Europe", startDate: "2026-06-28", endDate: "2026-07-03", duration: "5 days", size: "medium", genre: "Psychedelic Trance" },

  // July 2026
  { name: "Being Gathering", location: "BoomLand", country: "Portugal", continent: "Europe", startDate: "2026-07-01", endDate: "2026-07-05", duration: "4 days", size: "large", genre: "Multi-genre" },
  { name: "Ethereal Decibel Festival", location: "Saint Symphorien des Monts", country: "France", continent: "Europe", startDate: "2026-07-02", endDate: "2026-07-05", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Surya Spirits Festival", location: "Gent", country: "Belgium", continent: "Europe", startDate: "2026-07-03", endDate: "2026-07-06", duration: "3 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Masters of Puppets", location: "Vysočina Region", country: "Czechia", continent: "Europe", startDate: "2026-07-06", endDate: "2026-07-13", duration: "7 days", size: "large", website: "https://mastersofpuppets.cz", genre: "Psychedelic Trance", featured: true },
  { name: "Manas Festival", location: "Somogy County", country: "Hungary", continent: "Europe", startDate: "2026-07-08", endDate: "2026-07-13", duration: "5 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "Origin UK", location: "Cambridgeshire", country: "United Kingdom", continent: "Europe", startDate: "2026-07-10", endDate: "2026-07-12", duration: "2 days", size: "large", genre: "Psychedelic Trance" },
  { name: "Antaris Project 2026", location: "Gollenberg", country: "Germany", continent: "Europe", startDate: "2026-07-12", endDate: "2026-07-15", duration: "3 days", size: "large", website: "https://antaris-project.de", genre: "Psychedelic Trance", featured: true },
  { name: "S.U.N. Festival", location: "Csobánkapuszta", country: "Hungary", continent: "Europe", startDate: "2026-07-13", endDate: "2026-07-19", duration: "6 days", size: "large", genre: "Psychedelic Trance", featured: true },
  { name: "7 Chakras Festival", location: "Lazio Region", country: "Italy", continent: "Europe", startDate: "2026-07-14", endDate: "2026-07-20", duration: "6 days", size: "medium", genre: "Psychedelic Trance" },
  { name: "ZNA Gathering", location: "Montargil Lake", country: "Portugal", continent: "Europe", startDate: "2026-07-15", endDate: "2026-07-22", duration: "7 days", size: "large", genre: "Psychedelic Trance", featured: true },
  { name: "Noisily Festival", location: "Coney Woods, Leicestershire", country: "United Kingdom", continent: "Europe", startDate: "2026-07-16", endDate: "2026-07-19", duration: "3 days", size: "large", website: "https://noisilyfestival.com", genre: "Multi-genre" },
  { name: "O.Z.O.R.A. Festival 2026", location: "Dádpuszta", country: "Hungary", continent: "Europe", startDate: "2026-07-24", endDate: "2026-08-04", duration: "11 days", size: "major", website: "https://ozorafestival.eu", genre: "Psychedelic Trance", featured: true },

  // August 2026
  { name: "MO:DEM Festival 2026", location: "Primislje", country: "Croatia", continent: "Europe", startDate: "2026-08-03", endDate: "2026-08-09", duration: "6 days", size: "major", website: "https://modemfestival.com", genre: "Psychedelic Trance", featured: true },
  { name: "Hadra Trance Festival 2026", location: "Vieure", country: "France", continent: "Europe", startDate: "2026-08-26", endDate: "2026-09-03", duration: "8 days", size: "major", website: "https://hadratrancefestival.net", genre: "Psychedelic Trance", featured: true },
  { name: "Indian Spirit Festival 2026", location: "Eldena", country: "Germany", continent: "Europe", startDate: "2026-08-26", endDate: "2026-08-31", duration: "5 days", size: "major", website: "https://indian-spirit.de", genre: "Psychedelic Trance", featured: true },

  // December 2026
  { name: "Universo Paralello", location: "Pratigi, Bahia", country: "Brazil", continent: "South America", startDate: "2026-12-27", endDate: "2027-01-03", duration: "7 days", size: "major", website: "https://universoparalello.org", genre: "Psychedelic Trance", featured: true },
];

// Country flag helper
const getCountryFlag = (country: string): string => {
  const flags: Record<string, string> = {
    "India": "🇮🇳", "Cambodia": "🇰🇭", "Costa Rica": "🇨🇷", "New Zealand": "🇳🇿",
    "Panama": "🇵🇦", "Peru": "🇵🇪", "Israel": "🇮🇱", "Namibia": "🇳🇦",
    "Taiwan": "🇹🇼", "Mexico": "🇲🇽", "Nepal": "🇳🇵", "South Africa": "🇿🇦",
    "Greece": "🇬🇷", "Germany": "🇩🇪", "United Kingdom": "🇬🇧", "USA": "🇺🇸",
    "Spain": "🇪🇸", "Brazil": "🇧🇷", "France": "🇫🇷", "Czechia": "🇨🇿",
    "Switzerland": "🇨🇭", "Portugal": "🇵🇹", "Sweden": "🇸🇪", "Italy": "🇮🇹",
    "Romania": "🇷🇴", "Turkey": "🇹🇷", "Belgium": "🇧🇪", "Hungary": "🇭🇺",
    "Croatia": "🇭🇷", "Finland": "🇫🇮", "Bolivia": "🇧🇴", "Netherlands": "🇳🇱",
  };
  return flags[country] || "🌍";
};

const getSizeBadge = (size?: string) => {
  switch (size) {
    case "major": return { label: "Major", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    case "large": return { label: "Large", class: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30" };
    case "medium": return { label: "Medium", class: "bg-purple-500/20 text-purple-400 border-purple-500/30" };
    case "small": return { label: "Intimate", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
    default: return null;
  }
};

const months = [
  "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const continents = ["All", "Europe", "Asia", "South America", "Central America", "North America", "Africa", "Oceania", "Middle East"];

export default function Festivals() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filteredFestivals = useMemo(() => {
    return festivals
      .filter((f) => {
        const matchesSearch =
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesContinent = selectedContinent === "All" || f.continent === selectedContinent;
        const matchesMonth = !selectedMonth || new Date(f.startDate).toLocaleString("en", { month: "long" }) === selectedMonth;
        return matchesSearch && matchesContinent && matchesMonth;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [searchQuery, selectedContinent, selectedMonth]);

  // Group by month
  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Festival[]> = {};
    filteredFestivals.forEach((f) => {
      const month = new Date(f.startDate).toLocaleString("en", { month: "long", year: "numeric" });
      if (!groups[month]) groups[month] = [];
      groups[month].push(f);
    });
    return groups;
  }, [filteredFestivals]);

  const featuredFestivals = festivals.filter((f) => f.featured);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date("2026-02-07");
  };

  const isPast = (dateStr: string) => {
    return new Date(dateStr) < new Date("2026-02-07");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Navigation />
      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-purple-500/5 to-transparent" />
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-cyan-400 transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>

            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
                <Tent className="w-4 h-4" />
                Festival Season 2026
              </div>
              <h1 className="font-orbitron text-4xl md:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Festival Calendar
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Your guide to psytrance festivals worldwide. From intimate gatherings to legendary events,
                find your next dance floor under the stars.
              </p>
              <p className="text-muted-foreground/60 text-sm mt-3">
                Data sourced from goabase.net, psymedia.co.za, psycalendar.com &amp; psytranceportal.com
              </p>
            </div>
          </div>
        </section>

        {/* Featured Festivals */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="font-orbitron text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Flagship Events 2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredFestivals.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative bg-surface/50 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-all hover:bg-surface/80"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-orbitron font-bold text-foreground group-hover:text-amber-400 transition-colors text-sm">
                        {f.name}
                      </h3>
                      <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
                        <span>{getCountryFlag(f.country)}</span>
                        {f.location}, {f.country}
                      </p>
                    </div>
                    {f.website && (
                      <a href={f.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-amber-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-amber-400">
                      <Calendar className="w-3 h-3" />
                      {formatDate(f.startDate)} – {formatDate(f.endDate)}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {f.duration}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="py-6 sticky top-16 z-40 bg-background/90 backdrop-blur-xl border-b border-border/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search festivals, countries, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-surface/50 border-border/50"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </Button>
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredFestivals.length} festivals
              </span>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                {/* Continent filter */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Region</p>
                  <div className="flex flex-wrap gap-2">
                    {continents.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedContinent(c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedContinent === c
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-surface/50 text-muted-foreground border border-border/30 hover:border-border/60"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Month filter */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Month</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedMonth(null)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        !selectedMonth
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-surface/50 text-muted-foreground border border-border/30 hover:border-border/60"
                      }`}
                    >
                      All
                    </button>
                    {months.map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedMonth(m)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          selectedMonth === m
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                            : "bg-surface/50 text-muted-foreground border border-border/30 hover:border-border/60"
                        }`}
                      >
                        {m.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Festival List */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {Object.keys(groupedByMonth).length === 0 ? (
              <div className="text-center py-16">
                <Tent className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No festivals found matching your criteria.</p>
              </div>
            ) : (
              Object.entries(groupedByMonth).map(([month, fests]) => (
                <div key={month} className="mb-10">
                  <h3 className="font-orbitron text-lg font-bold text-foreground mb-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    {month}
                    <span className="text-sm font-normal text-muted-foreground">({fests.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {fests.map((f, i) => {
                      const sizeBadge = getSizeBadge(f.size);
                      return (
                        <motion.div
                          key={`${f.name}-${i}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`group flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl border transition-all hover:bg-surface/60 ${
                            f.featured
                              ? "bg-surface/40 border-amber-500/20 hover:border-amber-500/40"
                              : "bg-surface/20 border-border/20 hover:border-border/40"
                          } ${isPast(f.endDate) ? "opacity-50" : ""}`}
                        >
                          {/* Date */}
                          <div className="flex items-center gap-3 md:w-44 shrink-0">
                            <div className="text-center min-w-[60px]">
                              <p className="text-xs text-muted-foreground">
                                {new Date(f.startDate).toLocaleString("en", { month: "short" })}
                              </p>
                              <p className="font-orbitron font-bold text-lg text-foreground">
                                {new Date(f.startDate).getDate()}
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>{formatDate(f.startDate)} –</p>
                              <p>{formatDate(f.endDate)}</p>
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className={`font-bold text-sm ${f.featured ? "text-amber-400" : "text-foreground"} group-hover:text-cyan-400 transition-colors`}>
                                {f.name}
                              </h4>
                              {f.featured && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                                  FLAGSHIP
                                </span>
                              )}
                              {sizeBadge && (
                                <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sizeBadge.class}`}>
                                  {sizeBadge.label}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {f.location}
                              </span>
                              <span className="flex items-center gap-1">
                                {getCountryFlag(f.country)} {f.country}
                              </span>
                            </p>
                          </div>

                          {/* Duration & Link */}
                          <div className="flex items-center gap-4 md:shrink-0">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {f.duration}
                            </span>
                            {f.website && (
                              <a
                                href={f.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                              >
                                <Globe className="w-3 h-3" />
                                Website
                              </a>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 border-t border-border/20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs text-muted-foreground/60 max-w-2xl mx-auto">
              Festival dates and details are compiled from public sources and may change.
              Always verify with official festival websites before making travel plans.
              Data sourced from goabase.net, psymedia.co.za, psycalendar.com, and psytranceportal.com.
              Last updated: February 7, 2026.
            </p>
            <p className="text-xs text-muted-foreground/40 mt-2">
              Know of a festival we're missing? <Link href="/contact" className="text-cyan-400 hover:underline">Let us know</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
