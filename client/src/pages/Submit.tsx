import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function Submit() {
  usePageMeta({
    title: "Submit Your Track",
    description: "Submit your psytrance track or mix to Psychedelic Universe. I feature music from artists worldwide across Goa Trance, Progressive Psy, Full-On, and more genres.",
    canonicalPath: "/submit",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16 flex items-center">
        <div className="container max-w-3xl">
          <div className="text-center mb-10">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyan-400 mb-4">
              Submit Your Music
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Now promote and spread young talented unknown artists worldwide. 
              Send me your best track. If it meets my standards, it will be broadcasted to a global audience.
            </p>
          </div>

          {/* Form Container */}
          <div className="w-full bg-surface/30 backdrop-blur-sm border border-border/30 rounded-2xl overflow-hidden shadow-xl">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdp1fmE7lDcJc31ealnilwzbiLWfjI9iDSVkaQNArc8Xt6Pnw/viewform?embedded=true"
              width="100%"
              height="1647"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="w-full"
              title="Psychedelic Universe Track Submission"
            >
              Loading…
            </iframe>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
