import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * Client-side auth callback page.
 * Supabase redirects here with tokens in the URL fragment (#access_token=...).
 * This page extracts them and sends to the server to create a session cookie.
 */
export default function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // Parse the hash fragment
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken) {
          // Check if there's an error in the URL
          const errorDesc = params.get("error_description") || 
                           new URLSearchParams(window.location.search).get("error_description");
          setError(errorDesc || "No access token received from authentication provider");
          return;
        }

        // Send tokens to server to create session cookie
        const response = await fetch("/api/oauth/token-exchange", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ accessToken, refreshToken }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          setError(data.error || "Failed to create session");
          return;
        }

        // Redirect to home page
        window.location.href = "/";
      } catch (err) {
        console.error("[AuthCallback] Error:", err);
        setError("Authentication failed. Please try again.");
      }
    }

    handleCallback();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center max-w-md p-8">
          <h1 className="text-2xl font-bold mb-4 text-red-400">Authentication Error</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}
