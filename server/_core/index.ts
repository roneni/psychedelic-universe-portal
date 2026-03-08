import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Start YouTube upload polling service
  try {
    const { startYouTubePoller } = await import("../youtubePoller");
    startYouTubePoller();
  } catch (err) {
    console.warn("[Server] YouTube poller failed to start:", err);
  }
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // YouTube Analytics OAuth callback
  app.get("/api/oauth/youtube/callback", async (req, res) => {
    const code = req.query.code as string;
    if (!code) {
      return res.status(400).send("Missing authorization code");
    }
    try {
      const { exchangeCodeForTokens } = await import("../youtubeAnalytics");
      await exchangeCodeForTokens(code);
      // Redirect to stats page on success
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
      const { exchangeGA4Code } = await import("../ga4Analytics");
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
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
