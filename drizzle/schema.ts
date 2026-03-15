import { serial, pgTable, pgEnum, text, timestamp, varchar, boolean, integer } from "drizzle-orm/pg-core";

/**
 * PostgreSQL enums
 */
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const mixCategoryEnum = pgEnum("mix_category", ["progressive-psy", "psychedelic-trance", "goa-trance", "full-on"]);
export const notificationTypeEnum = pgEnum("notification_type", ["upload", "comment"]);
export const suggestionCategoryEnum = pgEnum("suggestion_category", ["feature", "improvement", "content", "other"]);
export const suggestionStatusEnum = pgEnum("suggestion_status", ["pending", "reviewed", "implemented", "declined"]);
export const karmaActionEnum = pgEnum("karma_action", [
  "signup",
  "favorite",
  "unfavorite",
  "suggestion",
  "newsletter",
  "daily_visit",
  "share",
  "artist_submit",
]);
export const contentTypeEnum = pgEnum("content_type", ["mix", "track"]);
export const festivalSubmissionStatusEnum = pgEnum("festival_submission_status", ["pending", "approved", "rejected", "featured"]);

/**
 * Core user table backing auth flow.
 */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  /** OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Mixes table - stores YouTube video mixes organized by category
 */
export const mixes = pgTable("mixes", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Mix = typeof mixes.$inferSelect;
export type InsertMix = typeof mixes.$inferInsert;

/**
 * Partners table - stores brand partner information for the carousel
 */
export const partners = pgTable("partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 500 }).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  quote: text("quote"),
  active: boolean("active").default(true).notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

/**
 * Site Settings table - stores configurable site settings
 */
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  description: varchar("description", { length: 255 }),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Newsletter Subscribers table - stores email subscribers
 */
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  active: boolean("active").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

/**
 * Artists table - stores featured artist profiles for the Artist Directory
 */
export const artists = pgTable("artists", {
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
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;


/**
 * Notifications table - stores in-site notifications for uploads and comments
 */
export const notifications = pgTable("notifications", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;


/**
 * YouTube OAuth Tokens table - stores OAuth credentials for YouTube Analytics API
 * Only one row should exist (for the channel owner)
 */
export const youtubeOAuthTokens = pgTable("youtube_oauth_tokens", {
  id: serial("id").primaryKey(),
  accessToken: text("accessToken").notNull(),
  refreshToken: text("refreshToken").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  scope: text("scope"),
  tokenType: varchar("tokenType", { length: 50 }).default("Bearer"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type YouTubeOAuthToken = typeof youtubeOAuthTokens.$inferSelect;
export type InsertYouTubeOAuthToken = typeof youtubeOAuthTokens.$inferInsert;

/**
 * YouTube Analytics Cache table - caches analytics data to reduce API calls
 */
export const youtubeAnalyticsCache = pgTable("youtube_analytics_cache", {
  id: serial("id").primaryKey(),
  metricKey: varchar("metricKey", { length: 100 }).notNull().unique(),
  metricValue: text("metricValue").notNull(),
  cachedAt: timestamp("cachedAt").defaultNow().notNull(),
});

export type YouTubeAnalyticsCache = typeof youtubeAnalyticsCache.$inferSelect;
export type InsertYouTubeAnalyticsCache = typeof youtubeAnalyticsCache.$inferInsert;


/**
 * Suggestions table - stores user suggestions for site improvements
 */
export const suggestions = pgTable("suggestions", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).default("Anonymous").notNull(),
  email: varchar("email", { length: 320 }),
  category: suggestionCategoryEnum("category").default("feature").notNull(),
  suggestion: text("suggestion").notNull(),
  status: suggestionStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Suggestion = typeof suggestions.$inferSelect;
export type InsertSuggestion = typeof suggestions.$inferInsert;


/**
 * Karma Points table - tracks user karma and engagement rewards
 */
export const karmaPoints = pgTable("karma_points", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  action: karmaActionEnum("action").notNull(),
  points: integer("points").notNull(),
  description: varchar("description", { length: 255 }),
  referenceId: varchar("referenceId", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type KarmaPoint = typeof karmaPoints.$inferSelect;
export type InsertKarmaPoint = typeof karmaPoints.$inferInsert;

/**
 * User Favorites table - stores user's favorited mixes/tracks
 */
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  mixId: integer("mixId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Favorite = typeof favorites.$inferSelect;
export type InsertFavorite = typeof favorites.$inferInsert;

/**
 * Ronen's Picks - curated personal favorites from the channel owner
 */
export const ronensPicks = pgTable("ronens_picks", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  youtubeId: varchar("youtubeId", { length: 20 }).notNull(),
  description: text("description"),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  contentType: contentTypeEnum("contentType").default("mix").notNull(),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RonensPick = typeof ronensPicks.$inferSelect;
export type InsertRonensPick = typeof ronensPicks.$inferInsert;


/**
 * Vault Access table - tracks which users have unlocked the Underground Vault
 */
export const vaultAccess = pgTable("vault_access", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
});

export type VaultAccess = typeof vaultAccess.$inferSelect;
export type InsertVaultAccess = typeof vaultAccess.$inferInsert;

/**
 * Vault Mixes table - stores exclusive mixes for the Underground Vault
 */
export const vaultMixes = pgTable("vault_mixes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  youtubeId: varchar("youtubeId", { length: 20 }).notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 20 }),
  sortOrder: integer("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type VaultMix = typeof vaultMixes.$inferSelect;
export type InsertVaultMix = typeof vaultMixes.$inferInsert;

/**
 * Festival Submissions table - stores user-submitted festivals for review
 */
export const festivalSubmissions = pgTable("festival_submissions", {
  id: serial("id").primaryKey(),
  festivalName: varchar("festivalName", { length: 255 }).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  contactName: varchar("contactName", { length: 255 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  locationName: varchar("locationName", { length: 255 }).notNull(),
  locationCountry: varchar("locationCountry", { length: 100 }).notNull(),
  startDate: varchar("startDate", { length: 20 }).notNull(),
  endDate: varchar("endDate", { length: 20 }).notNull(),
  genres: text("genres").notNull(),
  description: text("description").notNull(),
  lineup: text("lineup"),
  logoUrl: varchar("logoUrl", { length: 500 }),
  photo1Url: varchar("photo1Url", { length: 500 }),
  photo2Url: varchar("photo2Url", { length: 500 }),
  photo3Url: varchar("photo3Url", { length: 500 }),
  facebookUrl: varchar("facebookUrl", { length: 500 }),
  instagramUrl: varchar("instagramUrl", { length: 500 }),
  ticketUrl: varchar("ticketUrl", { length: 500 }),
  status: festivalSubmissionStatusEnum("status").default("pending").notNull(),
  adminNotes: text("adminNotes"),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type FestivalSubmission = typeof festivalSubmissions.$inferSelect;
export type InsertFestivalSubmission = typeof festivalSubmissions.$inferInsert;
