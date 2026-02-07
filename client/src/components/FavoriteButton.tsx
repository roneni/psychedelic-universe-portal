import { Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { getLoginUrl } from "@/const";

interface FavoriteButtonProps {
  mixId: number;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ mixId, className, size = "md" }: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const [animating, setAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const { data: favoriteIds = [], refetch } = trpc.favorites.ids.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const isFavorited = favoriteIds.includes(mixId);

  const addFavorite = trpc.favorites.add.useMutation({
    onSuccess: () => {
      refetch();
      setAnimating(true);
      setTimeout(() => setAnimating(false), 600);
      setShowTooltip("+5 Karma!");
      setTimeout(() => setShowTooltip(null), 2000);
    },
  });

  const removeFavorite = trpc.favorites.remove.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (isFavorited) {
      removeFavorite.mutate({ mixId });
    } else {
      addFavorite.mutate({ mixId });
    }
  };

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const buttonSize = size === "sm" ? "w-8 h-8" : "w-10 h-10";

  return (
    <div className="relative">
    {showTooltip && (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: -5 }}
        exit={{ opacity: 0 }}
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-emerald-500/90 text-white text-xs font-bold whitespace-nowrap z-50"
      >
        {showTooltip}
      </motion.div>
    )}
    <button
      onClick={handleClick}
      disabled={addFavorite.isPending || removeFavorite.isPending}
      className={cn(
        "relative rounded-full flex items-center justify-center transition-all duration-200",
        buttonSize,
        isFavorited
          ? "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-pink-400",
        className
      )}
    >
      <AnimatePresence>
        {animating && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-full bg-pink-400/20"
          />
        )}
      </AnimatePresence>
      <Heart
        className={cn(
          iconSize,
          "transition-all duration-200",
          isFavorited && "fill-current"
        )}
      />
    </button>
    </div>
  );
}
