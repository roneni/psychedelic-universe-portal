import { useState, useMemo, useEffect, useRef } from "react";
import { Link } from "wouter";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { motion, useInView } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
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
  Plus,
  Star,
} from "lucide-react";

// ── Festival data (unchanged from production) ──────────────────────────────

interface Festival {
  name: string;
  location: string;
  country: string;
  continent: string;
  startDate: string;
  endDate: string;
  duration: string;
  size?: "small" | "medium" | "large" | "major";
  website?: string;
  featured?: boolean;
  genre?: string;
  imageUrl?: string;
  description?: string;
  isSubmission?: boolean;
}

function computeDuration(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const days = Math.max(1, Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
  return days === 1 ? "1 day" : `${days} days`;
}

const festivals: Festival[] = [
  // February 2026
  { name: "HillTop Festival 2026", location: "Vagator, Goa", country: "India", continent: "Asia", startDate: "2026-02-05", endDate: "2026-02-08", duration: "3 days", size: "large", website: "https://hilltopgoa.com", imageUrl: "/images/festivals/hilltop-festival.jpg", genre: "Psychedelic Trance" },
  { name: "The Alternative Festival 2026", location: "Koh Ta Kiev", country: "Cambodia", continent: "Asia", startDate: "2026-02-19", endDate: "2026-02-24", duration: "5 days", size: "medium", website: "https://www.instagram.com/alternative_festival/", genre: "Multi-genre" },
  { name: "Envision Festival", location: "Uvita", country: "Costa Rica", continent: "Central America", startDate: "2026-02-23", endDate: "2026-03-02", duration: "7 days", size: "large", website: "https://envisionfestival.com", imageUrl: "/images/festivals/envision-festival.avif", genre: "Multi-genre" },
  { name: "YATRA Festival '26 × MO:DEM", location: "Takaka, Golden Bay", country: "New Zealand", continent: "Oceania", startDate: "2026-02-27", endDate: "2026-03-02", duration: "3 days", size: "medium", website: "https://psymedia.co.za/festival/yatra-festival/", imageUrl: "/images/festivals/yatra-festival.avif", genre: "Psychedelic Trance" },
  { name: "Tribal Gathering", location: "Hippie Beach", country: "Panama", continent: "Central America", startDate: "2026-02-27", endDate: "2026-03-16", duration: "17 days", size: "large", website: "https://tribalgathering.com", imageUrl: "/images/festivals/tribal-gathering.jpg", genre: "Multi-genre" },
  { name: "Chilca Ovni Festival", location: "Lima", country: "Peru", continent: "South America", startDate: "2026-02-27", endDate: "2026-03-01", duration: "2 days", size: "medium", website: "https://www.goabase.net/festival/chilca-ovni-festival-2026/115349", imageUrl: "/images/festivals/chilca-ovni-festival.webp", genre: "Psychedelic Trance" },
  { name: "PuriMoksha 2026", location: "Israel", country: "Israel", continent: "Middle East", startDate: "2026-02-27", endDate: "2026-02-27", duration: "1 day", size: "large", website: "https://psymedia.co.za/festival/purimoksha/", imageUrl: "/images/festivals/purimoksha.jpg", genre: "Multi-genre" },
  // March 2026
  { name: "Fractal Festival 2026", location: "Usakos", country: "Namibia", continent: "Africa", startDate: "2026-03-12", endDate: "2026-03-15", duration: "3 days", size: "medium", website: "https://centropy4u.com/fractalfestival", genre: "Psychedelic Trance" },
  { name: "Miracle Festival", location: "Taiwan", country: "Taiwan", continent: "Asia", startDate: "2026-03-13", endDate: "2026-03-15", duration: "2 days", size: "medium", website: "https://www.facebook.com/moonfairy.project/", genre: "Psychedelic Trance" },
  { name: "Nahual Can Music + Arts Gathering", location: "Palenque", country: "Mexico", continent: "Central America", startDate: "2026-03-27", endDate: "2026-03-29", duration: "2 days", size: "medium", website: "https://www.goabase.net/festival/nahual-can-music-arts-gathering-2026/116739", imageUrl: "/images/festivals/nahual-can.webp", genre: "Multi-genre" },
  // April 2026
  { name: "Psycristance", location: "Chiapas", country: "Mexico", continent: "Central America", startDate: "2026-04-02", endDate: "2026-04-05", duration: "3 days", size: "medium", website: "https://www.facebook.com/PsyCrisTrancers/", genre: "Psychedelic Trance" },
  { name: "High Mountain Gathering VII", location: "Pokhara", country: "Nepal", continent: "Asia", startDate: "2026-04-13", endDate: "2026-04-15", duration: "2 days", size: "small", website: "https://www.goabase.net/festival/high-mountain-gathering-vii-2026/116341", imageUrl: "/images/festivals/high-mountain-gathering.webp", genre: "Psychedelic Trance" },
  { name: "AfrikaBurn", location: "Western South Africa", country: "South Africa", continent: "Africa", startDate: "2026-04-27", endDate: "2026-05-03", duration: "6 days", size: "large", website: "https://afrikaburn.com", imageUrl: "/images/festivals/afrikaburn.png", genre: "Multi-genre" },
  { name: "Sati Festival", location: "Pokhara", country: "Nepal", continent: "Asia", startDate: "2026-04-30", endDate: "2026-05-03", duration: "3 days", size: "medium", website: "https://www.goabase.net/festival/sati-festival/115927", imageUrl: "/images/festivals/sati-festival.webp", genre: "Psychedelic Trance" },
  { name: "Hai in den Mai Festival", location: "Stemwede", country: "Germany", continent: "Europe", startDate: "2026-04-30", endDate: "2026-05-03", duration: "3 days", size: "large", website: "https://waldfrieden.de", imageUrl: "/images/festivals/hai-in-den-mai.jpg", genre: "Psychedelic Trance" },
  // May 2026
  { name: "Arkana Festival 2026", location: "Sacred Valley, Cusco", country: "Peru", continent: "South America", startDate: "2026-05-01", endDate: "2026-05-03", duration: "3 days", size: "medium", website: "https://www.arkanafestival.net/", imageUrl: "/images/festivals/arkana-festival.jpg", genre: "Psytrance, Dark Progressive, Techno", featured: true, description: "Since 2012, Arkana Festival has returned to the Sacred Valley like the opening of a portal between ancestral mountains. Here, time slows down and music stitches together past and future." },
  { name: "Burning Nest", location: "nr Exeter, Devon", country: "United Kingdom", continent: "Europe", startDate: "2026-05-18", endDate: "2026-05-25", duration: "7 days", size: "medium", website: "https://burningnest.co.uk/", imageUrl: "/images/festivals/burning-nest.jpg", genre: "Multi-genre" },
  { name: "Ikarus Festival", location: "Southern Germany", country: "Germany", continent: "Europe", startDate: "2026-05-22", endDate: "2026-05-25", duration: "3 days", size: "large", website: "https://www.ikarus-festival.de/", imageUrl: "/images/festivals/ikarus-festival.svg", genre: "Psychedelic Trance" },
  { name: "Quantum Awakening Festival 3.0", location: "Hammonton, New Jersey", country: "USA", continent: "North America", startDate: "2026-05-22", endDate: "2026-05-25", duration: "3 days", size: "medium", website: "https://quantumawakeningfestival.com/", imageUrl: "/images/festivals/quantum-awakening.png", genre: "Psychedelic Trance" },
  { name: "Psychedelic Experience Open Air", location: "Gallin-Kuppentin", country: "Germany", continent: "Europe", startDate: "2026-05-29", endDate: "2026-06-01", duration: "3 days", size: "large", website: "https://www.psyexperience-festival.com/", imageUrl: "/images/festivals/psychedelic-experience.png", genre: "Psychedelic Trance" },
  { name: "Aura Festival", location: "Barcelona", country: "Spain", continent: "Europe", startDate: "2026-05-29", endDate: "2026-05-31", duration: "2 days", size: "medium", website: "https://www.instagram.com/aura_open_air_festival/", genre: "Psychedelic Trance" },
  { name: "Refractor 2026", location: "Valdeverdeja", country: "Spain", continent: "Europe", startDate: "2026-05-29", endDate: "2026-05-31", duration: "2 days", size: "medium", website: "https://www.instagram.com/refractor.festival/", genre: "Psychedelic Trance" },
  // June 2026
  { name: "Pulsar Festival 2026", location: "Cachoeira Alta", country: "Brazil", continent: "South America", startDate: "2026-06-03", endDate: "2026-06-08", duration: "5 days", size: "large", website: "https://pulsarfestival.art.br/", genre: "Psychedelic Trance" },
  { name: "Okami Festival", location: "Haute-Garonne", country: "France", continent: "Europe", startDate: "2026-06-03", endDate: "2026-06-07", duration: "4 days", size: "medium", website: "https://www.okamifestival.com/en", imageUrl: "/images/festivals/okami-festival.jpg", genre: "Psychedelic Trance" },
  { name: "Zauberlippen Festival", location: "Schramberg", country: "Germany", continent: "Europe", startDate: "2026-06-04", endDate: "2026-06-08", duration: "4 days", size: "medium", website: "https://www.lippen.events/", genre: "Psychedelic Trance" },
  { name: "Amazon Festival 2026", location: "Rurrenabaque", country: "Bolivia", continent: "South America", startDate: "2026-06-05", endDate: "2026-06-07", duration: "2 days", size: "small", website: "https://www.facebook.com/amazonfestival/", genre: "Psychedelic Trance" },
  { name: "KUMBHALA Festival", location: "Madrid", country: "Spain", continent: "Europe", startDate: "2026-06-05", endDate: "2026-06-07", duration: "2 days", size: "large", website: "https://www.kumbhalafestival.org/", imageUrl: "/images/festivals/kumbhala-festival.png", genre: "Psychedelic Trance" },
  { name: "Spirit Base Festival", location: "Vyrovice", country: "Czechia", continent: "Europe", startDate: "2026-06-11", endDate: "2026-06-14", duration: "3 days", size: "large", website: "https://www.facebook.com/SpiritBaseFestival/", genre: "Psychedelic Trance" },
  { name: "Existance Festival", location: "Charlton Park, Wiltshire", country: "United Kingdom", continent: "Europe", startDate: "2026-06-11", endDate: "2026-06-14", duration: "3 days", size: "medium", website: "https://existancefestival.com/", imageUrl: "/images/festivals/existance-festival.jpg", genre: "Psychedelic Trance" },
  { name: "Outdoor Selection Festival", location: "Effingen", country: "Switzerland", continent: "Europe", startDate: "2026-06-12", endDate: "2026-06-14", duration: "2 days", size: "medium", website: "https://outdoorselection.ch/", imageUrl: "/images/festivals/outdoor-selection.png", genre: "Psychedelic Trance" },
  { name: "Waking Life Festival", location: "Crato", country: "Portugal", continent: "Europe", startDate: "2026-06-16", endDate: "2026-06-22", duration: "6 days", size: "large", website: "https://www.wakinglife.pt", imageUrl: "/images/festivals/waking-life.jpg", genre: "Multi-genre" },
  { name: "Forest Star Festival", location: "Västra Götaland", country: "Sweden", continent: "Europe", startDate: "2026-06-18", endDate: "2026-06-22", duration: "4 days", size: "medium", website: "https://www.foreststar.se/", genre: "Psychedelic Trance" },
  { name: "Fantàsia Festival", location: "Tuscany", country: "Italy", continent: "Europe", startDate: "2026-06-18", endDate: "2026-06-22", duration: "4 days", size: "medium", website: "https://www.fantasiafestival.org/en", imageUrl: "/images/festivals/fantasia-festival.svg", genre: "Psychedelic Trance" },
  { name: "Solomonari Festival", location: "nr Sibiu", country: "Romania", continent: "Europe", startDate: "2026-06-18", endDate: "2026-06-21", duration: "3 days", size: "medium", website: "https://psymedia.co.za/festival/solomonari-festival/", imageUrl: "/images/festivals/solomonari-festival.jpg", genre: "Psychedelic Trance" },
  { name: "Solar Light Festival", location: "Ancona", country: "Italy", continent: "Europe", startDate: "2026-06-19", endDate: "2026-06-21", duration: "2 days", size: "medium", website: "https://www.facebook.com/SolarLightParty/", genre: "Psychedelic Trance" },
  { name: "ForRest Explosion Festival", location: "Parchim", country: "Germany", continent: "Europe", startDate: "2026-06-19", endDate: "2026-06-21", duration: "2 days", size: "medium", website: "https://www.forrest-explosion.de/", imageUrl: "/images/festivals/forrest-explosion.jpg", genre: "Psychedelic Trance" },
  { name: "UFO BUFO Festival", location: "Hadinka", country: "Czechia", continent: "Europe", startDate: "2026-06-24", endDate: "2026-06-28", duration: "4 days", size: "large", website: "https://ufobufo.eu/", imageUrl: "/images/festivals/ufo-bufo.svg", genre: "Psychedelic Trance" },
  { name: "Burning Mountain Festival", location: "Zernez", country: "Switzerland", continent: "Europe", startDate: "2026-06-25", endDate: "2026-06-28", duration: "3 days", size: "medium", website: "https://www.burning-mountain.ch", genre: "Psychedelic Trance" },
  { name: "Back To Nature Festival", location: "Datça/Muğla", country: "Turkey", continent: "Europe", startDate: "2026-06-25", endDate: "2026-06-29", duration: "4 days", size: "medium", website: "https://mindmanifest.pro/events/back-to-nature-festival-2026/", imageUrl: "/images/festivals/back-to-nature.webp", genre: "Psychedelic Trance" },
  { name: "Colibri Spirit Festival", location: "Corfu", country: "Greece", continent: "Europe", startDate: "2026-06-28", endDate: "2026-07-03", duration: "5 days", size: "medium", website: "https://www.colibrispiritfestival.com/", genre: "Psychedelic Trance" },
  // July 2026
  { name: "Being Gathering", location: "BoomLand", country: "Portugal", continent: "Europe", startDate: "2026-07-01", endDate: "2026-07-05", duration: "4 days", size: "large", website: "https://www.being-gathering.org/", imageUrl: "/images/festivals/being-gathering.png", genre: "Multi-genre" },
  { name: "Ethereal Decibel Festival", location: "Saint Symphorien des Monts", country: "France", continent: "Europe", startDate: "2026-07-02", endDate: "2026-07-05", duration: "3 days", size: "medium", website: "https://etherealdecibel.com/", imageUrl: "/images/festivals/ethereal-decibel.png", genre: "Psychedelic Trance" },
  { name: "Surya Spirits Festival", location: "Gent", country: "Belgium", continent: "Europe", startDate: "2026-07-03", endDate: "2026-07-06", duration: "3 days", size: "medium", website: "https://surya-spirits.be/", genre: "Psychedelic Trance" },
  { name: "Masters of Puppets", location: "Vysočina Region", country: "Czechia", continent: "Europe", startDate: "2026-07-06", endDate: "2026-07-13", duration: "7 days", size: "large", website: "https://mastersofpuppets.cz", imageUrl: "/images/festivals/masters-of-puppets.jpg", genre: "Psychedelic Trance", featured: true },
  { name: "Manas Festival", location: "Somogy County", country: "Hungary", continent: "Europe", startDate: "2026-07-08", endDate: "2026-07-13", duration: "5 days", size: "medium", website: "https://manasfestival.eu/en/", imageUrl: "/images/festivals/manas-festival.png", genre: "Psychedelic Trance" },
  { name: "Origin UK", location: "Cambridgeshire", country: "United Kingdom", continent: "Europe", startDate: "2026-07-10", endDate: "2026-07-12", duration: "2 days", size: "large", website: "https://originfestival.co.uk/", imageUrl: "/images/festivals/origin-uk.svg", genre: "Psychedelic Trance" },
  { name: "Antaris Project 2026", location: "Gollenberg", country: "Germany", continent: "Europe", startDate: "2026-07-12", endDate: "2026-07-15", duration: "3 days", size: "large", website: "https://antaris-project.de", imageUrl: "/images/festivals/antaris-project.png", genre: "Psychedelic Trance", featured: true },
  { name: "S.U.N. Festival", location: "Csobánkapuszta", country: "Hungary", continent: "Europe", startDate: "2026-07-13", endDate: "2026-07-19", duration: "6 days", size: "large", website: "https://psymedia.co.za/festival/sun-festival/", imageUrl: "/images/festivals/sun-festival.png", genre: "Psychedelic Trance", featured: true },
  { name: "7 Chakras Festival", location: "Lazio Region", country: "Italy", continent: "Europe", startDate: "2026-07-14", endDate: "2026-07-20", duration: "6 days", size: "medium", website: "https://www.7chakrasfestival.org/", imageUrl: "/images/festivals/7-chakras-festival.jpg", genre: "Psychedelic Trance" },
  { name: "ZNA Gathering", location: "Montargil Lake", country: "Portugal", continent: "Europe", startDate: "2026-07-15", endDate: "2026-07-22", duration: "7 days", size: "large", website: "https://znagathering.com/", imageUrl: "/images/festivals/zna-gathering.jpg", genre: "Psychedelic Trance", featured: true },
  { name: "Noisily Festival", location: "Coney Woods, Leicestershire", country: "United Kingdom", continent: "Europe", startDate: "2026-07-16", endDate: "2026-07-19", duration: "3 days", size: "large", website: "https://noisilyfestival.com", imageUrl: "/images/festivals/noisily-festival.jpg", genre: "Multi-genre", featured: true },
  { name: "O.Z.O.R.A. Festival 2026", location: "Dádpuszta", country: "Hungary", continent: "Europe", startDate: "2026-07-24", endDate: "2026-08-04", duration: "11 days", size: "major", website: "https://ozorafestival.eu", imageUrl: "/images/festivals/ozora-festival.jpg", genre: "Psychedelic Trance", featured: true },
  // August 2026
  { name: "MO:DEM Festival 2026", location: "Primislje", country: "Croatia", continent: "Europe", startDate: "2026-08-03", endDate: "2026-08-09", duration: "6 days", size: "major", website: "https://modemfestival.com", imageUrl: "/images/festivals/modem-festival.png", genre: "Psychedelic Trance", featured: true },
  { name: "Hadra Trance Festival 2026", location: "Vieure", country: "France", continent: "Europe", startDate: "2026-08-26", endDate: "2026-09-03", duration: "8 days", size: "major", website: "https://hadratrancefestival.net", imageUrl: "/images/festivals/hadra-festival.jpg", genre: "Psychedelic Trance", featured: true },
  { name: "Indian Spirit Festival 2026", location: "Eldena", country: "Germany", continent: "Europe", startDate: "2026-08-26", endDate: "2026-08-31", duration: "5 days", size: "major", website: "https://indian-spirit.de", imageUrl: "/images/festivals/indian-spirit.png", genre: "Psychedelic Trance", featured: true },
  // December 2026
  { name: "Universo Paralello", location: "Pratigi, Bahia", country: "Brazil", continent: "South America", startDate: "2026-12-27", endDate: "2027-01-03", duration: "7 days", size: "major", website: "https://universoparalello.org", imageUrl: "/images/festivals/universo-paralello.jpg", genre: "Psychedelic Trance", featured: true },
];

// ── Helpers (unchanged) ────────────────────────────────────────────────────

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

const allMonths = [
  "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const continents = ["All", "Europe", "Asia", "South America", "Central America", "North America", "Africa", "Oceania", "Middle East", "Community"];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const isPast = (dateStr: string) => new Date(dateStr) < new Date("2026-02-07");

const getGoogleCalendarUrl = (f: Festival) => {
  const fmt = (d: string) => d.replace(/-/g, "");
  const start = fmt(f.startDate);
  // endDate for Google Calendar needs to be the day AFTER (all-day event exclusive end)
  const end = new Date(f.endDate);
  end.setDate(end.getDate() + 1);
  const endStr = end.toISOString().slice(0, 10).replace(/-/g, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: f.name,
    dates: `${start}/${endStr}`,
    details: `${f.name} — ${f.duration} ${f.genre || "psytrance"} festival.${f.website ? `\n\n${f.website}` : ""}`,
    location: `${f.location}, ${f.country}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// ── Zone background wrapper ────────────────────────────────────────────────

function BackgroundZone({
  imageSrc,
  children,
  minHeight = "100vh",
  overlayOpacity = 0.55,
}: {
  imageSrc: string;
  children: React.ReactNode;
  minHeight?: string;
  overlayOpacity?: number;
}) {
  return (
    <div className="relative w-full" style={{ minHeight }}>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{ background: `rgba(10,10,20,${overlayOpacity})` }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 25%, rgba(10,10,20,0.55) 60%, rgba(10,10,20,0.92) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: "180px", background: "linear-gradient(to bottom, rgba(10,10,20,1), transparent)" }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: "180px", background: "linear-gradient(to top, rgba(10,10,20,1), transparent)" }}
        aria-hidden="true"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// ── Mars counter hook ──────────────────────────────────────────────────────

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    let frame: number;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);
  return count;
}

// ── Month group renderer ───────────────────────────────────────────────────

function MonthGroup({
  month,
  fests,
}: {
  month: string;
  fests: Festival[];
}) {
  return (
    <div className="mb-10">
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
              <div className="flex items-center gap-3 md:w-44 shrink-0">
                {f.imageUrl ? (
                  <img
                    src={f.imageUrl}
                    alt={`${f.name} ${new Date(f.startDate).getFullYear()} ${f.genre || "psytrance"} festival ${f.location} ${f.country}`}
                    title={`${f.name} — ${f.duration} in ${f.location}, ${f.country}`}
                    className="w-[60px] h-[60px] rounded-lg object-cover shrink-0"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-muted-foreground">
                      {new Date(f.startDate).toLocaleString("en", { month: "short" })}
                    </p>
                    <p className="font-orbitron font-bold text-lg text-foreground">
                      {new Date(f.startDate).getDate()}
                    </p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  <p>{formatDate(f.startDate)} –</p>
                  <p>{formatDate(f.endDate)}</p>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={`font-bold text-sm ${f.featured ? "text-amber-400" : "text-foreground"} group-hover:text-cyan-400 transition-colors`}>
                    {f.name}
                  </h4>
                  {f.featured && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      MAJOR
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
                <a
                  href={getGoogleCalendarUrl(f)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                  title={`Add ${f.name} to Google Calendar`}
                >
                  <CalendarPlus className="w-3 h-3" />
                  <span className="hidden sm:inline">Add to Cal</span>
                </a>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── Zone month groups renderer ─────────────────────────────────────────────

function ZoneMonths({
  groupedByMonth,
  monthRange,
}: {
  groupedByMonth: Record<string, Festival[]>;
  monthRange: [number, number];
}) {
  const entries = Object.entries(groupedByMonth).filter(([month]) => {
    const m = new Date(Date.parse(month + " 1")).getMonth() + 1;
    return m >= monthRange[0] && m <= monthRange[1];
  });

  if (entries.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {entries.map(([month, fests]) => (
        <MonthGroup key={month} month={month} fests={fests} />
      ))}
    </div>
  );
}

// ── Schema.org structured data for Google AI Overview ─────────────────────

function useFestivalStructuredData(festivalList: Festival[]) {
  useEffect(() => {
    const events = festivalList.map((f) => ({
      "@type": "Event",
      name: f.name,
      startDate: f.startDate,
      endDate: f.endDate,
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "Place",
        name: `${f.location}, ${f.country}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: f.location,
          addressCountry: f.country,
        },
      },
      description: `${f.name} — a ${f.duration} ${f.genre || "psytrance"} festival in ${f.location}, ${f.country}.`,
      organizer: {
        "@type": "Organization",
        name: f.name,
        ...(f.website ? { url: f.website } : {}),
      },
      ...(f.website ? { url: f.website } : {}),
    }));

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Psytrance Festival Calendar 2026",
      description:
        "Complete guide to 64+ psytrance and psychedelic trance festivals worldwide for 2026.",
      numberOfItems: events.length,
      itemListElement: events.map((event, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: event,
      })),
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    script.id = "festivals-structured-data";
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById("festivals-structured-data");
      if (existing) existing.remove();
    };
  }, [festivalList]);
}

// ── Main component ─────────────────────────────────────────────────────────

export default function Festivals() {
  usePageMeta({
    title: "Psytrance Festival Calendar 2026",
    description: "Browse 64+ psytrance festivals worldwide for 2026. O.Z.O.R.A., MO:DEM, Universo Paralello, S.U.N. Festival, and more. Filter by region, month, and country.",
    canonicalPath: "/festivals",
  });

  useFestivalStructuredData(festivals);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContinent, setSelectedContinent] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch approved submissions from the database
  const approvedQuery = trpc.festivalSubmissions.approved.useQuery();

  // Merge hardcoded festivals with approved DB submissions
  const allFestivals = useMemo(() => {
    const merged: Festival[] = [...festivals];
    if (approvedQuery.data) {
      for (const sub of approvedQuery.data) {
        merged.push({
          name: sub.festivalName,
          location: sub.locationName,
          country: sub.locationCountry,
          continent: "Community", // community submissions don't have continent
          startDate: sub.startDate,
          endDate: sub.endDate,
          duration: computeDuration(sub.startDate, sub.endDate),
          website: sub.websiteUrl || undefined,
          featured: sub.status === "featured",
          genre: sub.genres,
          size: undefined,
          isSubmission: true,
        });
      }
    }
    return merged;
  }, [approvedQuery.data]);

  const filteredFestivals = useMemo(() => {
    return allFestivals
      .filter((f) => {
        const matchesSearch =
          f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
          f.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesContinent = selectedContinent === "All" || f.continent === selectedContinent || (selectedContinent === "Community" && f.isSubmission);
        const matchesMonth = !selectedMonth || new Date(f.startDate).toLocaleString("en", { month: "long" }) === selectedMonth;
        return matchesSearch && matchesContinent && matchesMonth;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [searchQuery, selectedContinent, selectedMonth, allFestivals]);

  const groupedByMonth = useMemo(() => {
    const groups: Record<string, Festival[]> = {};
    filteredFestivals.forEach((f) => {
      const month = new Date(f.startDate).toLocaleString("en", { month: "long", year: "numeric" });
      if (!groups[month]) groups[month] = [];
      groups[month].push(f);
    });
    return groups;
  }, [filteredFestivals]);

  // Featured: both hardcoded and DB featured
  const featuredFestivals = allFestivals.filter((f) => f.featured);
  const hasResults = filteredFestivals.length > 0;

  // Mars counter
  const marsRef = useRef(null);
  const marsInView = useInView(marsRef, { once: true, margin: "0px" });
  const starCount = useCountUp(400_000_000_000, 3000, marsInView);

  return (
    <div className="min-h-screen flex flex-col text-foreground overflow-x-hidden selection:bg-primary selection:text-primary-foreground" style={{ backgroundColor: "#0a0a14" }}>
      <Navigation />

      <main className="flex-1 pt-16">
        {/* ═══ ZONE 1: Hero + Featured Events ═══ */}
        <BackgroundZone imageSrc="/images/hero-festival.png" overlayOpacity={0.5}>
          {/* Hero */}
          <section className="relative py-20">
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
                <p className="text-gray-200 text-lg max-w-2xl mx-auto">
                  Your guide to psytrance festivals worldwide. From intimate gatherings to legendary events,
                  find your next dance floor under the stars.
                </p>
                <p className="text-gray-300 text-sm mt-3">
                  Data sourced from goabase.net, psymedia.co.za, psycalendar.com &amp; psytranceportal.com
                </p>

                {/* Search Bar */}
                <div className="mt-8 max-w-xl mx-auto rounded-2xl px-5 py-4" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1 w-full">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <Input
                        placeholder="Search festivals, countries, locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 shrink-0 border-white/20 text-gray-200 hover:text-white hover:bg-white/10"
                    >
                      <Filter className="w-4 h-4" />
                      Filters
                      {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 max-w-xl mx-auto rounded-2xl px-5 py-4 space-y-4"
                    style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div>
                      <p className="text-xs text-gray-300 mb-2 font-medium">Region</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {continents.map((c) => (
                          <button
                            key={c}
                            onClick={() => setSelectedContinent(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedContinent === c
                                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                                : "bg-white/10 text-gray-300 border border-white/15 hover:border-white/25"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-2 font-medium">Month</p>
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => setSelectedMonth(null)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            !selectedMonth
                              ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                              : "bg-white/10 text-gray-300 border border-white/15 hover:border-white/25"
                          }`}
                        >
                          All
                        </button>
                        {allMonths.map((m) => (
                          <button
                            key={m}
                            onClick={() => setSelectedMonth(m)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                              selectedMonth === m
                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                : "bg-white/10 text-gray-300 border border-white/15 hover:border-white/25"
                            }`}
                          >
                            {m.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <p className="text-sm text-gray-300 mt-4">{filteredFestivals.length} festivals</p>
              </div>
            </div>
          </section>

          {/* Featured Festivals */}
          <section className="py-8">
            <div className="container mx-auto px-4">
              <h2 className="font-orbitron text-xl font-bold text-cyan-400 mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Major Events 2026
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredFestivals.map((f, i) => (
                  <motion.div
                    key={f.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-all"
                    style={{
                      background: "rgba(10,10,30,0.6)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {f.imageUrl && (
                        <img
                          src={f.imageUrl}
                          alt={`${f.name} ${new Date(f.startDate).getFullYear()} ${f.genre || "psytrance"} festival ${f.location} ${f.country}`}
                          title={`${f.name} — ${f.duration} in ${f.location}, ${f.country}`}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                          loading="lazy"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h3 className="font-orbitron font-bold text-white group-hover:text-amber-400 transition-colors text-sm">
                            {f.name}
                          </h3>
                          {f.website && (
                            <a href={f.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400 transition-colors shrink-0 ml-2">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                          <span>{getCountryFlag(f.country)}</span>
                          {f.location}, {f.country}
                        </p>
                      </div>
                    </div>
                    {f.description && (
                      <p className="text-gray-400 text-xs mb-3 line-clamp-2 italic">{f.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-amber-400">
                        <Calendar className="w-3 h-3" />
                        {formatDate(f.startDate)} – {formatDate(f.endDate)}
                      </span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <Clock className="w-3 h-3" />
                        {f.duration}
                      </span>
                      <a
                        href={getGoogleCalendarUrl(f)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1 ml-auto"
                        title={`Add ${f.name} to Google Calendar`}
                      >
                        <CalendarPlus className="w-3 h-3" />
                        Add to Cal
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </BackgroundZone>

        {/* ═══ ZONE 2: Mars / Stars counter ═══ */}
        <div ref={marsRef} className="relative w-full overflow-hidden" style={{ minHeight: "70vh" }}>
          <div
            className="absolute inset-0 mars-bg-drift overflow-hidden"
            style={{
              backgroundImage: "url(/images/mars-stars.png)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0" style={{ background: "rgba(10,10,20,0.35)" }} aria-hidden="true" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(10,10,20,0.5) 60%, rgba(10,10,20,0.9) 100%)" }}
            aria-hidden="true"
          />
          <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ height: "180px", background: "linear-gradient(to bottom, #0a0a14, transparent)" }} aria-hidden="true" />
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "180px", background: "linear-gradient(to top, #0a0a14, transparent)" }} aria-hidden="true" />

          <div className="relative z-10 flex flex-col items-center justify-center" style={{ minHeight: "70vh" }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={marsInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-orbitron text-[11px] tracking-[0.35em] uppercase mb-6"
              style={{ color: "rgba(34,211,238,0.7)" }}
            >
              Milky Way Galaxy
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={marsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="font-orbitron font-black block leading-none"
                style={{
                  fontSize: "clamp(32px, 6vw, 80px)",
                  color: "#22d3ee",
                  textShadow: "0 0 20px rgba(34,211,238,0.6), 0 0 40px rgba(34,211,238,0.3), 0 0 80px rgba(34,211,238,0.15)",
                  letterSpacing: "0.05em",
                  fontVariantNumeric: "tabular-nums",
                }}
                aria-label="400 billion"
              >
                {starCount.toLocaleString("en-US")}
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={marsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-gray-400 mt-4"
              style={{ fontSize: "clamp(16px, 2vw, 24px)", letterSpacing: "0.08em" }}
            >
              stars in our galaxy alone
            </motion.p>
          </div>
        </div>

        {/* Submit Your Festival CTA */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="https://www.youtube.com/@PsychedelicUniverse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 hover:border-cyan-500/70 transition-all group shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.5)]"
            >
              <Globe className="w-4 h-4 text-cyan-400" />
              <span className="font-orbitron text-xs tracking-widest text-cyan-300 group-hover:text-cyan-200 transition-colors uppercase">
                Psychedelic Universe
              </span>
            </a>
            <Link href="/festivals/submit">
              <button className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-500/70 transition-all group shadow-[0_0_20px_-5px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.5)]">
                <Plus className="w-4 h-4 text-purple-400" />
                <span className="font-orbitron text-xs tracking-widest text-purple-300 group-hover:text-purple-200 transition-colors uppercase">
                  Submit Your <span className="text-purple-400 font-bold">Festival</span>
                </span>
              </button>
            </Link>
          </div>
        </div>

        {/* ═══ Festival Timeline Zones ═══ */}
        {!hasResults ? (
          <div className="text-center py-32">
            <Tent className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No festivals found matching your criteria.</p>
          </div>
        ) : (
          <>
            {/* Zone 3: Feb + Mar (beach-festival.png) */}
            <BackgroundZone imageSrc="/images/beach-festival.png">
              <ZoneMonths groupedByMonth={groupedByMonth} monthRange={[2, 3]} />
            </BackgroundZone>

            {/* Zone 4: Apr + May (deep-night.png) */}
            <BackgroundZone imageSrc="/images/deep-night.png">
              <ZoneMonths groupedByMonth={groupedByMonth} monthRange={[4, 5]} />
            </BackgroundZone>

            {/* Zone 5: June (crowd-sunrise.png) */}
            <BackgroundZone imageSrc="/images/crowd-sunrise.png">
              <ZoneMonths groupedByMonth={groupedByMonth} monthRange={[6, 6]} />
            </BackgroundZone>

            {/* Zone 6: July (morning-festival.png) */}
            <BackgroundZone imageSrc="/images/morning-festival.png">
              <ZoneMonths groupedByMonth={groupedByMonth} monthRange={[7, 7]} />
            </BackgroundZone>

            {/* Zone 7: Aug + Dec (noon-festival.png) */}
            <BackgroundZone imageSrc="/images/noon-festival.png" minHeight="60vh">
              <ZoneMonths groupedByMonth={groupedByMonth} monthRange={[8, 12]} />
              {/* Disclaimer */}
              <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-xs text-gray-500/60 max-w-2xl mx-auto">
                  Festival dates and details are compiled from public sources and may change.
                  Always verify with official festival websites before making travel plans.
                  Data sourced from goabase.net, psymedia.co.za, psycalendar.com, and psytranceportal.com.
                  Last updated: February 7, 2026.
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Know of a festival we're missing? <Link href="/festivals/submit" className="text-cyan-400 hover:underline">Submit it here</Link>
                </p>
              </div>
            </BackgroundZone>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
