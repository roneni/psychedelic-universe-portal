import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-orbitron font-bold text-cyan-400 mb-8">Privacy Policy</h1>
          
          <div className="prose prose-invert prose-cyan max-w-none space-y-8">
            <p className="text-muted-foreground text-lg">
              Last updated: January 24, 2026
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Psychedelic Universe ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website psychedelic-universe.com.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Information We Collect</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may collect the following types of information:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-white">Email Address:</strong> When you subscribe to our newsletter</li>
                <li><strong className="text-white">Usage Data:</strong> Information about how you interact with our website</li>
                <li><strong className="text-white">Device Information:</strong> Browser type, operating system, and device identifiers</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Send you newsletter updates about new music and content</li>
                <li>Improve our website and user experience</li>
                <li>Analyze website traffic and usage patterns</li>
                <li>Respond to your inquiries and requests</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our website uses the following third-party services:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><strong className="text-white">YouTube API Services:</strong> We use YouTube API Services to display video content. By using our website, you are also agreeing to be bound by the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Privacy Policy</a>.</li>
                <li><strong className="text-white">Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our website</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">YouTube API Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                This website uses YouTube API Services. YouTube is a service provided by Google LLC. By using features that access YouTube content on our website, you acknowledge and agree to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li><a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">YouTube Terms of Service</a></li>
                <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google Privacy Policy</a></li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                You can revoke access to your data via the <a href="https://security.google.com/settings/security/permissions" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Google security settings page</a>.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
                <li>Access the personal data we hold about you</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Unsubscribe from our newsletter at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at{" "}
                <a href="mailto:psyuniverse9@gmail.com" className="text-cyan-400 hover:underline">
                  psyuniverse9@gmail.com
                </a>
              </p>
            </section>

            <section className="space-y-4 pt-8 border-t border-border/30">
              <p className="text-sm text-muted-foreground">
                This site is not affiliated with, endorsed by, or sponsored by Google LLC or YouTube. All trademarks and service marks are the property of their respective owners.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
