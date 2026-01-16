import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getChannelStats } from "@/lib/youtube";

interface SubscriberCounterProps {
  initialCount?: number;
  className?: string;
}

export function SubscriberCounter({ initialCount = 633000, className }: SubscriberCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      const stats = await getChannelStats();
      if (isMounted && stats) {
        setCount(stats.subscriberCount);
      }
    };

    // Try to fetch real stats immediately
    fetchStats();

    // If no API key is present (simulation mode), run the fake counter
    // We check import.meta.env directly here to decide whether to simulate
    // Also check if we have a hardcoded key in the lib file (which we now do)
    const hasKey = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyATfNbtD_0hwWt49smGHA9ki4Kb_GGaXJU";
    
    if (!hasKey) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setCount(prev => prev + 1);
        }
      }, 3000);
      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <span className={cn("font-mono tabular-nums transition-all duration-300", className)}>
      {count.toLocaleString()}
    </span>
  );
}
