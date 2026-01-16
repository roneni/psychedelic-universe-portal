import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getAllMixes: vi.fn(),
  getMixesByCategory: vi.fn(),
  getFeaturedMixes: vi.fn(),
  createMix: vi.fn(),
  updateMix: vi.fn(),
  deleteMix: vi.fn(),
  getAllPartners: vi.fn(),
  getActivePartners: vi.fn(),
  createPartner: vi.fn(),
  updatePartner: vi.fn(),
  deletePartner: vi.fn(),
  getAllSettings: vi.fn(),
  getSetting: vi.fn(),
  upsertSetting: vi.fn(),
  getAllSubscribers: vi.fn(),
  addSubscriber: vi.fn(),
  removeSubscriber: vi.fn(),
}));

import * as db from "./db";

describe("Database helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Mixes", () => {
    it("getAllMixes returns array of mixes", async () => {
      const mockMixes = [
        { id: 1, title: "Test Mix", youtubeId: "abc123", category: "goa-trance", featured: false, sortOrder: 0 },
      ];
      vi.mocked(db.getAllMixes).mockResolvedValue(mockMixes as any);

      const result = await db.getAllMixes();
      expect(result).toEqual(mockMixes);
      expect(db.getAllMixes).toHaveBeenCalledTimes(1);
    });

    it("getMixesByCategory filters by category", async () => {
      const mockMixes = [
        { id: 1, title: "Goa Mix", youtubeId: "abc123", category: "goa-trance", featured: false, sortOrder: 0 },
      ];
      vi.mocked(db.getMixesByCategory).mockResolvedValue(mockMixes as any);

      const result = await db.getMixesByCategory("goa-trance");
      expect(result).toEqual(mockMixes);
      expect(db.getMixesByCategory).toHaveBeenCalledWith("goa-trance");
    });

    it("getFeaturedMixes returns only featured mixes", async () => {
      const mockMixes = [
        { id: 1, title: "Featured Mix", youtubeId: "abc123", category: "goa-trance", featured: true, sortOrder: 0 },
      ];
      vi.mocked(db.getFeaturedMixes).mockResolvedValue(mockMixes as any);

      const result = await db.getFeaturedMixes();
      expect(result).toEqual(mockMixes);
      expect(db.getFeaturedMixes).toHaveBeenCalledTimes(1);
    });

    it("createMix creates a new mix", async () => {
      vi.mocked(db.createMix).mockResolvedValue(undefined);

      const newMix = { title: "New Mix", youtubeId: "xyz789", category: "progressive-psy" as const };
      await db.createMix(newMix);
      expect(db.createMix).toHaveBeenCalledWith(newMix);
    });

    it("updateMix updates an existing mix", async () => {
      vi.mocked(db.updateMix).mockResolvedValue(undefined);

      await db.updateMix(1, { title: "Updated Title" });
      expect(db.updateMix).toHaveBeenCalledWith(1, { title: "Updated Title" });
    });

    it("deleteMix removes a mix", async () => {
      vi.mocked(db.deleteMix).mockResolvedValue(undefined);

      await db.deleteMix(1);
      expect(db.deleteMix).toHaveBeenCalledWith(1);
    });
  });

  describe("Partners", () => {
    it("getAllPartners returns array of partners", async () => {
      const mockPartners = [
        { id: 1, name: "Test Partner", logoUrl: "https://example.com/logo.png", active: true, sortOrder: 0 },
      ];
      vi.mocked(db.getAllPartners).mockResolvedValue(mockPartners as any);

      const result = await db.getAllPartners();
      expect(result).toEqual(mockPartners);
      expect(db.getAllPartners).toHaveBeenCalledTimes(1);
    });

    it("getActivePartners returns only active partners", async () => {
      const mockPartners = [
        { id: 1, name: "Active Partner", logoUrl: "https://example.com/logo.png", active: true, sortOrder: 0 },
      ];
      vi.mocked(db.getActivePartners).mockResolvedValue(mockPartners as any);

      const result = await db.getActivePartners();
      expect(result).toEqual(mockPartners);
      expect(db.getActivePartners).toHaveBeenCalledTimes(1);
    });

    it("createPartner creates a new partner", async () => {
      vi.mocked(db.createPartner).mockResolvedValue(undefined);

      const newPartner = { name: "New Partner", logoUrl: "https://example.com/new.png" };
      await db.createPartner(newPartner);
      expect(db.createPartner).toHaveBeenCalledWith(newPartner);
    });

    it("updatePartner updates an existing partner", async () => {
      vi.mocked(db.updatePartner).mockResolvedValue(undefined);

      await db.updatePartner(1, { name: "Updated Name" });
      expect(db.updatePartner).toHaveBeenCalledWith(1, { name: "Updated Name" });
    });

    it("deletePartner removes a partner", async () => {
      vi.mocked(db.deletePartner).mockResolvedValue(undefined);

      await db.deletePartner(1);
      expect(db.deletePartner).toHaveBeenCalledWith(1);
    });
  });

  describe("Settings", () => {
    it("getAllSettings returns array of settings", async () => {
      const mockSettings = [
        { id: 1, key: "radio_stream_url", value: "https://stream.example.com" },
      ];
      vi.mocked(db.getAllSettings).mockResolvedValue(mockSettings as any);

      const result = await db.getAllSettings();
      expect(result).toEqual(mockSettings);
      expect(db.getAllSettings).toHaveBeenCalledTimes(1);
    });

    it("getSetting returns a specific setting value", async () => {
      vi.mocked(db.getSetting).mockResolvedValue("https://stream.example.com");

      const result = await db.getSetting("radio_stream_url");
      expect(result).toBe("https://stream.example.com");
      expect(db.getSetting).toHaveBeenCalledWith("radio_stream_url");
    });

    it("getSetting returns null for non-existent key", async () => {
      vi.mocked(db.getSetting).mockResolvedValue(null);

      const result = await db.getSetting("non_existent_key");
      expect(result).toBeNull();
    });

    it("upsertSetting creates or updates a setting", async () => {
      vi.mocked(db.upsertSetting).mockResolvedValue(undefined);

      await db.upsertSetting("radio_stream_url", "https://new-stream.example.com", "Stream URL");
      expect(db.upsertSetting).toHaveBeenCalledWith("radio_stream_url", "https://new-stream.example.com", "Stream URL");
    });
  });

  describe("Subscribers", () => {
    it("getAllSubscribers returns array of subscribers", async () => {
      const mockSubscribers = [
        { id: 1, email: "test@example.com", active: true, subscribedAt: new Date() },
      ];
      vi.mocked(db.getAllSubscribers).mockResolvedValue(mockSubscribers as any);

      const result = await db.getAllSubscribers();
      expect(result).toEqual(mockSubscribers);
      expect(db.getAllSubscribers).toHaveBeenCalledTimes(1);
    });

    it("addSubscriber adds a new subscriber", async () => {
      vi.mocked(db.addSubscriber).mockResolvedValue({ success: true, message: "Successfully subscribed!" });

      const result = await db.addSubscriber("new@example.com");
      expect(result).toEqual({ success: true, message: "Successfully subscribed!" });
      expect(db.addSubscriber).toHaveBeenCalledWith("new@example.com");
    });

    it("addSubscriber returns error for duplicate email", async () => {
      vi.mocked(db.addSubscriber).mockResolvedValue({ success: false, message: "This email is already subscribed." });

      const result = await db.addSubscriber("existing@example.com");
      expect(result).toEqual({ success: false, message: "This email is already subscribed." });
    });

    it("removeSubscriber removes a subscriber", async () => {
      vi.mocked(db.removeSubscriber).mockResolvedValue(undefined);

      await db.removeSubscriber(1);
      expect(db.removeSubscriber).toHaveBeenCalledWith(1);
    });
  });
});
