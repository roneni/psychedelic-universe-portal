import { COOKIE_NAME, ONE_YEAR_MS } from "../../shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { supabase } from "../supabase";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");

    if (!code) {
      res.status(400).json({ error: "code is required" });
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
}
