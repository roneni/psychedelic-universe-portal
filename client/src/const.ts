export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime using Supabase Auth with Google provider.
// Uses implicit flow — Supabase returns tokens in the URL fragment.
// The /auth/callback page extracts them and sends to the server.
export const getLoginUrl = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const redirectUri = `${window.location.origin}/auth/callback`;

  const url = new URL(`${supabaseUrl}/auth/v1/authorize`);
  url.searchParams.set("provider", "google");
  url.searchParams.set("redirect_to", redirectUri);

  return url.toString();
};
