import { eq, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, 
  mixes, InsertMix, Mix,
  partners, InsertPartner, Partner,
  siteSettings, InsertSiteSetting, SiteSetting,
  subscribers, InsertSubscriber, Subscriber,
  artists, InsertArtist, Artist,
  notifications, InsertNotification, Notification,
  suggestions, InsertSuggestion, Suggestion
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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

    await db.insert(users).values(values).onDuplicateKeyUpdate({
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
  await db.insert(siteSettings).values({ key, value, description }).onDuplicateKeyUpdate({
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
    // Check for duplicate entry error
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ER_DUP_ENTRY') {
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
