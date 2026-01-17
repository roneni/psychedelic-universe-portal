import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { searchChannelVideos } from "./youtube";
import { storagePut } from "./storage";
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
});

export type AppRouter = typeof appRouter;
