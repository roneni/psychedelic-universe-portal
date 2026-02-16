var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// drizzle/schema.ts
import { serial, pgTable, pgEnum, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";
var roleEnum, mixCategoryEnum, notificationTypeEnum, suggestionCategoryEnum, suggestionStatusEnum, karmaActionEnum, contentTypeEnum, users, mixes, partners, siteSettings, subscribers, artists, notifications, youtubeOAuthTokens, youtubeAnalyticsCache, suggestions, karmaPoints, favorites, ronensPicks, vaultAccess, vaultMixes;
var init_schema = __esm({
  "drizzle/schema.ts"() {
    "use strict";
    roleEnum = pgEnum("role", ["user", "admin"]);
    mixCategoryEnum = pgEnum("mix_category", ["progressive-psy", "psychedelic-trance", "goa-trance", "full-on"]);
    notificationTypeEnum = pgEnum("notification_type", ["upload", "comment"]);
    suggestionCategoryEnum = pgEnum("suggestion_category", ["feature", "improvement", "content", "other"]);
    suggestionStatusEnum = pgEnum("suggestion_status", ["pending", "reviewed", "implemented", "declined"]);
    karmaActionEnum = pgEnum("karma_action", [
      "signup",
      "favorite",
      "unfavorite",
      "suggestion",
      "newsletter",
      "daily_visit",
      "share",
      "artist_submit"
    ]);
    contentTypeEnum = pgEnum("content_type", ["mix", "track"]);
    users = pgTable("users", {
      id: serial("id").primaryKey(),
      /** OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
      openId: varchar("openId", { length: 64 }).notNull().unique(),
      name: text("name"),
      email: varchar("email", { length: 320 }),
      loginMethod: varchar("loginMethod", { length: 64 }),
      role: roleEnum("role").default("user").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull(),
      lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
    });
    mixes = pgTable("mixes", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      youtubeId: varchar("youtubeId", { length: 20 }).notNull(),
      category: mixCategoryEnum("category").notNull(),
      artist: varchar("artist", { length: 255 }),
      description: text("description"),
      thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
      featured: boolean("featured").default(false).notNull(),
      sortOrder: integer("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    partners = pgTable("partners", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      logoUrl: varchar("logoUrl", { length: 500 }).notNull(),
      websiteUrl: varchar("websiteUrl", { length: 500 }),
      quote: text("quote"),
      active: boolean("active").default(true).notNull(),
      sortOrder: integer("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    siteSettings = pgTable("site_settings", {
      id: serial("id").primaryKey(),
      key: varchar("key", { length: 100 }).notNull().unique(),
      value: text("value"),
      description: varchar("description", { length: 255 }),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    subscribers = pgTable("subscribers", {
      id: serial("id").primaryKey(),
      email: varchar("email", { length: 320 }).notNull().unique(),
      active: boolean("active").default(true).notNull(),
      subscribedAt: timestamp("subscribedAt").defaultNow().notNull()
    });
    artists = pgTable("artists", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).notNull(),
      slug: varchar("slug", { length: 255 }).notNull().unique(),
      realName: varchar("realName", { length: 255 }),
      country: varchar("country", { length: 100 }),
      primaryGenre: mixCategoryEnum("primaryGenre"),
      bio: text("bio"),
      imageUrl: varchar("imageUrl", { length: 500 }),
      websiteUrl: varchar("websiteUrl", { length: 500 }),
      youtubeUrl: varchar("youtubeUrl", { length: 500 }),
      soundcloudUrl: varchar("soundcloudUrl", { length: 500 }),
      spotifyUrl: varchar("spotifyUrl", { length: 500 }),
      instagramUrl: varchar("instagramUrl", { length: 500 }),
      facebookUrl: varchar("facebookUrl", { length: 500 }),
      trackCount: integer("trackCount").default(0).notNull(),
      featured: boolean("featured").default(false).notNull(),
      sortOrder: integer("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    notifications = pgTable("notifications", {
      id: serial("id").primaryKey(),
      type: notificationTypeEnum("type").notNull(),
      title: varchar("title", { length: 255 }).notNull(),
      message: text("message").notNull(),
      /** For uploads: link to the track/video */
      link: varchar("link", { length: 500 }),
      /** For comments: username who commented */
      username: varchar("username", { length: 255 }),
      /** Reference to the related content (e.g., youtubeId) */
      referenceId: varchar("referenceId", { length: 100 }),
      read: boolean("read").default(false).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    youtubeOAuthTokens = pgTable("youtube_oauth_tokens", {
      id: serial("id").primaryKey(),
      accessToken: text("accessToken").notNull(),
      refreshToken: text("refreshToken").notNull(),
      expiresAt: timestamp("expiresAt").notNull(),
      scope: text("scope"),
      tokenType: varchar("tokenType", { length: 50 }).default("Bearer"),
      createdAt: timestamp("createdAt").defaultNow().notNull(),
      updatedAt: timestamp("updatedAt").defaultNow().notNull()
    });
    youtubeAnalyticsCache = pgTable("youtube_analytics_cache", {
      id: serial("id").primaryKey(),
      metricKey: varchar("metricKey", { length: 100 }).notNull().unique(),
      metricValue: text("metricValue").notNull(),
      cachedAt: timestamp("cachedAt").defaultNow().notNull()
    });
    suggestions = pgTable("suggestions", {
      id: serial("id").primaryKey(),
      name: varchar("name", { length: 255 }).default("Anonymous").notNull(),
      email: varchar("email", { length: 320 }),
      category: suggestionCategoryEnum("category").default("feature").notNull(),
      suggestion: text("suggestion").notNull(),
      status: suggestionStatusEnum("status").default("pending").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    karmaPoints = pgTable("karma_points", {
      id: serial("id").primaryKey(),
      userId: integer("userId").notNull(),
      action: karmaActionEnum("action").notNull(),
      points: integer("points").notNull(),
      description: varchar("description", { length: 255 }),
      referenceId: varchar("referenceId", { length: 100 }),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    favorites = pgTable("favorites", {
      id: serial("id").primaryKey(),
      userId: integer("userId").notNull(),
      mixId: integer("mixId").notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    ronensPicks = pgTable("ronens_picks", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      youtubeId: varchar("youtubeId", { length: 20 }).notNull(),
      description: text("description"),
      thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
      contentType: contentTypeEnum("contentType").default("mix").notNull(),
      sortOrder: integer("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
    vaultAccess = pgTable("vault_access", {
      id: serial("id").primaryKey(),
      userId: integer("userId").notNull(),
      grantedAt: timestamp("grantedAt").defaultNow().notNull()
    });
    vaultMixes = pgTable("vault_mixes", {
      id: serial("id").primaryKey(),
      title: varchar("title", { length: 255 }).notNull(),
      youtubeId: varchar("youtubeId", { length: 20 }).notNull(),
      description: text("description"),
      duration: varchar("duration", { length: 20 }),
      sortOrder: integer("sortOrder").default(0).notNull(),
      createdAt: timestamp("createdAt").defaultNow().notNull()
    });
  }
});

// server/_core/env.ts
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      cookieSecret: process.env.COOKIE_SECRET ?? process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      supabaseUrl: process.env.SUPABASE_URL ?? "",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? "",
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
    };
  }
});

// server/_core/notification.ts
var notification_exports = {};
__export(notification_exports, {
  notifyOwner: () => notifyOwner
});
async function notifyOwner(payload) {
  console.log("[Notification] (stub)", payload.title, payload.content);
  return false;
}
var init_notification = __esm({
  "server/_core/notification.ts"() {
    "use strict";
  }
});

// server/db.ts
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, desc, asc, and, sql } from "drizzle-orm";
function parseDbUrl(url) {
  const m = url.match(/^postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+?)(\?.*)?$/);
  if (!m) return null;
  return { user: m[1], password: m[2], host: m[3], port: Number(m[4]), database: m[5] };
}
function createClient(url) {
  const isSupabase = url.includes("supabase");
  const useSSL = process.env.NODE_ENV === "production" || isSupabase;
  const parsed = parseDbUrl(url);
  if (parsed) {
    return postgres({
      host: parsed.host,
      port: parsed.port,
      database: parsed.database,
      username: parsed.user,
      password: parsed.password,
      ssl: useSSL ? "require" : false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10
    });
  }
  return postgres(url, {
    ssl: useSSL ? "require" : false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10
  });
}
async function getDb() {
  if (_pgBroken) return null;
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = createClient(process.env.DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function restGet(table, params) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  const qs = params ? `?${params}` : "";
  const res = await fetch(`${url}/rest/v1/${table}${qs}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  if (!res.ok) {
    console.warn(`[REST] GET ${table} failed: ${res.status}`);
    return [];
  }
  return res.json();
}
async function restPost(table, body, upsertCol) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Database not available");
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json"
  };
  if (upsertCol) headers["Prefer"] = `resolution=merge-duplicates`;
  const res = await fetch(`${url}/rest/v1/${table}${upsertCol ? `?on_conflict=${upsertCol}` : ""}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`REST POST ${table} failed: ${res.status} ${err}`);
  }
}
async function restPatch(table, filter, body) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Database not available");
  const res = await fetch(`${url}/rest/v1/${table}?${filter}`, {
    method: "PATCH",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`REST PATCH ${table} failed: ${res.status}`);
}
async function restDelete(table, filter) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Database not available");
  const res = await fetch(`${url}/rest/v1/${table}?${filter}`, {
    method: "DELETE",
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  if (!res.ok) throw new Error(`REST DELETE ${table} failed: ${res.status}`);
}
async function tryPg(fn) {
  if (_pgBroken) return null;
  const db = await getDb();
  if (!db) return null;
  try {
    return await fn(db);
  } catch (e) {
    const cause = String(e.cause || e.message || "");
    if (cause.includes("ENOTFOUND") || cause.includes("CONNECT_TIMEOUT") || cause.includes("Tenant or user not found")) {
      _pgBroken = true;
      console.warn("[Database] PG connection failed, switching to REST fallback");
    }
    return null;
  }
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const pg = await tryPg((db) => db.select().from(users).where(eq(users.openId, openId)).limit(1));
  if (pg) return pg.length > 0 ? pg[0] : void 0;
  const rest = await restGet("users", `"openId"=eq.${encodeURIComponent(openId)}&limit=1`);
  return rest.length > 0 ? rest[0] : void 0;
}
async function getAllMixes() {
  const pg = await tryPg((db) => db.select().from(mixes).orderBy(asc(mixes.sortOrder), desc(mixes.createdAt)));
  if (pg) return pg;
  return restGet("mixes", 'select=*&order="sortOrder".asc,"createdAt".desc');
}
async function getMixesByCategory(category) {
  const pg = await tryPg((db) => db.select().from(mixes).where(eq(mixes.category, category)).orderBy(asc(mixes.sortOrder)));
  if (pg) return pg;
  return restGet("mixes", `select=*&category=eq.${encodeURIComponent(category)}&order="sortOrder".asc`);
}
async function getFeaturedMixes() {
  const pg = await tryPg((db) => db.select().from(mixes).where(eq(mixes.featured, true)).orderBy(asc(mixes.sortOrder)));
  if (pg) return pg;
  return restGet("mixes", 'select=*&featured=is.true&order="sortOrder".asc');
}
async function createMix(mix) {
  const pg = await tryPg((db) => db.insert(mixes).values(mix));
  if (pg !== null) return;
  await restPost("mixes", mix);
}
async function updateMix(id, mix) {
  const pg = await tryPg((db) => db.update(mixes).set(mix).where(eq(mixes.id, id)));
  if (pg !== null) return;
  await restPatch("mixes", `id=eq.${id}`, mix);
}
async function deleteMix(id) {
  const pg = await tryPg((db) => db.delete(mixes).where(eq(mixes.id, id)));
  if (pg !== null) return;
  await restDelete("mixes", `id=eq.${id}`);
}
async function getAllPartners() {
  const pg = await tryPg((db) => db.select().from(partners).orderBy(asc(partners.sortOrder)));
  if (pg) return pg;
  return restGet("partners", 'select=*&order="sortOrder".asc');
}
async function getActivePartners() {
  const pg = await tryPg((db) => db.select().from(partners).where(eq(partners.active, true)).orderBy(asc(partners.sortOrder)));
  if (pg) return pg;
  return restGet("partners", 'select=*&active=is.true&order="sortOrder".asc');
}
async function createPartner(partner) {
  const pg = await tryPg((db) => db.insert(partners).values(partner));
  if (pg !== null) return;
  await restPost("partners", partner);
}
async function updatePartner(id, partner) {
  const pg = await tryPg((db) => db.update(partners).set(partner).where(eq(partners.id, id)));
  if (pg !== null) return;
  await restPatch("partners", `id=eq.${id}`, partner);
}
async function deletePartner(id) {
  const pg = await tryPg((db) => db.delete(partners).where(eq(partners.id, id)));
  if (pg !== null) return;
  await restDelete("partners", `id=eq.${id}`);
}
async function getAllSettings() {
  const pg = await tryPg((db) => db.select().from(siteSettings));
  if (pg) return pg;
  return restGet("site_settings", "select=*");
}
async function getSetting(key) {
  const pg = await tryPg((db) => db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1));
  if (pg) return pg.length > 0 ? pg[0].value : null;
  const rest = await restGet("site_settings", `select=*&key=eq.${encodeURIComponent(key)}&limit=1`);
  return rest.length > 0 ? rest[0].value : null;
}
async function upsertSetting(key, value, description) {
  const pg = await tryPg((db) => db.insert(siteSettings).values({ key, value, description }).onConflictDoUpdate({ target: siteSettings.key, set: { value, description } }));
  if (pg !== null) return;
  await restPost("site_settings", { key, value, description }, "key");
}
async function getAllSubscribers() {
  const pg = await tryPg((db) => db.select().from(subscribers).orderBy(desc(subscribers.subscribedAt)));
  if (pg) return pg;
  return restGet("subscribers", 'select=*&order="subscribedAt".desc');
}
async function addSubscriber(email) {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };
  try {
    await db.insert(subscribers).values({ email });
    try {
      const { notifyOwner: notifyOwner2 } = await Promise.resolve().then(() => (init_notification(), notification_exports));
      await notifyOwner2({
        title: "New Newsletter Subscriber!",
        content: `A new user has subscribed to the Psychedelic Universe newsletter: ${email}`
      });
    } catch (notifyError) {
      console.warn("[Newsletter] Failed to notify owner:", notifyError);
    }
    return { success: true, message: "Successfully subscribed!" };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "23505") {
      return { success: false, message: "This email is already subscribed." };
    }
    throw error;
  }
}
async function removeSubscriber(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(subscribers).where(eq(subscribers.id, id));
}
async function getAllArtists() {
  const pg = await tryPg((db) => db.select().from(artists).orderBy(asc(artists.sortOrder), desc(artists.trackCount)));
  if (pg) return pg;
  return restGet("artists", 'select=*&order="sortOrder".asc,"trackCount".desc');
}
async function getFeaturedArtists() {
  const pg = await tryPg((db) => db.select().from(artists).where(eq(artists.featured, true)).orderBy(asc(artists.sortOrder)));
  if (pg) return pg;
  return restGet("artists", 'select=*&featured=is.true&order="sortOrder".asc');
}
async function getArtistBySlug(slug) {
  const pg = await tryPg((db) => db.select().from(artists).where(eq(artists.slug, slug)).limit(1));
  if (pg) return pg.length > 0 ? pg[0] : void 0;
  const rest = await restGet("artists", `select=*&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return rest.length > 0 ? rest[0] : void 0;
}
async function createArtist(artist) {
  const pg = await tryPg((db) => db.insert(artists).values(artist));
  if (pg !== null) return;
  await restPost("artists", artist);
}
async function updateArtist(id, artist) {
  const pg = await tryPg((db) => db.update(artists).set(artist).where(eq(artists.id, id)));
  if (pg !== null) return;
  await restPatch("artists", `id=eq.${id}`, artist);
}
async function deleteArtist(id) {
  const pg = await tryPg((db) => db.delete(artists).where(eq(artists.id, id)));
  if (pg !== null) return;
  await restDelete("artists", `id=eq.${id}`);
}
async function getRecentNotifications(limit = 20) {
  const pg = await tryPg((db) => db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(limit));
  if (pg) return pg;
  return restGet("notifications", `select=*&order="createdAt".desc&limit=${limit}`);
}
async function getUnreadNotifications() {
  const pg = await tryPg((db) => db.select().from(notifications).where(eq(notifications.read, false)).orderBy(desc(notifications.createdAt)));
  if (pg) return pg;
  return restGet("notifications", 'select=*&read=is.false&order="createdAt".desc');
}
async function createNotification(notification) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(notifications).values(notification);
}
async function markNotificationAsRead(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}
async function markAllNotificationsAsRead() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ read: true }).where(eq(notifications.read, false));
}
async function deleteNotification(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(notifications).where(eq(notifications.id, id));
}
async function getAllSuggestions() {
  const pg = await tryPg((db) => db.select().from(suggestions).orderBy(desc(suggestions.createdAt)));
  if (pg) return pg;
  return restGet("suggestions", 'select=*&order="createdAt".desc');
}
async function createSuggestion(suggestion) {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };
  try {
    await db.insert(suggestions).values(suggestion);
    try {
      const { notifyOwner: notifyOwner2 } = await Promise.resolve().then(() => (init_notification(), notification_exports));
      await notifyOwner2({
        title: "New Site Suggestion!",
        content: `Category: ${suggestion.category}
From: ${suggestion.name}${suggestion.email ? ` (${suggestion.email})` : ""}

Suggestion:
${suggestion.suggestion}`
      });
    } catch (notifyError) {
      console.warn("[Suggestions] Failed to notify owner:", notifyError);
    }
    return { success: true, message: "Suggestion submitted successfully!" };
  } catch (error) {
    console.error("[Suggestions] Failed to create suggestion:", error);
    throw error;
  }
}
async function updateSuggestionStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(suggestions).set({ status }).where(eq(suggestions.id, id));
}
async function deleteSuggestion(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(suggestions).where(eq(suggestions.id, id));
}
async function awardKarma(userId, action, description, referenceId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const points = KARMA_VALUES[action] || 0;
  await db.insert(karmaPoints).values({
    userId,
    action,
    points,
    description,
    referenceId
  });
  const totalKarma = await getUserTotalKarma(userId);
  return { points, totalKarma };
}
async function getUserTotalKarma(userId) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ total: sql`COALESCE(SUM(${karmaPoints.points}), 0)` }).from(karmaPoints).where(eq(karmaPoints.userId, userId));
  return result[0]?.total || 0;
}
async function getUserKarmaHistory(userId, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(karmaPoints).where(eq(karmaPoints.userId, userId)).orderBy(desc(karmaPoints.createdAt)).limit(limit);
}
async function getKarmaLeaderboard(limit = 20) {
  const pg = await tryPg(async (db) => {
    const result = await db.select({
      userId: karmaPoints.userId,
      name: users.name,
      totalKarma: sql`COALESCE(SUM(${karmaPoints.points}), 0)`
    }).from(karmaPoints).leftJoin(users, eq(karmaPoints.userId, users.id)).groupBy(karmaPoints.userId, users.name).orderBy(sql`COALESCE(SUM(${karmaPoints.points}), 0) DESC`).limit(limit);
    return result.map((r) => ({ userId: r.userId, name: r.name, totalKarma: Number(r.totalKarma) }));
  });
  if (pg) return pg;
  return [];
}
async function hasEarnedKarmaToday(userId, action) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select({ count: sql`COUNT(*)` }).from(karmaPoints).where(
    and(
      eq(karmaPoints.userId, userId),
      eq(karmaPoints.action, action),
      sql`DATE(${karmaPoints.createdAt}) = CURRENT_DATE`
    )
  );
  return (result[0]?.count || 0) > 0;
}
async function getUserFavorites(userId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(favorites).leftJoin(mixes, eq(favorites.mixId, mixes.id)).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
  return result.map((r) => ({
    ...r.favorites,
    mix: r.mixes || void 0
  }));
}
async function addFavorite(userId, mixId) {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };
  try {
    const existing = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.mixId, mixId))).limit(1);
    if (existing.length > 0) {
      return { success: false, message: "Already in favorites" };
    }
    await db.insert(favorites).values({ userId, mixId });
    await awardKarma(userId, "favorite", "Favorited a mix", String(mixId));
    return { success: true, message: "Added to favorites!" };
  } catch (error) {
    console.error("[Favorites] Failed to add favorite:", error);
    throw error;
  }
}
async function removeFavorite(userId, mixId) {
  const db = await getDb();
  if (!db) return { success: false };
  await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.mixId, mixId)));
  await awardKarma(userId, "unfavorite", "Removed a favorite", String(mixId));
  return { success: true };
}
async function getUserFavoriteIds(userId) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select({ mixId: favorites.mixId }).from(favorites).where(eq(favorites.userId, userId));
  return result.map((r) => r.mixId);
}
async function getAllRonensPicks() {
  const pg = await tryPg((db) => db.select().from(ronensPicks).orderBy(asc(ronensPicks.sortOrder), desc(ronensPicks.createdAt)));
  if (pg) return pg;
  return restGet("ronens_picks", 'select=*&order="sortOrder".asc,"createdAt".desc');
}
async function createRonensPick(pick) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ronensPicks).values(pick);
}
async function deleteRonensPick(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(ronensPicks).where(eq(ronensPicks.id, id));
}
async function verifyVaultPassphrase(userId, passphrase) {
  if (passphrase.toLowerCase().trim() !== VAULT_PASSPHRASE.toLowerCase().trim()) {
    return false;
  }
  const db = await getDb();
  if (!db) return false;
  const existing = await db.select().from(vaultAccess).where(eq(vaultAccess.userId, userId)).limit(1);
  if (existing.length === 0) {
    await db.insert(vaultAccess).values({ userId });
  }
  return true;
}
async function checkVaultAccess(userId) {
  const db = await getDb();
  if (!db) return false;
  const result = await db.select().from(vaultAccess).where(eq(vaultAccess.userId, userId)).limit(1);
  return result.length > 0;
}
async function getVaultMixes() {
  const pg = await tryPg((db) => db.select().from(vaultMixes).orderBy(asc(vaultMixes.sortOrder), desc(vaultMixes.createdAt)));
  if (pg) return pg;
  return restGet("vault_mixes", 'select=*&order="sortOrder".asc,"createdAt".desc');
}
async function createVaultMix(mix) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(vaultMixes).values(mix);
}
async function deleteVaultMix(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(vaultMixes).where(eq(vaultMixes.id, id));
}
var _db, _pgBroken, KARMA_VALUES, VAULT_PASSPHRASE;
var init_db = __esm({
  "server/db.ts"() {
    "use strict";
    init_schema();
    init_env();
    init_schema();
    _db = null;
    _pgBroken = false;
    KARMA_VALUES = {
      signup: 50,
      favorite: 5,
      unfavorite: -5,
      suggestion: 15,
      newsletter: 10,
      daily_visit: 2,
      share: 10,
      artist_submit: 20
    };
    VAULT_PASSPHRASE = process.env.VAULT_PASSPHRASE || "UndergroundLounge";
  }
});

// server/youtubeAnalytics.ts
var youtubeAnalytics_exports = {};
__export(youtubeAnalytics_exports, {
  exchangeCodeForTokens: () => exchangeCodeForTokens,
  getAnalyticsData: () => getAnalyticsData,
  getChannelStats: () => getChannelStats,
  getDashboardStats: () => getDashboardStats,
  getOAuthUrl: () => getOAuthUrl,
  getTopVideos: () => getTopVideos,
  isOAuthConfigured: () => isOAuthConfigured
});
import { eq as eq2 } from "drizzle-orm";
function getOAuthUrl() {
  const params = new URLSearchParams({
    client_id: YOUTUBE_CLIENT_ID,
    redirect_uri: YOUTUBE_REDIRECT_URI,
    response_type: "code",
    scope: SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent"
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
async function exchangeCodeForTokens(code) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
      redirect_uri: YOUTUBE_REDIRECT_URI
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code: ${error}`);
  }
  const data = await response.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1e3);
  const db = await getDb();
  if (db) {
    await db.delete(youtubeOAuthTokens);
    await db.insert(youtubeOAuthTokens).values({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
      scope: data.scope,
      tokenType: data.token_type
    });
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt
  };
}
async function clearOAuthTokens() {
  const db = await getDb();
  if (db) {
    await db.delete(youtubeOAuthTokens);
    console.log("[YouTube] Cleared revoked/invalid OAuth tokens");
  }
}
async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: YOUTUBE_CLIENT_ID,
        client_secret: YOUTUBE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      })
    });
    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(`[YouTube] Token refresh failed (${response.status}):`, errorBody);
      if (response.status === 400 || response.status === 401) {
        await clearOAuthTokens();
      }
      return null;
    }
    const data = await response.json();
    const expiresAt = new Date(Date.now() + data.expires_in * 1e3);
    const db = await getDb();
    if (db) {
      await db.update(youtubeOAuthTokens).set({
        accessToken: data.access_token,
        expiresAt
      }).where(eq2(youtubeOAuthTokens.refreshToken, refreshToken));
    }
    return data.access_token;
  } catch (error) {
    console.error("[YouTube] Token refresh error:", error);
    return null;
  }
}
async function getValidAccessToken() {
  const db = await getDb();
  if (!db) return null;
  const tokens = await db.select().from(youtubeOAuthTokens).limit(1);
  if (tokens.length === 0) {
    return null;
  }
  const token = tokens[0];
  if (new Date(token.expiresAt) < new Date(Date.now() + 5 * 60 * 1e3)) {
    return await refreshAccessToken(token.refreshToken);
  }
  return token.accessToken;
}
async function isOAuthConfigured() {
  const db = await getDb();
  if (!db) return false;
  const tokens = await db.select().from(youtubeOAuthTokens).limit(1);
  return tokens.length > 0;
}
async function getCachedData(key) {
  const db = await getDb();
  if (!db) return null;
  const cached = await db.select().from(youtubeAnalyticsCache).where(eq2(youtubeAnalyticsCache.metricKey, key)).limit(1);
  if (cached.length === 0) {
    return null;
  }
  const cacheAge = Date.now() - new Date(cached[0].cachedAt).getTime();
  if (cacheAge > CACHE_DURATION) {
    return null;
  }
  return cached[0].metricValue;
}
async function setCachedData(key, value) {
  const db = await getDb();
  if (!db) return;
  await db.insert(youtubeAnalyticsCache).values({
    metricKey: key,
    metricValue: value,
    cachedAt: /* @__PURE__ */ new Date()
  }).onConflictDoUpdate({
    target: youtubeAnalyticsCache.metricKey,
    set: {
      metricValue: value,
      cachedAt: /* @__PURE__ */ new Date()
    }
  });
}
async function getChannelStats(apiKey) {
  const cacheKey = "channel_stats";
  const cached = await getCachedData(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID2}&key=${apiKey}`
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
    videoCount: parseInt(stats.videoCount, 10)
  };
  await setCachedData(cacheKey, JSON.stringify(result));
  return result;
}
async function getTopVideos(apiKey, maxResults = 10) {
  const cacheKey = `top_videos_${maxResults}`;
  const cached = await getCachedData(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const channelResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID2}&key=${apiKey}`
  );
  if (!channelResponse.ok) {
    throw new Error("Failed to fetch channel details");
  }
  const channelData = await channelResponse.json();
  const uploadsPlaylistId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsPlaylistId) {
    throw new Error("Uploads playlist not found");
  }
  const playlistResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${apiKey}`
  );
  if (!playlistResponse.ok) {
    throw new Error("Failed to fetch playlist items");
  }
  const playlistData = await playlistResponse.json();
  const videoIds = playlistData.items?.map((item) => item.snippet.resourceId.videoId).join(",");
  if (!videoIds) {
    return [];
  }
  const videosResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics,snippet&id=${videoIds}&key=${apiKey}`
  );
  if (!videosResponse.ok) {
    throw new Error("Failed to fetch video statistics");
  }
  const videosData = await videosResponse.json();
  const videos = videosData.items?.map((video) => ({
    id: video.id,
    title: video.snippet.title,
    viewCount: parseInt(video.statistics.viewCount || "0", 10),
    likeCount: parseInt(video.statistics.likeCount || "0", 10),
    commentCount: parseInt(video.statistics.commentCount || "0", 10),
    thumbnail: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
    publishedAt: video.snippet.publishedAt
  })).sort((a, b) => b.viewCount - a.viewCount).slice(0, maxResults);
  await setCachedData(cacheKey, JSON.stringify(videos));
  return videos;
}
async function getAnalyticsData() {
  const accessToken = await getValidAccessToken();
  if (!accessToken) {
    return null;
  }
  const cacheKey = "analytics_data";
  const cached = await getCachedData(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  const endDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
  try {
    const metricsResponse = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${CHANNEL_ID2}&startDate=${startDate}&endDate=${endDate}&metrics=views,estimatedMinutesWatched,averageViewDuration,subscribersGained`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    if (!metricsResponse.ok) {
      console.error("Analytics API error:", await metricsResponse.text());
      return null;
    }
    const metricsData = await metricsResponse.json();
    const row = metricsData.rows?.[0] || [0, 0, 0, 0];
    const countriesResponse = await fetch(
      `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${CHANNEL_ID2}&startDate=${startDate}&endDate=${endDate}&metrics=views&dimensions=country&sort=-views&maxResults=10`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    let topCountries = [];
    if (countriesResponse.ok) {
      const countriesData = await countriesResponse.json();
      topCountries = (countriesData.rows || []).map((row2) => ({
        country: row2[0],
        views: row2[1]
      }));
    }
    const result = {
      views: row[0],
      watchTimeMinutes: row[1],
      averageViewDuration: row[2],
      subscribersGained: row[3],
      topCountries
    };
    await setCachedData(cacheKey, JSON.stringify(result));
    return result;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return null;
  }
}
async function getDashboardStats(apiKey) {
  const [channelStats, topVideos, analytics, isOAuthConnected] = await Promise.all([
    getChannelStats(apiKey),
    getTopVideos(apiKey, 10),
    getAnalyticsData().catch((err) => {
      console.error("[YouTube] Analytics fetch failed, falling back to public data only:", err);
      return null;
    }),
    isOAuthConfigured()
  ]);
  return {
    channelStats,
    topVideos,
    analytics,
    isOAuthConnected
  };
}
var YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI, SCOPES, CHANNEL_ID2, CACHE_DURATION;
var init_youtubeAnalytics = __esm({
  "server/youtubeAnalytics.ts"() {
    "use strict";
    init_db();
    init_schema();
    YOUTUBE_CLIENT_ID = process.env.YOUTUBE_CLIENT_ID ?? "";
    YOUTUBE_CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET ?? "";
    YOUTUBE_REDIRECT_URI = "https://psychedelic-universe.com/api/oauth/youtube/callback";
    SCOPES = [
      "https://www.googleapis.com/auth/yt-analytics.readonly",
      "https://www.googleapis.com/auth/youtube.readonly"
    ];
    CHANNEL_ID2 = "UCyRw5ZEQ2mVwNKq9GnSTHRA";
    CACHE_DURATION = 60 * 60 * 1e3;
  }
});

// server/vercel-api.ts
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/oauth.ts
init_db();

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
init_db();
init_env();
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";

// server/supabase.ts
import { createClient as createClient2 } from "@supabase/supabase-js";
var supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
var supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
var supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";
var supabaseAdmin = createClient2(supabaseUrl, supabaseServiceRoleKey);
var supabase = createClient2(supabaseUrl, supabaseAnonKey);

// server/_core/sdk.ts
var ONE_YEAR_MS2 = 1e3 * 60 * 60 * 24 * 365;
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var SDKServer = class {
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS2;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, name } = payload;
      if (!isNonEmptyString(openId)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        name: typeof name === "string" ? name : ""
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const sessionUserId = session.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const { data } = await supabaseAdmin.auth.admin.getUserById(sessionUserId);
        if (data?.user) {
          await upsertUser({
            openId: data.user.id,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || null,
            email: data.user.email ?? null,
            loginMethod: data.user.app_metadata?.provider ?? null,
            lastSignedIn: signedInAt
          });
          user = await getUserByOpenId(data.user.id);
        }
      } catch (error) {
        console.error("[Auth] Failed to sync user from Supabase:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/_core/oauth.ts
function getQueryParam(req, key) {
  const value = req.query[key];
  return typeof value === "string" ? value : void 0;
}
function registerOAuthRoutes(app2) {
  app2.get("/api/oauth/callback", async (req, res) => {
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
      await upsertUser({
        openId: user.id,
        name: user.user_metadata?.full_name || user.user_metadata?.name || null,
        email: user.email ?? null,
        loginMethod: user.app_metadata?.provider ?? null,
        lastSignedIn: /* @__PURE__ */ new Date()
      });
      const sessionToken = await sdk.createSessionToken(user.id, {
        name: user.user_metadata?.full_name || user.user_metadata?.name || "",
        expiresInMs: ONE_YEAR_MS
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

// server/routers.ts
import { z as z2 } from "zod";

// server/_core/systemRouter.ts
init_notification();
import { z } from "zod";

// server/_core/trpc.ts
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/youtube.ts
import axios from "axios";
var CHANNEL_ID = "UCyRw5ZEQ2mVwNKq9GnSTHRA";
async function searchChannelVideos(query, apiKey, maxResults = 10) {
  if (!query || query.trim().length < 2) {
    return [];
  }
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: CHANNEL_ID,
          q: query,
          type: "video",
          maxResults,
          order: "relevance",
          key: apiKey
        }
      }
    );
    return response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error("YouTube API search error:", error);
    throw new Error("Failed to search YouTube channel");
  }
}

// server/storage.ts
var BUCKET = "uploads";
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const key = relKey.replace(/^\/+/, "");
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  const { error } = await supabaseAdmin.storage.from(BUCKET).upload(key, blob, { contentType, upsert: true });
  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }
  const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(key);
  return { key, url: urlData.publicUrl };
}

// server/routers.ts
init_youtubeAnalytics();
init_db();
var categoryEnum = z2.enum(["progressive-psy", "psychedelic-trance", "goa-trance", "full-on"]);
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true
      };
    })
  }),
  // ============ MIXES ============
  mixes: router({
    // Public endpoints
    list: publicProcedure.query(() => getAllMixes()),
    byCategory: publicProcedure.input(z2.object({ category: categoryEnum })).query(({ input }) => getMixesByCategory(input.category)),
    featured: publicProcedure.query(() => getFeaturedMixes()),
    // Admin endpoints
    create: adminProcedure.input(z2.object({
      title: z2.string().min(1),
      youtubeId: z2.string().min(1),
      category: categoryEnum,
      description: z2.string().optional(),
      thumbnailUrl: z2.string().optional(),
      featured: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => createMix(input)),
    update: adminProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().min(1).optional(),
      youtubeId: z2.string().min(1).optional(),
      category: categoryEnum.optional(),
      description: z2.string().optional(),
      thumbnailUrl: z2.string().optional(),
      featured: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return updateMix(id, data);
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteMix(input.id))
  }),
  // ============ PARTNERS ============
  partners: router({
    // Public endpoints
    list: publicProcedure.query(() => getAllPartners()),
    active: publicProcedure.query(() => getActivePartners()),
    // Admin endpoints
    create: adminProcedure.input(z2.object({
      name: z2.string().min(1),
      logoUrl: z2.string().min(1),
      websiteUrl: z2.string().optional(),
      quote: z2.string().optional(),
      active: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => createPartner(input)),
    update: adminProcedure.input(z2.object({
      id: z2.number(),
      name: z2.string().min(1).optional(),
      logoUrl: z2.string().min(1).optional(),
      websiteUrl: z2.string().optional(),
      quote: z2.string().optional(),
      active: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return updatePartner(id, data);
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deletePartner(input.id))
  }),
  // ============ SETTINGS ============
  settings: router({
    // Public endpoints
    get: publicProcedure.input(z2.object({ key: z2.string() })).query(({ input }) => getSetting(input.key)),
    // Admin endpoints
    list: adminProcedure.query(() => getAllSettings()),
    upsert: adminProcedure.input(z2.object({
      key: z2.string().min(1),
      value: z2.string(),
      description: z2.string().optional()
    })).mutation(({ input }) => upsertSetting(input.key, input.value, input.description))
  }),
  // ============ YOUTUBE SEARCH ============
  youtube: router({
    search: publicProcedure.input(z2.object({
      query: z2.string().min(2).max(100),
      maxResults: z2.number().min(1).max(25).optional().default(10)
    })).query(async ({ input }) => {
      const apiKey = await getSetting("youtube_api_key");
      if (!apiKey) {
        throw new Error("YouTube API key not configured. Please add it in Admin Settings.");
      }
      return searchChannelVideos(input.query, apiKey, input.maxResults);
    })
  }),
  // ============ FILE UPLOAD ============
  upload: router({
    logo: adminProcedure.input(z2.object({
      fileName: z2.string(),
      fileData: z2.string(),
      // base64 encoded
      contentType: z2.string()
    })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.fileData, "base64");
      const timestamp2 = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const extension = input.fileName.split(".").pop() || "png";
      const key = `partners/${timestamp2}-${randomSuffix}.${extension}`;
      const result = await storagePut(key, buffer, input.contentType);
      return { url: result.url };
    })
  }),
  // ============ ARTISTS ============
  artists: router({
    // Public endpoints
    list: publicProcedure.query(() => getAllArtists()),
    featured: publicProcedure.query(() => getFeaturedArtists()),
    bySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(({ input }) => getArtistBySlug(input.slug)),
    // Admin endpoints
    create: adminProcedure.input(z2.object({
      name: z2.string().min(1),
      slug: z2.string().min(1),
      realName: z2.string().optional(),
      country: z2.string().optional(),
      primaryGenre: categoryEnum.optional(),
      bio: z2.string().optional(),
      imageUrl: z2.string().optional(),
      websiteUrl: z2.string().optional(),
      youtubeUrl: z2.string().optional(),
      soundcloudUrl: z2.string().optional(),
      spotifyUrl: z2.string().optional(),
      instagramUrl: z2.string().optional(),
      facebookUrl: z2.string().optional(),
      trackCount: z2.number().optional(),
      featured: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => createArtist(input)),
    update: adminProcedure.input(z2.object({
      id: z2.number(),
      name: z2.string().min(1).optional(),
      slug: z2.string().min(1).optional(),
      realName: z2.string().optional(),
      country: z2.string().optional(),
      primaryGenre: categoryEnum.optional(),
      bio: z2.string().optional(),
      imageUrl: z2.string().optional(),
      websiteUrl: z2.string().optional(),
      youtubeUrl: z2.string().optional(),
      soundcloudUrl: z2.string().optional(),
      spotifyUrl: z2.string().optional(),
      instagramUrl: z2.string().optional(),
      facebookUrl: z2.string().optional(),
      trackCount: z2.number().optional(),
      featured: z2.boolean().optional(),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => {
      const { id, ...data } = input;
      return updateArtist(id, data);
    }),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteArtist(input.id))
  }),
  // ============ SUBSCRIBERS ============
  subscribers: router({
    // Public endpoint for subscribing
    subscribe: publicProcedure.input(z2.object({ email: z2.string().email() })).mutation(({ input }) => addSubscriber(input.email)),
    // Admin endpoints
    list: adminProcedure.query(() => getAllSubscribers()),
    remove: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => removeSubscriber(input.id))
  }),
  // ============ NOTIFICATIONS ============
  notifications: router({
    // Public endpoints - anyone can view notifications
    recent: publicProcedure.input(z2.object({ limit: z2.number().min(1).max(50).optional().default(20) })).query(({ input }) => getRecentNotifications(input.limit)),
    unread: publicProcedure.query(() => getUnreadNotifications()),
    // Admin endpoints - only admin can create/manage notifications
    create: adminProcedure.input(z2.object({
      type: z2.enum(["upload", "comment"]),
      title: z2.string().min(1),
      message: z2.string().min(1),
      link: z2.string().optional(),
      username: z2.string().optional(),
      referenceId: z2.string().optional()
    })).mutation(({ input }) => createNotification(input)),
    markAsRead: publicProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => markNotificationAsRead(input.id)),
    markAllAsRead: publicProcedure.mutation(() => markAllNotificationsAsRead()),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteNotification(input.id))
  }),
  // ============ YOUTUBE ANALYTICS ============
  youtubeAnalytics: router({
    // Get OAuth URL for connecting YouTube account
    getOAuthUrl: adminProcedure.query(() => {
      return { url: getOAuthUrl() };
    }),
    // Check if OAuth is connected
    isConnected: publicProcedure.query(async () => {
      return { connected: await isOAuthConfigured() };
    }),
    // Get dashboard statistics
    getDashboardStats: publicProcedure.query(async () => {
      const apiKey = await getSetting("youtube_api_key");
      if (!apiKey) {
        throw new Error("YouTube API key not configured");
      }
      return getDashboardStats(apiKey);
    }),
    // Handle OAuth callback (exchange code for tokens)
    handleCallback: adminProcedure.input(z2.object({ code: z2.string() })).mutation(async ({ input }) => {
      await exchangeCodeForTokens(input.code);
      return { success: true };
    })
  }),
  // ============ SUGGESTIONS ============
  suggestions: router({
    // Public endpoint for submitting suggestions
    submit: publicProcedure.input(z2.object({
      name: z2.string().optional().default("Anonymous"),
      email: z2.string().email().optional(),
      category: z2.enum(["feature", "improvement", "content", "other"]).default("feature"),
      suggestion: z2.string().min(10, "Suggestion must be at least 10 characters")
    })).mutation(({ input }) => createSuggestion(input)),
    // Admin endpoints
    list: adminProcedure.query(() => getAllSuggestions()),
    updateStatus: adminProcedure.input(z2.object({
      id: z2.number(),
      status: z2.enum(["pending", "reviewed", "implemented", "declined"])
    })).mutation(({ input }) => updateSuggestionStatus(input.id, input.status)),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteSuggestion(input.id))
  }),
  // ============ KARMA ============
  karma: router({
    // Get current user's total karma
    myKarma: protectedProcedure.query(async ({ ctx }) => {
      const total = await getUserTotalKarma(ctx.user.id);
      return { totalKarma: total };
    }),
    // Get current user's karma history
    myHistory: protectedProcedure.input(z2.object({ limit: z2.number().min(1).max(50).optional().default(20) })).query(({ ctx, input }) => getUserKarmaHistory(ctx.user.id, input.limit)),
    // Get leaderboard
    leaderboard: publicProcedure.input(z2.object({ limit: z2.number().min(1).max(50).optional().default(20) })).query(({ input }) => getKarmaLeaderboard(input.limit)),
    // Record a daily visit (once per day)
    recordVisit: protectedProcedure.mutation(async ({ ctx }) => {
      const alreadyVisited = await hasEarnedKarmaToday(ctx.user.id, "daily_visit");
      if (alreadyVisited) {
        return { awarded: false, message: "Already earned daily visit karma" };
      }
      const result = await awardKarma(ctx.user.id, "daily_visit", "Daily site visit");
      return { awarded: true, ...result };
    }),
    // Record a share action
    recordShare: protectedProcedure.input(z2.object({ referenceId: z2.string().optional() })).mutation(async ({ ctx, input }) => {
      const result = await awardKarma(ctx.user.id, "share", "Shared content", input.referenceId);
      return result;
    })
  }),
  // ============ FAVORITES ============
  favorites: router({
    // Get current user's favorites
    list: protectedProcedure.query(({ ctx }) => getUserFavorites(ctx.user.id)),
    // Get current user's favorite IDs (for quick heart button state)
    ids: protectedProcedure.query(({ ctx }) => getUserFavoriteIds(ctx.user.id)),
    // Add a favorite
    add: protectedProcedure.input(z2.object({ mixId: z2.number() })).mutation(({ ctx, input }) => addFavorite(ctx.user.id, input.mixId)),
    // Remove a favorite
    remove: protectedProcedure.input(z2.object({ mixId: z2.number() })).mutation(({ ctx, input }) => removeFavorite(ctx.user.id, input.mixId))
  }),
  // ============ RONEN'S PICKS ============
  ronensPicks: router({
    // Public endpoint to view picks
    list: publicProcedure.query(() => getAllRonensPicks()),
    // Admin endpoints
    create: adminProcedure.input(z2.object({
      title: z2.string().min(1),
      youtubeId: z2.string().min(1),
      description: z2.string().optional(),
      thumbnailUrl: z2.string().optional(),
      contentType: z2.enum(["mix", "track"]).optional().default("mix"),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => createRonensPick(input)),
    delete: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteRonensPick(input.id))
  }),
  // ============ UNDERGROUND VAULT ============
  vault: router({
    // Check if user has vault access
    checkAccess: protectedProcedure.query(async ({ ctx }) => {
      const hasAccess = await checkVaultAccess(ctx.user.id);
      return { hasAccess };
    }),
    // Verify passphrase and grant access
    verify: protectedProcedure.input(z2.object({ passphrase: z2.string().min(1) })).mutation(async ({ ctx, input }) => {
      const granted = await verifyVaultPassphrase(ctx.user.id, input.passphrase);
      return { granted };
    }),
    // List vault mixes (only for users with access)
    listMixes: protectedProcedure.query(async ({ ctx }) => {
      const hasAccess = await checkVaultAccess(ctx.user.id);
      if (!hasAccess) return [];
      return getVaultMixes();
    }),
    // Admin: add a mix to the vault
    addMix: adminProcedure.input(z2.object({
      title: z2.string().min(1),
      youtubeId: z2.string().min(1),
      description: z2.string().optional(),
      duration: z2.string().optional(),
      sortOrder: z2.number().optional()
    })).mutation(({ input }) => createVaultMix(input)),
    // Admin: remove a mix from the vault
    removeMix: adminProcedure.input(z2.object({ id: z2.number() })).mutation(({ input }) => deleteVaultMix(input.id))
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/vercel-api.ts
init_db();
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.get("/api/health", async (_req, res) => {
  const info = { ok: true, timestamp: Date.now() };
  const url = process.env.DATABASE_URL;
  info.dbUrlSet = !!url;
  if (!url) {
    res.json({ ...info, dbError: "DATABASE_URL not set" });
    return;
  }
  const m = url.match(/^postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+?)(\?.*)?$/);
  if (m) {
    info.dbUser = m[1];
    info.dbHost = m[3];
    info.dbPort = Number(m[4]);
  }
  try {
    const db = await getDb();
    info.dbConnected = !!db;
    if (db) {
      const { sql: sqlTag } = await import("drizzle-orm");
      const result = await db.execute(sqlTag`SELECT COUNT(*) as cnt FROM mixes`);
      info.mixesCount = result[0]?.cnt ?? result.rows?.[0]?.cnt;
      res.json(info);
      return;
    }
  } catch (e) {
    info.primaryError = e.cause ? String(e.cause) : e.message;
  }
  let projectRef = null;
  if (m) {
    const directMatch = m[3].match(/^db\.([^.]+)\.supabase\.co$/);
    projectRef = directMatch ? directMatch[1] : null;
    if (projectRef) {
      const pg = await import("postgres");
      const pw = m[2];
      info.pwHasBrackets = pw.includes("[") || pw.includes("]");
      info.pwLen = pw.length;
      const attempts = [
        // Try the project hostname directly (no db. prefix) — REST API resolves here
        { host: `${projectRef}.supabase.co`, port: 6543, user: `postgres.${projectRef}` },
        { host: `${projectRef}.supabase.co`, port: 5432, user: "postgres" },
        // Try standard Supavisor pooler regions
        { host: "aws-0-us-east-1.pooler.supabase.com", port: 6543, user: `postgres.${projectRef}` },
        { host: "aws-0-eu-central-1.pooler.supabase.com", port: 6543, user: `postgres.${projectRef}` },
        { host: "aws-0-us-west-1.pooler.supabase.com", port: 6543, user: `postgres.${projectRef}` }
      ];
      const poolerErrors = [];
      for (const a of attempts) {
        try {
          const raw = pg.default({
            host: a.host,
            port: a.port,
            database: "postgres",
            username: a.user,
            password: pw,
            ssl: "require",
            max: 1,
            connect_timeout: 3
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
        } catch (pe) {
          const msg = pe.cause ? String(pe.cause) : pe.message;
          poolerErrors.push(`${a.user}@${a.host}:${a.port}: ${msg}`);
        }
      }
      info.poolerErrors = poolerErrors;
    }
  }
  const envKeys = Object.keys(process.env).filter(
    (k) => k.includes("SUPA") || k.includes("DB") || k.includes("DATA") || k.includes("PG") || k.includes("POSTGRES")
  );
  info.relatedEnvVars = envKeys;
  const supaUrl = process.env.SUPABASE_URL || (projectRef ? `https://${projectRef}.supabase.co` : "");
  const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (supaKey && supaUrl) {
    try {
      const restRes = await fetch(`${supaUrl}/rest/v1/mixes?select=id,title&limit=3`, {
        headers: {
          apikey: supaKey,
          Authorization: `Bearer ${supaKey}`
        }
      });
      info.restApiStatus = restRes.status;
      info.restKeyType = supaKey === process.env.SUPABASE_SERVICE_ROLE_KEY ? "service_role" : "anon";
      if (restRes.ok) {
        info.restData = await restRes.json();
        const cntRes = await fetch(`${supaUrl}/rest/v1/mixes?select=id&head=true`, {
          headers: {
            apikey: supaKey,
            Authorization: `Bearer ${supaKey}`,
            Prefer: "count=exact"
          },
          method: "HEAD"
        });
        info.restMixesCount = cntRes.headers.get("content-range");
      } else {
        info.restError = await restRes.text();
      }
    } catch (re) {
      info.restError = re.message;
    }
  }
  info.guidance = "DATABASE_URL cannot connect. Update DATABASE_URL in Vercel to use the Supabase pooler connection string from Dashboard > Settings > Database > Connection string (with pooler).";
  res.json(info);
});
registerOAuthRoutes(app);
app.get("/api/oauth/youtube/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send("Missing authorization code");
  }
  try {
    const { exchangeCodeForTokens: exchangeCodeForTokens2 } = await Promise.resolve().then(() => (init_youtubeAnalytics(), youtubeAnalytics_exports));
    await exchangeCodeForTokens2(code);
    res.redirect("/stats?connected=true");
  } catch (error) {
    console.error("YouTube OAuth error:", error);
    res.redirect("/stats?error=oauth_failed");
  }
});
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext
  })
);
var vercel_api_default = app;
export {
  vercel_api_default as default
};
