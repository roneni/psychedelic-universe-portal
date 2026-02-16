
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, desc, asc, and, sql } from "drizzle-orm";
import {
  InsertUser, users,
  mixes, InsertMix, Mix,
  partners, InsertPartner, Partner,
  siteSettings, InsertSiteSetting, SiteSetting,
  subscribers, InsertSubscriber, Subscriber,
  artists, InsertArtist, Artist,
  notifications, InsertNotification, Notification,
  suggestions, InsertSuggestion, Suggestion,
  karmaPoints, InsertKarmaPoint, KarmaPoint,
  favorites, InsertFavorite, Favorite,
  ronensPicks, InsertRonensPick, RonensPick
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

/** Parse a PostgreSQL URL into individual parts. Handles passwords with special chars like brackets. */
function parseDbUrl(url: string) {
  const m = url.match(/^postgresql:\/\/([^:]+):(.+)@([^:]+):(\d+)\/(.+?)(\?.*)?$/);
  if (!m) return null;
  return { user: m[1], password: m[2], host: m[3], port: Number(m[4]), database: m[5] };
}

/** Build a postgres.js connection using the DATABASE_URL with parsed individual params. */
function createClient(url: string) {
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
      ssl: useSSL ? "require" as any : false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  // Fallback: pass URL directly
  return postgres(url, {
    ssl: useSSL ? "require" as any : false,
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============ MIXES ============

export async function getAllMixes(): Promise<Mix[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mixes).orderBy(asc(mixes.sortOrder), desc(mixes.createdAt));
}

export async function getMixesByCategory(category: Mix["category"]): Promise<Mix[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mixes).where(eq(mixes.category, category)).orderBy(asc(mixes.sortOrder));
}

export async function getFeaturedMixes(): Promise<Mix[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(mixes).where(eq(mixes.featured, true)).orderBy(asc(mixes.sortOrder));
}

export async function createMix(mix: InsertMix): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(mixes).values(mix);
}

export async function updateMix(id: number, mix: Partial<InsertMix>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(mixes).set(mix).where(eq(mixes.id, id));
}

export async function deleteMix(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(mixes).where(eq(mixes.id, id));
}

// ============ PARTNERS ============

export async function getAllPartners(): Promise<Partner[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).orderBy(asc(partners.sortOrder));
}

export async function getActivePartners(): Promise<Partner[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(partners).where(eq(partners.active, true)).orderBy(asc(partners.sortOrder));
}

export async function createPartner(partner: InsertPartner): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(partners).values(partner);
}

export async function updatePartner(id: number, partner: Partial<InsertPartner>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(partners).set(partner).where(eq(partners.id, id));
}

export async function deletePartner(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(partners).where(eq(partners.id, id));
}

// ============ SITE SETTINGS ============

export async function getAllSettings(): Promise<SiteSetting[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(siteSettings);
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(siteSettings).where(eq(siteSettings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : null;
}

export async function upsertSetting(key: string, value: string, description?: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(siteSettings).values({ key, value, description }).onConflictDoUpdate({
    target: siteSettings.key,
    set: { value, description },
  });
}

// ============ SUBSCRIBERS ============

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscribers).orderBy(desc(subscribers.subscribedAt));
}

export async function addSubscriber(email: string): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    await db.insert(subscribers).values({ email });

    // Send notification to owner about new subscriber
    try {
      const { notifyOwner } = await import('./_core/notification');
      await notifyOwner({
        title: 'New Newsletter Subscriber!',
        content: `A new user has subscribed to the Psychedelic Universe newsletter: ${email}`
      });
    } catch (notifyError) {
      // Don't fail the subscription if notification fails
      console.warn('[Newsletter] Failed to notify owner:', notifyError);
    }

    return { success: true, message: "Successfully subscribed!" };
  } catch (error: unknown) {
    // Check for duplicate entry error (PostgreSQL unique violation)
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      return { success: false, message: "This email is already subscribed." };
    }
    throw error;
  }
}

export async function removeSubscriber(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(subscribers).where(eq(subscribers.id, id));
}

// ============ ARTISTS ============

export async function getAllArtists(): Promise<Artist[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artists).orderBy(asc(artists.sortOrder), desc(artists.trackCount));
}

export async function getFeaturedArtists(): Promise<Artist[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(artists).where(eq(artists.featured, true)).orderBy(asc(artists.sortOrder));
}

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(artists).where(eq(artists.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createArtist(artist: InsertArtist): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(artists).values(artist);
}

export async function updateArtist(id: number, artist: Partial<InsertArtist>): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(artists).set(artist).where(eq(artists.id, id));
}

export async function deleteArtist(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(artists).where(eq(artists.id, id));
}


// ============ NOTIFICATIONS ============

export async function getRecentNotifications(limit: number = 20): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).orderBy(desc(notifications.createdAt)).limit(limit);
}

export async function getUnreadNotifications(): Promise<Notification[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notifications).where(eq(notifications.read, false)).orderBy(desc(notifications.createdAt));
}

export async function createNotification(notification: InsertNotification): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(notifications).values(notification);
}

export async function markNotificationAsRead(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ read: true }).where(eq(notifications.id, id));
}

export async function markAllNotificationsAsRead(): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(notifications).set({ read: true }).where(eq(notifications.read, false));
}

export async function deleteNotification(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(notifications).where(eq(notifications.id, id));
}


// ============ SUGGESTIONS ============

export async function getAllSuggestions(): Promise<Suggestion[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(suggestions).orderBy(desc(suggestions.createdAt));
}

export async function createSuggestion(suggestion: InsertSuggestion): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    await db.insert(suggestions).values(suggestion);

    // Send notification to owner about new suggestion
    try {
      const { notifyOwner } = await import('./_core/notification');
      await notifyOwner({
        title: 'New Site Suggestion!',
        content: `Category: ${suggestion.category}\nFrom: ${suggestion.name}${suggestion.email ? ` (${suggestion.email})` : ''}\n\nSuggestion:\n${suggestion.suggestion}`
      });
    } catch (notifyError) {
      console.warn('[Suggestions] Failed to notify owner:', notifyError);
    }

    return { success: true, message: "Suggestion submitted successfully!" };
  } catch (error) {
    console.error('[Suggestions] Failed to create suggestion:', error);
    throw error;
  }
}

export async function updateSuggestionStatus(id: number, status: Suggestion["status"]): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(suggestions).set({ status }).where(eq(suggestions.id, id));
}

export async function deleteSuggestion(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(suggestions).where(eq(suggestions.id, id));
}


// ============ KARMA POINTS ============

const KARMA_VALUES: Record<string, number> = {
  signup: 50,
  favorite: 5,
  unfavorite: -5,
  suggestion: 15,
  newsletter: 10,
  daily_visit: 2,
  share: 10,
  artist_submit: 20,
};

export async function awardKarma(
  userId: number,
  action: InsertKarmaPoint["action"],
  description?: string,
  referenceId?: string
): Promise<{ points: number; totalKarma: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const points = KARMA_VALUES[action] || 0;

  await db.insert(karmaPoints).values({
    userId,
    action,
    points,
    description,
    referenceId,
  });

  const totalKarma = await getUserTotalKarma(userId);
  return { points, totalKarma };
}

export async function getUserTotalKarma(userId: number): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select({ total: sql<number>`COALESCE(SUM(${karmaPoints.points}), 0)` })
    .from(karmaPoints)
    .where(eq(karmaPoints.userId, userId));

  return result[0]?.total || 0;
}

export async function getUserKarmaHistory(userId: number, limit: number = 20): Promise<KarmaPoint[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(karmaPoints)
    .where(eq(karmaPoints.userId, userId))
    .orderBy(desc(karmaPoints.createdAt))
    .limit(limit);
}

export async function getKarmaLeaderboard(limit: number = 20): Promise<Array<{ userId: number; name: string | null; totalKarma: number }>> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({
      userId: karmaPoints.userId,
      name: users.name,
      totalKarma: sql<number>`COALESCE(SUM(${karmaPoints.points}), 0)`,
    })
    .from(karmaPoints)
    .leftJoin(users, eq(karmaPoints.userId, users.id))
    .groupBy(karmaPoints.userId, users.name)
    .orderBy(sql`COALESCE(SUM(${karmaPoints.points}), 0) DESC`)
    .limit(limit);

  return result.map(r => ({
    userId: r.userId,
    name: r.name,
    totalKarma: Number(r.totalKarma),
  }));
}

export async function hasEarnedKarmaToday(userId: number, action: string): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(karmaPoints)
    .where(
      and(
        eq(karmaPoints.userId, userId),
        eq(karmaPoints.action, action as InsertKarmaPoint["action"]),
        sql`DATE(${karmaPoints.createdAt}) = CURRENT_DATE`
      )
    );

  return (result[0]?.count || 0) > 0;
}

// ============ FAVORITES ============

export async function getUserFavorites(userId: number): Promise<Array<Favorite & { mix?: Mix }>> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select()
    .from(favorites)
    .leftJoin(mixes, eq(favorites.mixId, mixes.id))
    .where(eq(favorites.userId, userId))
    .orderBy(desc(favorites.createdAt));

  return result.map(r => ({
    ...r.favorites,
    mix: r.mixes || undefined,
  }));
}

export async function addFavorite(userId: number, mixId: number): Promise<{ success: boolean; message: string }> {
  const db = await getDb();
  if (!db) return { success: false, message: "Database not available" };

  try {
    // Check if already favorited
    const existing = await db
      .select()
      .from(favorites)
      .where(and(eq(favorites.userId, userId), eq(favorites.mixId, mixId)))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, message: "Already in favorites" };
    }

    await db.insert(favorites).values({ userId, mixId });

    // Award karma for favoriting
    await awardKarma(userId, "favorite", "Favorited a mix", String(mixId));

    return { success: true, message: "Added to favorites!" };
  } catch (error) {
    console.error("[Favorites] Failed to add favorite:", error);
    throw error;
  }
}

export async function removeFavorite(userId: number, mixId: number): Promise<{ success: boolean }> {
  const db = await getDb();
  if (!db) return { success: false };

  await db
    .delete(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.mixId, mixId)));

  // Deduct karma for unfavoriting
  await awardKarma(userId, "unfavorite", "Removed a favorite", String(mixId));

  return { success: true };
}

export async function isFavorited(userId: number, mixId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.mixId, mixId)));

  return (result[0]?.count || 0) > 0;
}

export async function getUserFavoriteIds(userId: number): Promise<number[]> {
  const db = await getDb();
  if (!db) return [];

  const result = await db
    .select({ mixId: favorites.mixId })
    .from(favorites)
    .where(eq(favorites.userId, userId));

  return result.map(r => r.mixId);
}

// ============ RONEN'S PICKS ============

export async function getAllRonensPicks(): Promise<RonensPick[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(ronensPicks).orderBy(asc(ronensPicks.sortOrder), desc(ronensPicks.createdAt));
}

export async function createRonensPick(pick: InsertRonensPick): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(ronensPicks).values(pick);
}

export async function deleteRonensPick(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(ronensPicks).where(eq(ronensPicks.id, id));
}


// ============ VAULT ============

import { vaultAccess, vaultMixes, VaultMix } from "../drizzle/schema";

const VAULT_PASSPHRASE = process.env.VAULT_PASSPHRASE || "UndergroundLounge";

export async function verifyVaultPassphrase(userId: number, passphrase: string): Promise<boolean> {
  if (passphrase.toLowerCase().trim() !== VAULT_PASSPHRASE.toLowerCase().trim()) {
    return false;
  }

  const db = await getDb();
  if (!db) return false;

  // Check if already has access
  const existing = await db
    .select()
    .from(vaultAccess)
    .where(eq(vaultAccess.userId, userId))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(vaultAccess).values({ userId });
  }

  return true;
}

export async function checkVaultAccess(userId: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select()
    .from(vaultAccess)
    .where(eq(vaultAccess.userId, userId))
    .limit(1);

  return result.length > 0;
}

export async function getVaultMixes(): Promise<VaultMix[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(vaultMixes).orderBy(asc(vaultMixes.sortOrder), desc(vaultMixes.createdAt));
}

export async function createVaultMix(mix: { title: string; youtubeId: string; description?: string; duration?: string; sortOrder?: number }): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(vaultMixes).values(mix);
}

export async function deleteVaultMix(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(vaultMixes).where(eq(vaultMixes.id, id));
}
