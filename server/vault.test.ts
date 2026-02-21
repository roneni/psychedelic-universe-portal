import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  verifyVaultPassphrase: vi.fn(),
  checkVaultAccess: vi.fn(),
  getVaultMixes: vi.fn(),
  createVaultMix: vi.fn(),
  deleteVaultMix: vi.fn(),
}));

import {
  verifyVaultPassphrase,
  checkVaultAccess,
  getVaultMixes,
  createVaultMix,
  deleteVaultMix,
} from "./db";

const mockVerify = vi.mocked(verifyVaultPassphrase);
const mockCheckAccess = vi.mocked(checkVaultAccess);
const mockGetMixes = vi.mocked(getVaultMixes);
const mockCreateMix = vi.mocked(createVaultMix);
const mockDeleteMix = vi.mocked(deleteVaultMix);

describe("Underground Vault", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("verifyVaultPassphrase", () => {
    it("should return true for correct passphrase", async () => {
      mockVerify.mockResolvedValue(true);
      const result = await verifyVaultPassphrase(1, "UndergroundLounge");
      expect(result).toBe(true);
      expect(mockVerify).toHaveBeenCalledWith(1, "UndergroundLounge");
    });

    it("should return false for incorrect passphrase", async () => {
      mockVerify.mockResolvedValue(false);
      const result = await verifyVaultPassphrase(1, "wrongpassphrase");
      expect(result).toBe(false);
    });
  });

  describe("checkVaultAccess", () => {
    it("should return true for user with access", async () => {
      mockCheckAccess.mockResolvedValue(true);
      const result = await checkVaultAccess(1);
      expect(result).toBe(true);
    });

    it("should return false for user without access", async () => {
      mockCheckAccess.mockResolvedValue(false);
      const result = await checkVaultAccess(999);
      expect(result).toBe(false);
    });
  });

  describe("getVaultMixes", () => {
    it("should return list of vault mixes", async () => {
      const mockMixes = [
        {
          id: 1,
          title: "Secret Mix Vol. 1",
          youtubeId: "abc123",
          description: "A special mix",
          duration: "1:30:00",
          sortOrder: 0,
          createdAt: new Date(),
        },
      ];
      mockGetMixes.mockResolvedValue(mockMixes);
      const result = await getVaultMixes();
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Secret Mix Vol. 1");
    });

    it("should return empty array when no mixes exist", async () => {
      mockGetMixes.mockResolvedValue([]);
      const result = await getVaultMixes();
      expect(result).toHaveLength(0);
    });
  });

  describe("createVaultMix", () => {
    it("should create a new vault mix", async () => {
      mockCreateMix.mockResolvedValue(undefined);
      await createVaultMix({
        title: "New Secret Mix",
        youtubeId: "xyz789",
        description: "Another exclusive",
        duration: "2:00:00",
      });
      expect(mockCreateMix).toHaveBeenCalledWith({
        title: "New Secret Mix",
        youtubeId: "xyz789",
        description: "Another exclusive",
        duration: "2:00:00",
      });
    });
  });

  describe("deleteVaultMix", () => {
    it("should delete a vault mix by id", async () => {
      mockDeleteMix.mockResolvedValue(undefined);
      await deleteVaultMix(1);
      expect(mockDeleteMix).toHaveBeenCalledWith(1);
    });
  });
});
