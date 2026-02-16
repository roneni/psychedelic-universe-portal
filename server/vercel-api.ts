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

// Health check — tries configured DATABASE_URL, then shows diagnostic info
app.get("/api/health", async (_req, res) => {
  const info: Record<string, unknown> = { ok: true, timestamp: Date.now() };
  const url = process.env.DATABASE_URL;
  info.dbUrlSet = !!url;
  if (!url) { res.json({ ...info, dbError: "DATABASE_URL not set" }); return; }

  // Parse URL to show connection target
  const m = url.match(/^postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+?)(\?.*)?$/);
  if (m) { info.dbUser = m[1]; info.dbHost = m[3]; info.dbPort = Number(m[4]); }

  // Try connecting with the standard getDb() path
  try {
    const db = await getDb();
    info.dbConnected = !!db;
    if (db) {
      const { sql: sqlTag } = await import("drizzle-orm");
      const result = await db.execute(sqlTag`SELECT COUNT(*) as cnt FROM mixes`);
      info.mixesCount = (result as any)[0]?.cnt ?? (result as any).rows?.[0]?.cnt;
      res.json(info);
      return;
    }
  } catch (e: any) {
    info.primaryError = e.cause ? String(e.cause) : e.message;
  }

  // If the standard connection failed, try raw postgres with the URL as-is
  try {
    const pg = await import("postgres");
    const raw = pg.default({
      host: m ? m[3] : undefined,
      port: m ? Number(m[4]) : undefined,
      database: m ? m[5] : undefined,
      username: m ? m[1] : undefined,
      password: m ? m[2] : undefined,
      ssl: "require" as any,
      max: 1,
      connect_timeout: 5,
    });
    const test = await raw`SELECT COUNT(*) as cnt FROM mixes`;
    info.mixesCount = test[0]?.cnt;
    info.rawConnected = true;
    await raw.end();
    res.json(info);
    return;
  } catch (e2: any) {
    info.rawError = e2.cause ? String(e2.cause) : e2.message;
  }

  // Show guidance
  info.guidance = "DATABASE_URL cannot connect. If using Supabase, go to Dashboard > Settings > Database > Connection string > URI (with pooler) and update DATABASE_URL in Vercel.";
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
