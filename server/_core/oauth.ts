import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { supabase, supabaseAdmin } from "../supabase";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  // Legacy code-based callback (kept for compatibility)
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");

    if (!code) {
      // If no code, redirect to client-side callback which handles hash fragments
      const fullUrl = req.originalUrl;
      res.redirect(302, `/auth/callback${fullUrl.includes("?") ? fullUrl.substring(fullUrl.indexOf("?")) : ""}`);
      return;
    }

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error || !data.user) {
        console.error("[OAuth] Supabase exchange failed:", error);
        res.status(400).json({ error: "Failed to exchange code for session" });
        return;
      }

      const user = data.user;

      await db.upsertUser({
        openId: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        email: user.email ?? null,
        loginMethod: user.app_metadata?.provider ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(user.id, {
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Token exchange endpoint for implicit flow (receives access_token from client)
  app.post("/api/oauth/token-exchange", async (req: Request, res: Response) => {
    const { accessToken } = req.body;

    if (!accessToken) {
      res.status(400).json({ error: "accessToken is required" });
      return;
    }

    try {
      // Verify the access token with Supabase to get user info
      const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);

      if (userError || !userData.user) {
        console.error("[OAuth] Token verification failed:", userError);
        res.status(401).json({ error: "Invalid access token" });
        return;
      }

      const user = userData.user;

      // Upsert user in our database
      await db.upsertUser({
        openId: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        email: user.email ?? null,
        loginMethod: user.app_metadata?.provider ?? null,
        lastSignedIn: new Date(),
      });

      // Create session token (JWT signed with our secret)
      const sessionToken = await sdk.createSessionToken(user.id, {
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set session cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({ success: true, user: { id: user.id, email: user.email } });
    } catch (error) {
      console.error("[OAuth] Token exchange failed:", error);
      res.status(500).json({ error: "Token exchange failed" });
    }
  });
}
