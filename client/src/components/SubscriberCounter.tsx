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

    const startSimulation = () => {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          setCount(prev => prev + 1);
        }
      }, 3000);
      return interval;
    };

    const fetchStats = async () => {
      try {
        const stats = await getChannelStats();
        if (isMounted && stats) {
          setCount(stats.subscriberCount);
        } else if (isMounted) {
          // If stats are null (API failed/blocked), fallback to simulation
          console.warn("API blocked or failed, falling back to simulation");
          const interval = startSimulation();
          return () => clearInterval(interval);
        }
      } catch (e) {
        if (isMounted) {
          const interval = startSimulation();
          return () => clearInterval(interval);
        }
      }
    };

    // Try to fetch real stats immediately
    const cleanupPromise = fetchStats();

    return () => {
      isMounted = false;
      cleanupPromise.then(cleanup => cleanup && cleanup());
    };
  }, []);

  return (
    <span className={cn("font-mono tabular-nums transition-all duration-300", className)}>
      {count.toLocaleString()}
    </span>
  );
}
