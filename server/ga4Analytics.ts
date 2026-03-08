/**
 * Google Analytics 4 Data API integration.
 * Uses OAuth2 refresh token stored in site_settings to authenticate.
 * No external GA SDK — uses the REST API directly (same pattern as youtubeAnalytics.ts).
 */

import { getSetting, upsertSetting } from "./db";

const GA4_PROPERTY_ID = "527492497";

function getClientId() { return process.env.GOOGLE_CLIENT_ID || ""; }
function getClientSecret() { return process.env.GOOGLE_CLIENT_SECRET || ""; }

function getRedirectUri() {
  if (process.env.VERCEL) {
    return "https://psychedelic-universe.com/api/auth/callback/google-analytics";
  }
  return "http://localhost:3000/api/auth/callback/google-analytics";
}

// ============ OAuth ============

export function getGA4OAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: getClientId(),
    redirect_uri: getRedirectUri(),
    response_type: "code",
    scope: "https://www.googleapis.com/auth/analytics.readonly",
    access_type: "offline",
    prompt: "consent",
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGA4Code(code: string): Promise<void> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      redirect_uri: getRedirectUri(),
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[GA4] Token exchange failed:", err);
    throw new Error("Failed to exchange GA4 authorization code");
  }

  const data = await res.json();
  if (data.refresh_token) {
    await upsertSetting("ga4_refresh_token", data.refresh_token, "GA4 OAuth refresh token");
  } else {
    throw new Error("No refresh token received from Google");
  }
}

async function getAccessToken(): Promise<string | null> {
  const refreshToken = await getSetting("ga4_refresh_token");
  if (!refreshToken) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: getClientId(),
      client_secret: getClientSecret(),
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    if (res.status === 400 || res.status === 401) {
      console.warn("[GA4] Refresh token invalid, clearing");
      await upsertSetting("ga4_refresh_token", "", "GA4 OAuth refresh token (cleared)");
      return null;
    }
    console.error("[GA4] Token refresh failed:", res.status);
    return null;
  }

  const data = await res.json();
  return data.access_token;
}

export async function isGA4Connected(): Promise<boolean> {
  const token = await getSetting("ga4_refresh_token");
  return !!token && token.length > 0;
}

// ============ Cache (in-memory, 5 min TTL) ============

const cache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (entry && Date.now() < entry.expiresAt) return entry.data;
  cache.delete(key);
  return null;
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL });
}

// ============ GA4 Data API ============

async function runReport(body: object): Promise<any | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    console.error("[GA4] Report API error:", res.status, await res.text());
    return null;
  }

  return res.json();
}

function pctChange(curr: number, prev: number): number {
  if (prev === 0) return curr > 0 ? 100 : 0;
  return Math.round(((curr - prev) / prev) * 100);
}

function metricVal(row: any, index: number): number {
  return parseFloat(row?.metricValues?.[index]?.value) || 0;
}

// ---- Endpoints ----

export async function getOverview() {
  const cached = getCached("overview");
  if (cached) return cached;

  const connected = await isGA4Connected();
  if (!connected) return { connected: false };

  const data = await runReport({
    dateRanges: [
      { startDate: "30daysAgo", endDate: "today" },
      { startDate: "60daysAgo", endDate: "31daysAgo" },
    ],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "averageSessionDuration" },
    ],
  });

  if (!data?.rows?.length) {
    const result = {
      connected: true, pageViews: 0, users: 0, sessions: 0, avgDuration: 0,
      changes: { pageViews: 0, users: 0, sessions: 0, avgDuration: 0 },
    };
    setCache("overview", result);
    return result;
  }

  // With 2 date ranges and no explicit dimensions, GA4 adds an implicit dateRange dimension
  const currentRow = data.rows.find((r: any) => r.dimensionValues?.[0]?.value === "date_range_0") || data.rows[0];
  const prevRow = data.rows.find((r: any) => r.dimensionValues?.[0]?.value === "date_range_1") || data.rows[1];

  const current = {
    pageViews: metricVal(currentRow, 0),
    users: metricVal(currentRow, 1),
    sessions: metricVal(currentRow, 2),
    avgDuration: metricVal(currentRow, 3),
  };

  const prev = prevRow ? {
    pageViews: metricVal(prevRow, 0),
    users: metricVal(prevRow, 1),
    sessions: metricVal(prevRow, 2),
    avgDuration: metricVal(prevRow, 3),
  } : { pageViews: 0, users: 0, sessions: 0, avgDuration: 0 };

  const result = {
    connected: true,
    ...current,
    changes: {
      pageViews: pctChange(current.pageViews, prev.pageViews),
      users: pctChange(current.users, prev.users),
      sessions: pctChange(current.sessions, prev.sessions),
      avgDuration: pctChange(current.avgDuration, prev.avgDuration),
    },
  };

  setCache("overview", result);
  return result;
}

export async function getTopPages() {
  const cached = getCached("topPages");
  if (cached) return cached;

  const connected = await isGA4Connected();
  if (!connected) return { connected: false };

  const data = await runReport({
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "pagePath" }],
    metrics: [
      { name: "screenPageViews" },
      { name: "activeUsers" },
    ],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 20,
  });

  const pages = (data?.rows || []).map((row: any) => ({
    path: row.dimensionValues[0].value,
    views: parseInt(row.metricValues[0].value) || 0,
    users: parseInt(row.metricValues[1].value) || 0,
  }));

  const result = { connected: true, pages };
  setCache("topPages", result);
  return result;
}

export async function getTrafficSources() {
  const cached = getCached("trafficSources");
  if (cached) return cached;

  const connected = await isGA4Connected();
  if (!connected) return { connected: false };

  const data = await runReport({
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "sessionSourceMedium" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 20,
  });

  const sources = (data?.rows || []).map((row: any) => ({
    source: row.dimensionValues[0].value,
    sessions: parseInt(row.metricValues[0].value) || 0,
  }));

  const result = { connected: true, sources };
  setCache("trafficSources", result);
  return result;
}

export async function getCountries() {
  const cached = getCached("countries");
  if (cached) return cached;

  const connected = await isGA4Connected();
  if (!connected) return { connected: false };

  const data = await runReport({
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "country" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: 15,
  });

  const countries = (data?.rows || []).map((row: any) => ({
    country: row.dimensionValues[0].value,
    users: parseInt(row.metricValues[0].value) || 0,
  }));

  const result = { connected: true, countries };
  setCache("countries", result);
  return result;
}

export async function getDevices() {
  const cached = getCached("devices");
  if (cached) return cached;

  const connected = await isGA4Connected();
  if (!connected) return { connected: false };

  const data = await runReport({
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "deviceCategory" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  const devices = (data?.rows || []).map((row: any) => ({
    device: row.dimensionValues[0].value,
    sessions: parseInt(row.metricValues[0].value) || 0,
  }));

  const result = { connected: true, devices };
  setCache("devices", result);
  return result;
}

export async function getPageViewsOverTime() {
  const cached = getCached("pageViewsOverTime");
  if (cached) return cached;

  const connected = await isGA4Connected();
  if (!connected) return { connected: false };

  const data = await runReport({
    dateRanges: [{ startDate: "30daysAgo", endDate: "today" }],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "screenPageViews" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });

  const daily = (data?.rows || []).map((row: any) => {
    const d = row.dimensionValues[0].value; // "20260301"
    return {
      date: `${d.slice(4, 6)}/${d.slice(6, 8)}`,
      views: parseInt(row.metricValues[0].value) || 0,
    };
  });

  const result = { connected: true, daily };
  setCache("pageViewsOverTime", result);
  return result;
}
