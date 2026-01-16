import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlayCircle } from "lucide-react";

interface CategoryCardProps {
  title: string;
  image: string;
  description: string;
  className?: string;
}

export function CategoryCard({ title, image, description, className }: CategoryCardProps) {
  return (
    <Card className={cn(
      "group relative overflow-hidden border-0 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)] cursor-pointer h-[400px]",
      className
    )}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <CardContent className="relative z-10 h-full flex flex-col justify-end p-8">
        <div className="transform transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <h3 className="text-3xl font-bold text-white mb-2 tracking-wide drop-shadow-lg group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <div className="w-12 h-1 bg-primary mb-4 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
          <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-light">
            {description}
          </p>
          <div className="flex items-center text-primary font-semibold tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
            EXPLORE MIXES <PlayCircle className="ml-2 w-5 h-5" />
          </div>
        </div>
      </CardContent>
      
      {/* Border Glow Effect */}
      <div className="absolute inset-0 border border-white/10 rounded-xl group-hover:border-primary/50 transition-colors duration-500 pointer-events-none"></div>
    </Card>
  );
}
