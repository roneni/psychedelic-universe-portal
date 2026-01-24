import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, ChevronDown, Home, Users, Radio, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { NotificationBell } from "@/components/NotificationBell";

const genres = [
  { id: "progressive-psy", name: "Progressive Psytrance" },
  { id: "psychedelic-trance", name: "Psychedelic Trance" },
  { id: "full-on", name: "Full-On" },
  { id: "goa-trance", name: "Goa Trance" },
];

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [genresDropdownOpen, setGenresDropdownOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/artists", label: "Artists", icon: Users },
    { href: "/radio", label: "Radio", icon: Radio },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with icon */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/images/nav-logo.png" 
              alt="Psychedelic Universe" 
              className="h-6 w-6"
            />
            <span className="font-orbitron font-bold text-lg text-cyan-400">
              PSY UNIVERSE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  isActive(link.href)
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}

            {/* Genres Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setGenresDropdownOpen(true)}
              onMouseLeave={() => setGenresDropdownOpen(false)}
            >
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                  location.startsWith("/genre")
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                }`}
              >
                <Music2 className="w-4 h-4" />
                Genres
                <ChevronDown className={`w-4 h-4 transition-transform ${genresDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {genresDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-surface/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl overflow-hidden"
                  >
                    {genres.map((genre) => (
                      <Link 
                        key={genre.id} 
                        href={`/genre/${genre.id}`}
                        className={`block px-4 py-3 transition-colors ${
                          location === `/genre/${genre.id}`
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "text-muted-foreground hover:text-foreground hover:bg-cyan-500/10"
                        }`}
                        onClick={() => setGenresDropdownOpen(false)}
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Notification Bell */}
          <div className="hidden md:flex items-center">
            <NotificationBell />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <NotificationBell />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-border/30 overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-3 ${
                    isActive(link.href)
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}

              {/* Mobile Genres */}
              <div className="pt-2 border-t border-border/30">
                <p className="px-4 py-2 text-sm text-muted-foreground font-medium">Genres</p>
                {genres.map((genre) => (
                  <Link 
                    key={genre.id} 
                    href={`/genre/${genre.id}`}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      location === `/genre/${genre.id}`
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
