import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";

const partners = [
  { name: "Iono Music", logo: "https://placehold.co/200x100/000000/FFFFFF?text=Iono+Music", quote: "The premier destination for psychedelic sounds." },
  { name: "Digital Om", logo: "https://placehold.co/200x100/000000/FFFFFF?text=Digital+Om", quote: "Connecting the global tribe through music." },
  { name: "Nano Records", logo: "https://placehold.co/200x100/000000/FFFFFF?text=Nano+Records", quote: "Always pushing the boundaries of reality." },
  { name: "Iboga Records", logo: "https://placehold.co/200x100/000000/FFFFFF?text=Iboga", quote: "Pure progressive bliss." },
  { name: "Hommega", logo: "https://placehold.co/200x100/000000/FFFFFF?text=Hommega", quote: "Legends of the scene." },
];

export function PartnersCarousel() {
  return (
    <section className="py-16 border-y border-white/5 bg-black/20">
      <div className="container">
        <h3 className="text-center text-xl font-semibold text-muted-foreground mb-12 tracking-[0.2em] uppercase">
          Trusted by Global Labels
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
            {partners.map((partner, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                <div className="p-1">
                  <Card className="bg-transparent border-0 shadow-none">
                    <CardContent className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                      <div className="h-16 w-full flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0">
                        <img src={partner.logo} alt={partner.name} className="max-h-full object-contain invert" />
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{partner.quote}"</p>
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
