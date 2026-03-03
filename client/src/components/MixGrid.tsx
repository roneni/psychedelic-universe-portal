import { CategoryCard } from "./CategoryCard";

const categories = [
  {
    title: "PROGRESSIVE PSYTRANCE",
    image: "/images/genre-progressive.jpg",
    description: "Deep rolling basslines, hypnotic layers, and evolving atmospheres that take you on a journey.",
    id: "progressive-psy"
  },
  {
    title: "PSYCHEDELIC TRANCE",
    image: "/images/genre-psychedelic.jpg",
    description: "Driving rhythms, twisted acid lines, and mind-bending soundscapes from the heart of the scene.",
    id: "psychedelic-trance"
  },
  {
    title: "GOA TRANCE",
    image: "/images/genre-goa.jpg",
    description: "Where it all began. Melodic, spiritual, and timeless sounds born on the beaches of Goa.",
    id: "goa-trance"
  },
  {
    title: "FULL-ON",
    image: "/images/genre-fullon.jpg",
    description: "Peak-time energy. Powerful beats and uplifting melodies built for the dancefloor.",
    id: "full-on"
  }
];

export function MixGrid() {
  return (
    <section className="py-24 relative section-nebula">
      <div className="container relative z-10">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold neon-glow">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-purple-300">
              CHOOSE YOUR FREQUENCY
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Four pillars of the psychedelic spectrum. Each one a different dimension.
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
