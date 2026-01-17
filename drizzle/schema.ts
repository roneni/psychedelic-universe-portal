import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Mixes table - stores YouTube video mixes organized by category
 */
export const mixes = mysqlTable("mixes", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  youtubeId: varchar("youtubeId", { length: 20 }).notNull(),
  category: mysqlEnum("category", ["progressive-psy", "psychedelic-trance", "goa-trance", "full-on"]).notNull(),
  artist: varchar("artist", { length: 255 }),
  description: text("description"),
  thumbnailUrl: varchar("thumbnailUrl", { length: 500 }),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Mix = typeof mixes.$inferSelect;
export type InsertMix = typeof mixes.$inferInsert;

/**
 * Partners table - stores brand partner information for the carousel
 */
export const partners = mysqlTable("partners", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logoUrl: varchar("logoUrl", { length: 500 }).notNull(),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  quote: text("quote"),
  active: boolean("active").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Partner = typeof partners.$inferSelect;
export type InsertPartner = typeof partners.$inferInsert;

/**
 * Site Settings table - stores configurable site settings
 */
export const siteSettings = mysqlTable("site_settings", {
  id: int("id").autoincrement().primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: text("value"),
  description: varchar("description", { length: 255 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

/**
 * Newsletter Subscribers table - stores email subscribers
 */
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  active: boolean("active").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

/**
 * Artists table - stores featured artist profiles for the Artist Directory
 */
export const artists = mysqlTable("artists", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  realName: varchar("realName", { length: 255 }),
  country: varchar("country", { length: 100 }),
  primaryGenre: mysqlEnum("primaryGenre", ["progressive-psy", "psychedelic-trance", "goa-trance", "full-on"]),
  bio: text("bio"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  websiteUrl: varchar("websiteUrl", { length: 500 }),
  youtubeUrl: varchar("youtubeUrl", { length: 500 }),
  soundcloudUrl: varchar("soundcloudUrl", { length: 500 }),
  spotifyUrl: varchar("spotifyUrl", { length: 500 }),
  instagramUrl: varchar("instagramUrl", { length: 500 }),
  facebookUrl: varchar("facebookUrl", { length: 500 }),
  trackCount: int("trackCount").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Artist = typeof artists.$inferSelect;
export type InsertArtist = typeof artists.$inferInsert;
