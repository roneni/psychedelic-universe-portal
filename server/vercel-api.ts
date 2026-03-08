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

  // Extract project ref for Supabase connections
  let projectRef: string | null = null;
  if (m) {
    const directMatch = m[3].match(/^db\.([^.]+)\.supabase\.co$/);
    projectRef = directMatch ? directMatch[1] : null;

    if (projectRef) {
      const pg = await import("postgres");
      const pw = m[2];
      info.pwHasBrackets = pw.includes('[') || pw.includes(']');
      info.pwLen = pw.length;
      const attempts: Array<{ host: string; port: number; user: string }> = [
        // Try the project hostname directly (no db. prefix) — REST API resolves here
        { host: `${projectRef}.supabase.co`, port: 6543, user: `postgres.${projectRef}` },
        { host: `${projectRef}.supabase.co`, port: 5432, user: "postgres" },
        // Try standard Supavisor pooler regions
        { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, user: `postgres.${projectRef}` },
        { host: "aws-0-eu-central-1.pooler.supabase.com", port: 6543, user: `postgres.${projectRef}` },
        { host: "aws-0-us-west-1.pooler.supabase.com", port: 6543, user: `postgres.${projectRef}` },
      ];
      const poolerErrors: string[] = [];

      for (const a of attempts) {
        try {
          const raw = pg.default({
            host: a.host,
            port: a.port,
            database: "postgres",
            username: a.user,
            password: pw,
            ssl: "require" as any,
            max: 1,
            connect_timeout: 3,
          });
          const test = await raw`SELECT COUNT(*) as cnt FROM mixes`;
          info.mixesCount = test[0]?.cnt;
          info.connHost = a.host;
          info.connPort = a.port;
          info.connUser = a.user;
          info.poolerConnected = true;
          await raw.end();
          res.json(info);
          return;
        } catch (pe: any) {
          const msg = pe.cause ? String(pe.cause) : pe.message;
          poolerErrors.push(`${a.user}@${a.host}:${a.port}: ${msg}`);
        }
      }
      info.poolerErrors = poolerErrors;
    }
  }

  // Show available env var names (no values!) for debugging
  const envKeys = Object.keys(process.env).filter(k =>
    k.includes('SUPA') || k.includes('DB') || k.includes('DATA') || k.includes('PG') || k.includes('POSTGRES')
  );
  info.relatedEnvVars = envKeys;

  // Try Supabase REST API as last resort
  const supaUrl = process.env.SUPABASE_URL || (projectRef ? `https://${projectRef}.supabase.co` : "");
  // Prefer service role key (bypasses RLS)
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (supaKey && supaUrl) {
    try {
      // Proper PostgREST count: use Prefer header with head request
      const restRes = await fetch(`${supaUrl}/rest/v1/mixes?select=id,title&limit=3`, {
        headers: {
          apikey: supaKey,
          Authorization: `Bearer ${supaKey}`,
        },
      });
      info.restApiStatus = restRes.status;
      info.restKeyType = supaKey === process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : "anon";
      if (restRes.ok) {
        info.restData = await restRes.json();
        // Also get actual count
        const cntRes = await fetch(`${supaUrl}/rest/v1/mixes?select=id&head=true`, {
          headers: {
            apikey: supaKey,
            Authorization: `Bearer ${supaKey}`,
            Prefer: "count=exact",
          },
          method: "HEAD",
        });
        info.restMixesCount = cntRes.headers.get("content-range");
      } else {
        info.restError = await restRes.text();
      }
    } catch (re: any) {
      info.restError = re.message;
    }
  }

  info.guidance = "DATABASE_URL cannot connect. Update DATABASE_URL in Vercel to use the Supabase pooler connection string from Dashboard > Settings > Database > Connection string (with pooler).";
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

// GA4 Analytics OAuth callback
app.get("/api/auth/callback/google-analytics", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }
  try {
    const { exchangeGA4Code } = await import("./ga4Analytics");
    await exchangeGA4Code(code);
    res.redirect("/admin?tab=analytics&ga4=connected");
  } catch (error) {
    console.error("GA4 OAuth error:", error);
    res.redirect("/admin?tab=analytics&ga4=error");
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
