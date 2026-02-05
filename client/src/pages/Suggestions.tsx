import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Lightbulb, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Suggestions() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [category, setCategory] = useState<"feature" | "improvement" | "content" | "other">("feature");
  const [submitted, setSubmitted] = useState(false);

  const submitSuggestion = trpc.suggestions.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Thank you! Your suggestion has been received.");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit suggestion. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestion.trim()) {
      toast.error("Please enter your suggestion");
      return;
    }
    submitSuggestion.mutate({
      name: name.trim() || "Anonymous",
      email: email.trim() || undefined,
      category,
      suggestion: suggestion.trim(),
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navigation />
        <main className="flex-1 pt-24 pb-16 flex items-center justify-center">
          <div className="text-center max-w-md px-4">
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-orbitron font-bold text-cyan-400 mb-4">Thank You!</h1>
            <p className="text-muted-foreground mb-8">
              Your suggestion has been received. We appreciate you taking the time to help us improve Psychedelic Universe.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setName("");
                setEmail("");
                setSuggestion("");
                setCategory("feature");
              }}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
            >
              Submit Another Suggestion
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-8 h-8 text-cyan-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold text-cyan-400 mb-4">
              Share Your Ideas
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto">
              Help us make Psychedelic Universe better. We value every suggestion from our community.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-surface/30 backdrop-blur-sm border border-border/30 rounded-2xl p-8">
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                  What type of suggestion is this?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {([
                    { value: "feature" as const, label: "New Feature" },
                    { value: "improvement" as const, label: "Improvement" },
                    { value: "content" as const, label: "Content Idea" },
                    { value: "other" as const, label: "Other" },
                  ]).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setCategory(option.value)}
                      className={`px-4 py-2 rounded-lg border transition-all ${
                        category === option.value
                          ? "bg-cyan-500/20 border-cyan-500 text-cyan-400"
                          : "bg-surface/50 border-border/50 text-muted-foreground hover:border-cyan-500/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Field */}
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Your Name <span className="text-muted-foreground">(optional)</span>
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous"
                  className="bg-surface/50 border-border/50 focus:border-cyan-500"
                />
              </div>

              {/* Email Field */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email <span className="text-muted-foreground">(optional, if you'd like a response)</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-surface/50 border-border/50 focus:border-cyan-500"
                />
              </div>

              {/* Suggestion Field */}
              <div className="mb-6">
                <label htmlFor="suggestion" className="block text-sm font-medium text-white mb-2">
                  Your Suggestion <span className="text-red-400">*</span>
                  <span className="text-muted-foreground text-xs ml-2">(minimum 10 characters)</span>
                </label>
                <Textarea
                  id="suggestion"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  placeholder="Tell us your idea... What would make Psychedelic Universe better for you?"
                  rows={6}
                  className="bg-surface/50 border-border/50 focus:border-cyan-500 resize-none"
                  required
                  minLength={10}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {suggestion.length}/10 characters {suggestion.length >= 10 && <span className="text-green-400">✓</span>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitSuggestion.isPending}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-6 text-lg"
              >
                {submitSuggestion.isPending ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Suggestion
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Ideas Section */}
          <div className="mt-12 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20">
            <h3 className="text-xl font-semibold text-white mb-4">What kind of suggestions are we looking for?</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">✦</span>
                <span><strong className="text-white">New Features:</strong> Tools, pages, or functionality you'd like to see</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">✦</span>
                <span><strong className="text-white">User Experience:</strong> Ways to make the site easier or more enjoyable to use</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">✦</span>
                <span><strong className="text-white">Content Ideas:</strong> Artists, genres, or playlists you'd like featured</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-cyan-400">✦</span>
                <span><strong className="text-white">Community Features:</strong> Ways to connect with other psytrance fans</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
