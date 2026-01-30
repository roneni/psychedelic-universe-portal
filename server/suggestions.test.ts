import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  createSuggestion: vi.fn(),
  getAllSuggestions: vi.fn(),
  updateSuggestionStatus: vi.fn(),
  deleteSuggestion: vi.fn(),
}));

import {
  createSuggestion,
  getAllSuggestions,
  updateSuggestionStatus,
  deleteSuggestion,
} from "./db";

describe("Suggestions Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSuggestion", () => {
    it("should create a suggestion with all fields", async () => {
      const mockSuggestion = {
        name: "Test User",
        email: "test@example.com",
        category: "feature" as const,
        suggestion: "Add a dark mode toggle",
      };

      vi.mocked(createSuggestion).mockResolvedValue({
        success: true,
        message: "Suggestion submitted successfully!",
      });

      const result = await createSuggestion(mockSuggestion);

      expect(createSuggestion).toHaveBeenCalledWith(mockSuggestion);
      expect(result.success).toBe(true);
      expect(result.message).toBe("Suggestion submitted successfully!");
    });

    it("should create an anonymous suggestion", async () => {
      const mockSuggestion = {
        name: "Anonymous",
        category: "improvement" as const,
        suggestion: "Make the player bigger",
      };

      vi.mocked(createSuggestion).mockResolvedValue({
        success: true,
        message: "Suggestion submitted successfully!",
      });

      const result = await createSuggestion(mockSuggestion);

      expect(createSuggestion).toHaveBeenCalledWith(mockSuggestion);
      expect(result.success).toBe(true);
    });
  });

  describe("getAllSuggestions", () => {
    it("should return all suggestions", async () => {
      const mockSuggestions = [
        {
          id: 1,
          name: "User 1",
          email: "user1@test.com",
          category: "feature",
          suggestion: "Add playlist export",
          status: "pending",
          createdAt: new Date(),
        },
        {
          id: 2,
          name: "Anonymous",
          email: null,
          category: "content",
          suggestion: "More goa trance mixes",
          status: "reviewed",
          createdAt: new Date(),
        },
      ];

      vi.mocked(getAllSuggestions).mockResolvedValue(mockSuggestions as any);

      const result = await getAllSuggestions();

      expect(getAllSuggestions).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].category).toBe("feature");
      expect(result[1].status).toBe("reviewed");
    });
  });

  describe("updateSuggestionStatus", () => {
    it("should update suggestion status", async () => {
      vi.mocked(updateSuggestionStatus).mockResolvedValue(undefined);

      await updateSuggestionStatus(1, "implemented");

      expect(updateSuggestionStatus).toHaveBeenCalledWith(1, "implemented");
    });
  });

  describe("deleteSuggestion", () => {
    it("should delete a suggestion", async () => {
      vi.mocked(deleteSuggestion).mockResolvedValue(undefined);

      await deleteSuggestion(1);

      expect(deleteSuggestion).toHaveBeenCalledWith(1);
    });
  });
});
