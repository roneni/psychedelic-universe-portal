import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SubscriberCounterProps {
  initialCount?: number;
  className?: string;
}

export function SubscriberCounter({ initialCount = 633000, className }: SubscriberCounterProps) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // SIMULATION MODE:
    // In a real production app, you would fetch this from the YouTube Data API:
    // GET https://www.googleapis.com/youtube/v3/channels?part=statistics&id=YOUR_CHANNEL_ID&key=YOUR_API_KEY
    
    // For now, we simulate organic growth to make the site feel "alive"
    const interval = setInterval(() => {
      // 30% chance to increment subscriber count
      if (Math.random() > 0.7) {
        setCount(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className={cn("font-mono tabular-nums transition-all duration-300", className)}>
      {count.toLocaleString()}
    </span>
  );
}
