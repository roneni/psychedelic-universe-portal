import { describe, it, expect } from "vitest";

describe("YouTube OAuth Credentials", () => {
  it("should have YOUTUBE_OAUTH_CLIENT_ID configured", () => {
    const clientId = process.env.YOUTUBE_OAUTH_CLIENT_ID;
    expect(clientId).toBeDefined();
    expect(clientId).not.toBe("");
    // Client ID should end with .apps.googleusercontent.com
    expect(clientId).toMatch(/\.apps\.googleusercontent\.com$/);
  });

  it("should have YOUTUBE_OAUTH_CLIENT_SECRET configured", () => {
    const clientSecret = process.env.YOUTUBE_OAUTH_CLIENT_SECRET;
    expect(clientSecret).toBeDefined();
    expect(clientSecret).not.toBe("");
    // Client Secret should start with GOCSPX-
    expect(clientSecret).toMatch(/^GOCSPX-/);
  });

  it("should generate valid OAuth URL", async () => {
    const { getOAuthUrl } = await import("./youtubeAnalytics");
    const url = getOAuthUrl();
    
    expect(url).toBeDefined();
    expect(url).toContain("accounts.google.com/o/oauth2/v2/auth");
    expect(url).toContain("client_id=");
    expect(url).toContain("redirect_uri=");
    expect(url).toContain("scope=");
  });
});
