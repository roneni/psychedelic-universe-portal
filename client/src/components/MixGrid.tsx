import { CategoryCard } from "./CategoryCard";

const categories = [
  {
    title: "PROGRESSIVE PSYTRANCE",
    image: "/images/progressive-psy.jpg",
    description: "Deep, rolling basslines and hypnotic atmospheres for the modern dancefloor.",
    id: "progressive-psy"
  },
  {
    title: "PSYCHEDELIC TRANCE",
    image: "/images/psychedelic-trance.jpg",
    description: "Driving basslines, FM synthesis, and futuristic sounds from the UK psy scene.",
    id: "psychedelic-trance"
  },
  {
    title: "GOA TRANCE",
    image: "/images/goa-trance.jpg",
    description: "The roots of the movement. Melodic, spiritual, and organic sounds from the golden era.",
    id: "goa-trance"
  },
  {
    title: "FULL-ON",
    image: "/images/full-on.jpg",
    description: "High energy, driving beats, and dynamic melodies designed to blast the night away.",
    id: "full-on"
  }
];

export function MixGrid() {
  return (
    <section className="py-24 relative">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            THE PSY-PORTAL
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Choose your frequency. Explore our curated collections across the psychedelic spectrum.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              image={category.image}
              description={category.description}
              genreId={category.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
