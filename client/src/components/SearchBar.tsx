import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, Play, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchResult {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface SearchBarProps {
  onSelectVideo?: (video: SearchResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  onSelectVideo, 
  placeholder = "Search artists, tracks, mixes...",
  className = ""
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);
  
  const { data: results, isLoading, error } = trpc.youtube.search.useQuery(
    { query: debouncedQuery, maxResults: 8 },
    { 
      enabled: debouncedQuery.length >= 2,
      staleTime: 60000, // Cache results for 1 minute
    }
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open dropdown when results are available
  useEffect(() => {
    if (results && results.length > 0 && query.length >= 2) {
      setIsOpen(true);
    }
  }, [results, query]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelectVideo(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelectVideo = (video: SearchResult) => {
    if (onSelectVideo) {
      onSelectVideo(video);
    } else {
      // Default behavior: open video in new tab
      window.open(`https://www.youtube.com/watch?v=${video.id}`, "_blank");
    }
    setQuery("");
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  // Extract artist name from title (usually before the dash)
  const extractArtist = (title: string) => {
    const parts = title.split(" - ");
    if (parts.length > 1) {
      return parts[0].trim();
    }
    return null;
  };

  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 bg-slate-900/80 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-slate-500 hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && query.length >= 2 && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Searching...
            </div>
          )}

          {error && (
            <div className="py-4 px-4 text-red-400 text-sm">
              {error.message.includes("API key") 
                ? "Search not configured. Admin needs to add YouTube API key in Settings."
                : "Search failed. Please try again."}
            </div>
          )}

          {!isLoading && !error && results && results.length === 0 && (
            <div className="py-6 px-4 text-slate-500 text-center">
              No results found for "{query}"
            </div>
          )}

          {!isLoading && !error && results && results.length > 0 && (
            <ul className="max-h-96 overflow-y-auto">
              {results.map((video, index) => {
                const artist = extractArtist(video.title);
                return (
                  <li key={video.id}>
                    <button
                      onClick={() => handleSelectVideo(video)}
                      className={`w-full flex items-center gap-3 p-3 text-left transition-colors ${
                        index === selectedIndex 
                          ? "bg-cyan-500/20" 
                          : "hover:bg-slate-800"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative flex-shrink-0 w-24 h-14 rounded overflow-hidden bg-slate-800">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                          <Play className="w-6 h-6 text-white" fill="white" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-100 font-medium truncate">
                          {video.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {artist && (
                            <span className="text-xs text-cyan-400 font-medium">
                              {artist}
                            </span>
                          )}
                          <span className="text-xs text-slate-500">
                            {formatDate(video.publishedAt)}
                          </span>
                        </div>
                      </div>

                      {/* External link icon */}
                      <ExternalLink className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer hint */}
          {results && results.length > 0 && (
            <div className="px-4 py-2 bg-slate-800/50 border-t border-slate-700 text-xs text-slate-500">
              <span className="mr-4">↑↓ Navigate</span>
              <span className="mr-4">↵ Select</span>
              <span>Esc Close</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
