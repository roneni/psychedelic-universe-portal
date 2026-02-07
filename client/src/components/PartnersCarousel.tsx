import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { trpc } from "@/lib/trpc";

// Fallback partners for when database is empty
const fallbackPartners = [
  { id: 1, name: "Iono Music", logoUrl: "https://placehold.co/200x100/000000/FFFFFF?text=Iono+Music", quote: "Psychedelic sounds from around the globe." },
  { id: 2, name: "Digital Om", logoUrl: "https://placehold.co/200x100/000000/FFFFFF?text=Digital+Om", quote: "Connecting the global tribe through music." },
  { id: 3, name: "Nano Records", logoUrl: "https://placehold.co/200x100/000000/FFFFFF?text=Nano+Records", quote: "Where reality meets the dancefloor." },
  { id: 4, name: "Iboga Records", logoUrl: "https://placehold.co/200x100/000000/FFFFFF?text=Iboga", quote: "Progressive psy at its finest." },
  { id: 5, name: "Hommega", logoUrl: "https://placehold.co/200x100/000000/FFFFFF?text=Hommega", quote: "Israeli psy royalty." },
];

export function PartnersCarousel() {
  const { data: partners } = trpc.partners.active.useQuery();

  // Use database partners if available, otherwise use fallback
  const displayPartners = partners && partners.length > 0 
    ? partners.map(p => ({ id: p.id, name: p.name, logoUrl: p.logoUrl, quote: p.quote }))
    : fallbackPartners;

  return (
    <section className="py-16 bg-black/20 relative">
      <div className="container">
        <h3 className="text-center text-xl font-semibold text-muted-foreground mb-12 tracking-[0.2em] uppercase">
          Labels & Partners
        </h3>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {displayPartners.map((partner) => (
              <CarouselItem key={partner.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="p-1">
                  <Card className="bg-transparent border-0 shadow-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="h-16 w-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src={partner.logoUrl} alt={partner.name} className="max-h-full object-contain invert" />
                      </div>
                      {partner.quote && (
                        <p className="text-sm text-muted-foreground italic">"{partner.quote}"</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex border-white/10 hover:bg-primary/20 hover:text-primary" />
          <CarouselNext className="hidden md:flex border-white/10 hover:bg-primary/20 hover:text-primary" />
        </Carousel>
      </div>
    </section>
  );
}
