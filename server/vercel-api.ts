import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";

const app = express();

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, timestamp: Date.now() });
});

// OAuth callback under /api/oauth/callback
registerOAuthRoutes(app);

// YouTube Analytics OAuth callback
app.get("/api/oauth/youtube/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }
  try {
    const { exchangeCodeForTokens } = await import("./youtubeAnalytics");
    await exchangeCodeForTokens(code);
    res.redirect("/stats?connected=true");
  } catch (error) {
    console.error("YouTube OAuth error:", error);
    res.redirect("/stats?error=oauth_failed");
  }
});

// tRPC API
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
