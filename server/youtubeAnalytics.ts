/**
 * YouTube Analytics API integration
 * Handles OAuth flow and analytics data fetching
 */

import { getDb } from "./db";
import { youtubeOAuthTokens, youtubeAnalyticsCache } from "../drizzle/schema";
import { eq } from "drizzle-orm";

// YouTube OAuth configuration - loaded from environment variables
const YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID ?? "";
const YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET ?? "";
const YOUTUBE_REDIRECT_URI = "https://psychedelic-universe.com/api/oauth/youtube/callback";

// Scopes needed for analytics
const SCOPES = [
  "https://www.googleapis.com/auth/yt-analytics.readonly",
  "https://www.googleapis.com/auth/youtube.readonly",
];

// Channel ID for Psychedelic Universe
const CHANNEL_ID = "UCyRw5ZEQ2mVwNKq9GnSTHRA";

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

/**
 * Generate the OAuth authorization URL
 */
export function getOAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: YOUTUBE_CLIENT_ID,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: YOUTUBE_REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }

  const data = await response.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  // Store tokens in database
  const db = await getDb();
  if (db) {
    await db.delete(youtubeOAuthTokens); // Remove old tokens
    await db.insert(youtubeOAuthTokens).values({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      scope: data.scope,
      tokenType: data.token_type,
    });
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt,
  };
}

/**
 * Clear all stored OAuth tokens so the "Connect" button reappears.
 */
async function clearOAuthTokens(): Promise<void> {
  const db = await getDb();
  if (db) {
    await db.delete(youtubeOAuthTokens);
    console.log("[YouTube] Cleared revoked/invalid OAuth tokens");
  }
}

/**
 * Refresh the access token using the refresh token.
 * Returns null (and clears stored tokens) when the grant is revoked or invalid.
 */
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(`[YouTube] Token refresh failed (${response.status}):`, errorBody);

      // 400 (invalid_grant) or 401 means the token is revoked/invalid — clear it
      if (response.status === 400 || response.status === 401) {
        await clearOAuthTokens();
      }
      return null;
    }

    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);

    // Update tokens in database
    const db = await getDb();
    if (db) {
      await db
        .update(youtubeOAuthTokens)
        .set({
          accessToken: data.access_token,
          expiresAt,
        })
        .where(eq(youtubeOAuthTokens.refreshToken, refreshToken));
    }

    return data.access_token;
  } catch (error) {
    console.error("[YouTube] Token refresh error:", error);
    return null;
  }
}

/**
 * Get a valid access token (refreshing if necessary)
 */
async function getValidAccessToken(): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  const tokens = await db.select().from(youtubeOAuthTokens).limit(1);
  
  if (tokens.length === 0) {
    return null;
  }

  const token = tokens[0];
  
  // Check if token is expired (with 5 minute buffer)
  if (new Date(token.expiresAt) < new Date(Date.now() + 5 * 60 * 1000)) {
    return await refreshAccessToken(token.refreshToken);
  }

  return token.accessToken;
}

/**
 * Check if OAuth is configured
 */
export async function isOAuthConfigured(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const tokens = await db.select().from(youtubeOAuthTokens).limit(1);
  return tokens.length > 0;
}

/**
 * Get cached analytics data
 */
async function getCachedData(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;

  const cached = await db
    .select()
    .from(youtubeAnalyticsCache)
    .where(eq(youtubeAnalyticsCache.metricKey, key))
    .limit(1);

  if (cached.length === 0) {
    return null;
  }

  // Check if cache is still valid
  const cacheAge = Date.now() - new Date(cached[0].cachedAt).getTime();
  if (cacheAge > CACHE_DURATION) {
    return null;
  }

  return cached[0].metricValue;
}

/**
 * Set cached analytics data
 */
async function setCachedData(key: string, value: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  await db
    .insert(youtubeAnalyticsCache)
    .values({
      metricKey: key,
      metricValue: value,
      cachedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: youtubeAnalyticsCache.metricKey,
      set: {
        metricValue: value,
        cachedAt: new Date(),
      },
    });
}

/**
 * Fetch channel basic statistics (public data)
 */
export async function getChannelStats(apiKey: string): Promise<{
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
}> {
  const cacheKey = "channel_stats";
  const cached = await getCachedData(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${apiKey}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch channel stats");
  }

  const data = await response.json();
  const stats = data.items?.[0]?.statistics;

  if (!stats) {
    throw new Error("Channel not found");
  }

  const result = {
    subscriberCount: parseInt(stats.subscriberCount, 10),
    viewCount: parseInt(stats.viewCount, 10),
    videoCount: parseInt(stats.videoCount, 10),
  };

  await setCachedData(cacheKey, JSON.stringify(result));
  return result;
}

/**
 * Fetch top videos by views
 */
export async function getTopVideos(apiKey: string, maxResults: number = 10): Promise<Array<{
  id: string;
  title: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnail: string;
  publishedAt: string;
}>> {
  const cacheKey = `top_videos_${maxResults}`;
  const cached = await getCachedData(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  // First get the uploads playlist ID
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${apiKey}`
  );
  
  if (!channelResponse.ok) {
    throw new Error("Failed to fetch channel details");
  }

  const channelData = await channelResponse.json();
  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

  if (!uploadsPlaylistId) {
    throw new Error("Uploads playlist not found");
  }

  // Get recent videos from uploads playlist
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
  );

  if (!playlistResponse.ok) {
    throw new Error("Failed to fetch playlist items");
  }

  const playlistData = await playlistResponse.json();
  const videoIds = playlistData.items?.map((item: any) => item.snippet.resourceId.videoId).join(",");

  if (!videoIds) {
    return [];
  }

  // Get video statistics
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
  );

  if (!videosResponse.ok) {
    throw new Error("Failed to fetch video statistics");
  }

  const videosData = await videosResponse.json();
  
  const videos = videosData.items
    ?.map((video: any) => ({
      id: video.id,
      title: video.snippet.title,
      viewCount: parseInt(video.statistics.viewCount || "0", 10),
      likeCount: parseInt(video.statistics.likeCount || "0", 10),
      commentCount: parseInt(video.statistics.commentCount || "0", 10),
      thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
      publishedAt: video.snippet.publishedAt,
    }))
    .sort((a: any, b: any) => b.viewCount - a.viewCount)
    .slice(0, maxResults);

  await setCachedData(cacheKey, JSON.stringify(videos));
  return videos;
}

/**
 * Fetch analytics data using YouTube Analytics API (requires OAuth)
 */
export async function getAnalyticsData(): Promise<{
  views: number;
  watchTimeMinutes: number;
  averageViewDuration: number;
  subscribersGained: number;
  topCountries: Array<{ country: string; views: number }>;
} | null> {
  const accessToken = await getValidAccessToken();
  
  if (!accessToken) {
    return null;
  }

  const cacheKey = "analytics_data";
  const cached = await getCachedData(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }

  // Get date range (last 28 days)
  const endDate = new Date().toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  try {
    // Fetch basic metrics
    const metricsResponse = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?` +
      `ids=channel==${CHANNEL_ID}&` +
      `startDate=${startDate}&` +
      `endDate=${endDate}&` +
      `metrics=views,estimatedMinutesWatched,averageViewDuration,subscribersGained`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!metricsResponse.ok) {
      console.error("Analytics API error:", await metricsResponse.text());
      return null;
    }

    const metricsData = await metricsResponse.json();
    const row = metricsData.rows?.[0] || [0, 0, 0, 0];

    // Fetch top countries
    const countriesResponse = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?` +
      `ids=channel==${CHANNEL_ID}&` +
      `startDate=${startDate}&` +
      `endDate=${endDate}&` +
      `metrics=views&` +
      `dimensions=country&` +
      `sort=-views&` +
      `maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    let topCountries: Array<{ country: string; views: number }> = [];
    
    if (countriesResponse.ok) {
      const countriesData = await countriesResponse.json();
      topCountries = (countriesData.rows || []).map((row: any) => ({
        country: row[0],
        views: row[1],
      }));
    }

    const result = {
      views: row[0],
      watchTimeMinutes: row[1],
      averageViewDuration: row[2],
      subscribersGained: row[3],
      topCountries,
    };

    await setCachedData(cacheKey, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}

/**
 * Get all statistics for the dashboard
 */
export async function getDashboardStats(apiKey: string): Promise<{
  channelStats: {
    subscriberCount: number;
    viewCount: number;
    videoCount: number;
  };
  topVideos: Array<{
    id: string;
    title: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
    thumbnail: string;
    publishedAt: string;
  }>;
  analytics: {
    views: number;
    watchTimeMinutes: number;
    averageViewDuration: number;
    subscribersGained: number;
    topCountries: Array<{ country: string; views: number }>;
  } | null;
  isOAuthConnected: boolean;
}> {
  // Public-data endpoints run independently of OAuth; analytics is best-effort.
  const [channelStats, topVideos, analytics, isOAuthConnected] = await Promise.all([
    getChannelStats(apiKey),
    getTopVideos(apiKey, 10),
    getAnalyticsData().catch((err) => {
      console.error("[YouTube] Analytics fetch failed, falling back to public data only:", err);
      return null;
    }),
    isOAuthConfigured(),
  ]);

  return {
    channelStats,
    topVideos,
    analytics,
    isOAuthConnected,
  };
}
