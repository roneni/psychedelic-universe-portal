import { COOKIE_NAME } from "../shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { searchChannelVideos } from "./youtube";
import { storagePut } from "./storage";
import {
  getOAuthUrl,
  exchangeCodeForTokens,
  getDashboardStats,
  isOAuthConfigured,
} from "./youtubeAnalytics";
import {
  getAllMixes,
  getMixesByCategory,
  getFeaturedMixes,
  createMix,
  updateMix,
  deleteMix,
  getAllPartners,
  getActivePartners,
  createPartner,
  updatePartner,
  deletePartner,
  getAllSettings,
  getSetting,
  upsertSetting,
  getAllSubscribers,
  addSubscriber,
  removeSubscriber,
  getAllArtists,
  getFeaturedArtists,
  getArtistBySlug,
  createArtist,
  updateArtist,
  deleteArtist,
  getRecentNotifications,
  getUnreadNotifications,
  createNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getAllSuggestions,
  createSuggestion,
  updateSuggestionStatus,
  deleteSuggestion,
  awardKarma,
  getUserTotalKarma,
  getUserKarmaHistory,
  getKarmaLeaderboard,
  hasEarnedKarmaToday,
  getUserFavorites,
  addFavorite,
  removeFavorite,
  getUserFavoriteIds,
  getAllRonensPicks,
  createRonensPick,
  deleteRonensPick,
  verifyVaultPassphrase,
  checkVaultAccess,
  getVaultMixes,
  createVaultMix,
  deleteVaultMix,
} from "./db";

const categoryEnum = z.enum(["progressive-psy", "psychedelic-trance", "goa-trance", "full-on"]);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ MIXES ============
  mixes: router({
    // Public endpoints
    list: publicProcedure.query(() => getAllMixes()),
    byCategory: publicProcedure
      .input(z.object({ category: categoryEnum }))
      .query(({ input }) => getMixesByCategory(input.category)),
    featured: publicProcedure.query(() => getFeaturedMixes()),

    // Admin endpoints
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        youtubeId: z.string().min(1),
        category: categoryEnum,
        description: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        featured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => createMix(input)),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        youtubeId: z.string().min(1).optional(),
        category: categoryEnum.optional(),
        description: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        featured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateMix(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteMix(input.id)),
  }),

  // ============ PARTNERS ============
  partners: router({
    // Public endpoints
    list: publicProcedure.query(() => getAllPartners()),
    active: publicProcedure.query(() => getActivePartners()),

    // Admin endpoints
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        logoUrl: z.string().min(1),
        websiteUrl: z.string().optional(),
        quote: z.string().optional(),
        active: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => createPartner(input)),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        logoUrl: z.string().min(1).optional(),
        websiteUrl: z.string().optional(),
        quote: z.string().optional(),
        active: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updatePartner(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deletePartner(input.id)),
  }),

  // ============ SETTINGS ============
  settings: router({
    // Public endpoints
    get: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => getSetting(input.key)),

    // Admin endpoints
    list: adminProcedure.query(() => getAllSettings()),
    
    upsert: adminProcedure
      .input(z.object({
        key: z.string().min(1),
        value: z.string(),
        description: z.string().optional(),
      }))
      .mutation(({ input }) => upsertSetting(input.key, input.value, input.description)),
  }),

  // ============ YOUTUBE SEARCH ============
  youtube: router({
    search: publicProcedure
      .input(z.object({
        query: z.string().min(2).max(100),
        maxResults: z.number().min(1).max(25).optional().default(10),
      }))
      .query(async ({ input }) => {
        // Get API key from settings or environment
        const apiKey = await getSetting("youtube_api_key");
        if (!apiKey) {
          throw new Error("YouTube API key not configured. Please add it in Admin Settings.");
        }
        return searchChannelVideos(input.query, apiKey, input.maxResults);
      }),
  }),

  // ============ FILE UPLOAD ============
  upload: router({
    logo: adminProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        contentType: z.string(),
      }))
      .mutation(async ({ input }) => {
        // Decode base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");
        // Generate unique filename
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        const extension = input.fileName.split(".").pop() || "png";
        const key = `partners/${timestamp}-${randomSuffix}.${extension}`;
        // Upload to S3
        const result = await storagePut(key, buffer, input.contentType);
        return { url: result.url };
      }),
  }),

  // ============ ARTISTS ============
  artists: router({
    // Public endpoints
    list: publicProcedure.query(() => getAllArtists()),
    featured: publicProcedure.query(() => getFeaturedArtists()),
    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ input }) => getArtistBySlug(input.slug)),

    // Admin endpoints
    create: adminProcedure
      .input(z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        realName: z.string().optional(),
        country: z.string().optional(),
        primaryGenre: categoryEnum.optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        soundcloudUrl: z.string().optional(),
        spotifyUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        facebookUrl: z.string().optional(),
        trackCount: z.number().optional(),
        featured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => createArtist(input)),

    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        realName: z.string().optional(),
        country: z.string().optional(),
        primaryGenre: categoryEnum.optional(),
        bio: z.string().optional(),
        imageUrl: z.string().optional(),
        websiteUrl: z.string().optional(),
        youtubeUrl: z.string().optional(),
        soundcloudUrl: z.string().optional(),
        spotifyUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        facebookUrl: z.string().optional(),
        trackCount: z.number().optional(),
        featured: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateArtist(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteArtist(input.id)),
  }),

  // ============ SUBSCRIBERS ============
  subscribers: router({
    // Public endpoint for subscribing
    subscribe: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(({ input }) => addSubscriber(input.email)),

    // Admin endpoints
    list: adminProcedure.query(() => getAllSubscribers()),
    
    remove: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => removeSubscriber(input.id)),
  }),

  // ============ NOTIFICATIONS ============
  notifications: router({
    // Public endpoints - anyone can view notifications
    recent: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(20) }))
      .query(({ input }) => getRecentNotifications(input.limit)),
    
    unread: publicProcedure.query(() => getUnreadNotifications()),

    // Admin endpoints - only admin can create/manage notifications
    create: adminProcedure
      .input(z.object({
        type: z.enum(["upload", "comment"]),
        title: z.string().min(1),
        message: z.string().min(1),
        link: z.string().optional(),
        username: z.string().optional(),
        referenceId: z.string().optional(),
      }))
      .mutation(({ input }) => createNotification(input)),

    markAsRead: publicProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => markNotificationAsRead(input.id)),

    markAllAsRead: publicProcedure
      .mutation(() => markAllNotificationsAsRead()),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteNotification(input.id)),
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
        return {
          channelStats: { subscriberCount: 0, viewCount: 0, videoCount: 0 },
          topVideos: [],
          analytics: null,
          isOAuthConnected: false,
        };
      }
      return getDashboardStats(apiKey);
    }),

    // Handle OAuth callback (exchange code for tokens)
    handleCallback: adminProcedure
      .input(z.object({ code: z.string() }))
      .mutation(async ({ input }) => {
        await exchangeCodeForTokens(input.code);
        return { success: true };
      }),
  }),

  // ============ SUGGESTIONS ============
  suggestions: router({
    // Public endpoint for submitting suggestions
    submit: publicProcedure
      .input(z.object({
        name: z.string().optional().default("Anonymous"),
        email: z.string().email().optional(),
        category: z.enum(["feature", "improvement", "content", "other"]).default("feature"),
        suggestion: z.string().min(10, "Suggestion must be at least 10 characters"),
      }))
      .mutation(({ input }) => createSuggestion(input)),

    // Admin endpoints
    list: adminProcedure.query(() => getAllSuggestions()),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "reviewed", "implemented", "declined"]),
      }))
      .mutation(({ input }) => updateSuggestionStatus(input.id, input.status)),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteSuggestion(input.id)),
  }),

  // ============ KARMA ============
  karma: router({
    // Get current user's total karma
    myKarma: protectedProcedure.query(async ({ ctx }) => {
      const total = await getUserTotalKarma(ctx.user.id);
      return { totalKarma: total };
    }),

    // Get current user's karma history
    myHistory: protectedProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(20) }))
      .query(({ ctx, input }) => getUserKarmaHistory(ctx.user.id, input.limit)),

    // Get leaderboard
    leaderboard: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).optional().default(20) }))
      .query(({ input }) => getKarmaLeaderboard(input.limit)),

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
    recordShare: protectedProcedure
      .input(z.object({ referenceId: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const result = await awardKarma(ctx.user.id, "share", "Shared content", input.referenceId);
        return result;
      }),
  }),

  // ============ FAVORITES ============
  favorites: router({
    // Get current user's favorites
    list: protectedProcedure.query(({ ctx }) => getUserFavorites(ctx.user.id)),

    // Get current user's favorite IDs (for quick heart button state)
    ids: protectedProcedure.query(({ ctx }) => getUserFavoriteIds(ctx.user.id)),

    // Add a favorite
    add: protectedProcedure
      .input(z.object({ mixId: z.number() }))
      .mutation(({ ctx, input }) => addFavorite(ctx.user.id, input.mixId)),

    // Remove a favorite
    remove: protectedProcedure
      .input(z.object({ mixId: z.number() }))
      .mutation(({ ctx, input }) => removeFavorite(ctx.user.id, input.mixId)),
  }),

  // ============ RONEN'S PICKS ============
  ronensPicks: router({
    // Public endpoint to view picks
    list: publicProcedure.query(() => getAllRonensPicks()),

    // Admin endpoints
    create: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        youtubeId: z.string().min(1),
        description: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        contentType: z.enum(["mix", "track"]).optional().default("mix"),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => createRonensPick(input)),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteRonensPick(input.id)),
  }),

  // ============ UNDERGROUND VAULT ============
  vault: router({
    // Check if user has vault access
    checkAccess: protectedProcedure.query(async ({ ctx }) => {
      const hasAccess = await checkVaultAccess(ctx.user.id);
      return { hasAccess };
    }),

    // Verify passphrase and grant access
    verify: protectedProcedure
      .input(z.object({ passphrase: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
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
    addMix: adminProcedure
      .input(z.object({
        title: z.string().min(1),
        youtubeId: z.string().min(1),
        description: z.string().optional(),
        duration: z.string().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(({ input }) => createVaultMix(input)),

    // Admin: remove a mix from the vault
    removeMix: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteVaultMix(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
