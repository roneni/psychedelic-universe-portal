import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";
import { Link } from "wouter";

interface CategoryCardProps {
  title: string;
  image: string;
  description: string;
  genreId: string;
  className?: string;
}

export function CategoryCard({ title, image, description, genreId, className }: CategoryCardProps) {
  return (
    <Link href={`/genre/${genreId}`}>
      <Card className={cn(
        "group relative overflow-hidden border-0 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] cursor-pointer h-[400px] gradient-border cosmic-tilt",
        "hover:shadow-[0_0_40px_-10px_rgba(34,211,238,0.3)]",
        className
      )}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-50 group-hover:opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-75 transition-opacity duration-500"></div>
        </div>

        {/* Content */}
        <CardContent className="relative z-10 h-full flex flex-col justify-end p-8">
          <div className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <h3 className="text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-lg group-hover:text-cyan-300 transition-colors duration-300">
              {title}
            </h3>
            <div className="w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-light">
              {description}
            </p>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/30 hover:scale-110 transition-transform">
                <Play className="w-6 h-6 text-background fill-background ml-0.5" />
              </div>
              <span className="text-cyan-400 font-semibold tracking-wider">EXPLORE</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
