import axios from "axios";

// Psychedelic Universe channel ID
const CHANNEL_ID = "UCyRw5ZEQ2mVwNKq9GnSTHRA";

interface YouTubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

interface YouTubeAPIResponse {
  items: Array<{
    id: {
      kind: string;
      videoId: string;
    };
    snippet: {
      title: string;
      description: string;
      publishedAt: string;
      thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
      };
    };
  }>;
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

/**
 * Search videos on the Psychedelic Universe YouTube channel
 * @param query - Search query (artist name, track name, etc.)
 * @param apiKey - YouTube Data API key
 * @param maxResults - Maximum number of results to return (default: 10)
 */
export async function searchChannelVideos(
  query: string,
  apiKey: string,
  maxResults: number = 10
): Promise<YouTubeSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const response = await axios.get<YouTubeAPIResponse>(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: CHANNEL_ID,
          q: query,
          type: "video",
          maxResults,
          order: "relevance",
          key: apiKey,
        },
      }
    );

    return response.data.items.map((item) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("YouTube API search error:", error);
    throw new Error("Failed to search YouTube channel");
  }
}

/**
 * Get video details by ID
 */
export async function getVideoDetails(
  videoId: string,
  apiKey: string
): Promise<YouTubeSearchResult | null> {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: apiKey,
        },
      }
    );

    if (response.data.items.length === 0) {
      return null;
    }

    const item = response.data.items[0];
    return {
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
    };
  } catch (error) {
    console.error("YouTube API video details error:", error);
    return null;
  }
}
