import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { getDb } from "./db";

const app = express();

// Body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Health check
app.get("/api/health", async (_req, res) => {
  const info: Record<string, unknown> = { ok: true, timestamp: Date.now() };
  try {
    info.dbUrlSet = !!process.env.DATABASE_URL;
    const db = await getDb();
    info.dbConnected = !!db;
    if (db) {
      const { sql: sqlTag } = await import("drizzle-orm");
      const result = await db.execute(sqlTag`SELECT COUNT(*) as cnt FROM mixes`);
      info.mixesCount = (result as any)[0]?.cnt ?? (result as any).rows?.[0]?.cnt;
    } else {
      info.dbError = process.env.DATABASE_URL ? "Connection failed" : "DATABASE_URL not set";
    }
  } catch (e: any) {
    info.dbError = e.message;
  }
  res.json(info);
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
