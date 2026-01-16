import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Import after mocking
import { searchChannelVideos, getVideoDetails } from "./youtube";

describe("YouTube Search Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("searchChannelVideos", () => {
    it("returns empty array for queries shorter than 2 characters", async () => {
      const result = await searchChannelVideos("a", "test-api-key");
      expect(result).toEqual([]);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("returns empty array for empty query", async () => {
      const result = await searchChannelVideos("", "test-api-key");
      expect(result).toEqual([]);
      expect(axios.get).not.toHaveBeenCalled();
    });

    it("calls YouTube API with correct parameters", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: { videoId: "abc123" },
              snippet: {
                title: "Astrix - Deep Jungle Walk",
                publishedAt: "2024-01-15T10:00:00Z",
                thumbnails: {
                  medium: { url: "https://img.youtube.com/vi/abc123/mqdefault.jpg" },
                  default: { url: "https://img.youtube.com/vi/abc123/default.jpg" },
                },
              },
            },
          ],
          pageInfo: { totalResults: 1, resultsPerPage: 10 },
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await searchChannelVideos("Astrix", "test-api-key", 10);

      expect(axios.get).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            channelId: "UCyRw5ZEQ2mVwNKq9GnSTHRA",
            q: "Astrix",
            type: "video",
            maxResults: 10,
            order: "relevance",
            key: "test-api-key",
          },
        }
      );

      expect(result).toEqual([
        {
          id: "abc123",
          title: "Astrix - Deep Jungle Walk",
          thumbnail: "https://img.youtube.com/vi/abc123/mqdefault.jpg",
          publishedAt: "2024-01-15T10:00:00Z",
        },
      ]);
    });

    it("returns multiple results correctly", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: { videoId: "video1" },
              snippet: {
                title: "Liquid Soul - Anahata",
                publishedAt: "2024-01-10T10:00:00Z",
                thumbnails: {
                  medium: { url: "https://img.youtube.com/vi/video1/mqdefault.jpg" },
                  default: { url: "https://img.youtube.com/vi/video1/default.jpg" },
                },
              },
            },
            {
              id: { videoId: "video2" },
              snippet: {
                title: "Liquid Soul - Devotion",
                publishedAt: "2024-01-05T10:00:00Z",
                thumbnails: {
                  medium: { url: "https://img.youtube.com/vi/video2/mqdefault.jpg" },
                  default: { url: "https://img.youtube.com/vi/video2/default.jpg" },
                },
              },
            },
          ],
          pageInfo: { totalResults: 2, resultsPerPage: 10 },
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await searchChannelVideos("Liquid Soul", "test-api-key");

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Liquid Soul - Anahata");
      expect(result[1].title).toBe("Liquid Soul - Devotion");
    });

    it("uses default thumbnail when medium is not available", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: { videoId: "video1" },
              snippet: {
                title: "Test Video",
                publishedAt: "2024-01-10T10:00:00Z",
                thumbnails: {
                  default: { url: "https://img.youtube.com/vi/video1/default.jpg" },
                },
              },
            },
          ],
          pageInfo: { totalResults: 1, resultsPerPage: 10 },
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await searchChannelVideos("Test", "test-api-key");

      expect(result[0].thumbnail).toBe("https://img.youtube.com/vi/video1/default.jpg");
    });

    it("throws error when API call fails", async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error("API Error"));

      await expect(searchChannelVideos("Astrix", "test-api-key")).rejects.toThrow(
        "Failed to search YouTube channel"
      );
    });

    it("respects maxResults parameter", async () => {
      const mockResponse = {
        data: {
          items: [],
          pageInfo: { totalResults: 0, resultsPerPage: 5 },
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      await searchChannelVideos("test", "test-api-key", 5);

      expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          params: expect.objectContaining({
            maxResults: 5,
          }),
        })
      );
    });
  });

  describe("getVideoDetails", () => {
    it("returns video details for valid video ID", async () => {
      const mockResponse = {
        data: {
          items: [
            {
              id: "abc123",
              snippet: {
                title: "Infected Mushroom - Becoming Insane",
                publishedAt: "2023-06-15T10:00:00Z",
                thumbnails: {
                  medium: { url: "https://img.youtube.com/vi/abc123/mqdefault.jpg" },
                  default: { url: "https://img.youtube.com/vi/abc123/default.jpg" },
                },
              },
            },
          ],
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await getVideoDetails("abc123", "test-api-key");

      expect(axios.get).toHaveBeenCalledWith(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet",
            id: "abc123",
            key: "test-api-key",
          },
        }
      );

      expect(result).toEqual({
        id: "abc123",
        title: "Infected Mushroom - Becoming Insane",
        thumbnail: "https://img.youtube.com/vi/abc123/mqdefault.jpg",
        publishedAt: "2023-06-15T10:00:00Z",
      });
    });

    it("returns null for non-existent video", async () => {
      const mockResponse = {
        data: {
          items: [],
        },
      };

      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      const result = await getVideoDetails("nonexistent", "test-api-key");

      expect(result).toBeNull();
    });

    it("returns null when API call fails", async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error("API Error"));

      const result = await getVideoDetails("abc123", "test-api-key");

      expect(result).toBeNull();
    });
  });
});
