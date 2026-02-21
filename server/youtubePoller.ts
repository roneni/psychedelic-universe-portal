import axios from "axios";
import { getSetting, upsertSetting, createNotification } from "./db";
import { notifyOwner } from "./_core/notification";

const CHANNEL_ID = "UCyRw5ZEQ2mVwNKq9GnSTHRA";
const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
}

/**
 * Fetch the latest videos from the Psychedelic Universe YouTube channel
 */
async function fetchLatestVideos(apiKey: string, maxResults: number = 5): Promise<YouTubeVideo[]> {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          channelId: CHANNEL_ID,
          type: "video",
          order: "date",
          maxResults,
          key: apiKey,
        },
      }
    );

    return response.data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error("[YouTubePoller] Failed to fetch latest videos:", error);
    return [];
  }
}

/**
 * Check for new uploads and create notifications
 */
async function checkForNewUploads(): Promise<void> {
  const apiKey = await getSetting("youtube_api_key");
  if (!apiKey) {
    // Silently skip if no API key configured
    return;
  }

  const lastCheckedVideoId = await getSetting("youtube_last_checked_video_id");
  const videos = await fetchLatestVideos(apiKey);

  if (videos.length === 0) return;

  // If this is the first run, just save the latest video ID without creating notifications
  if (!lastCheckedVideoId) {
    await upsertSetting(
      "youtube_last_checked_video_id",
      videos[0].id,
      "Last checked YouTube video ID for polling"
    );
    console.log("[YouTubePoller] Initialized with latest video:", videos[0].title);
    return;
  }

  // Find new videos (those that appear before the last checked ID)
  const newVideos: YouTubeVideo[] = [];
  for (const video of videos) {
    if (video.id === lastCheckedVideoId) break;
    newVideos.push(video);
  }

  if (newVideos.length === 0) return;

  console.log(`[YouTubePoller] Found ${newVideos.length} new video(s)`);

  // Create in-site notifications for each new video
  for (const video of newVideos.reverse()) {
    try {
      await createNotification({
        type: "upload",
        title: `New Upload: ${video.title}`,
        message: `A new track has been published on Psychedelic Universe!`,
        link: `https://www.youtube.com/watch?v=${video.id}`,
        referenceId: video.id,
      });

      // Also notify the owner via notification service
      try {
        await notifyOwner({
          title: `New YouTube Upload Detected`,
          content: `Video: ${video.title}\nLink: https://www.youtube.com/watch?v=${video.id}\nPublished: ${video.publishedAt}`,
        });
      } catch (notifyErr) {
        console.warn("[YouTubePoller] Owner notification failed:", notifyErr);
      }

      console.log(`[YouTubePoller] Created notification for: ${video.title}`);
    } catch (err) {
      console.error(`[YouTubePoller] Failed to create notification for ${video.title}:`, err);
    }
  }

  // Update the last checked video ID
  await upsertSetting(
    "youtube_last_checked_video_id",
    videos[0].id,
    "Last checked YouTube video ID for polling"
  );
}

let pollingInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start the YouTube polling service
 */
export function startYouTubePoller(): void {
  console.log("[YouTubePoller] Starting YouTube upload polling (every 5 minutes)");

  // Run immediately on start
  checkForNewUploads().catch((err) =>
    console.error("[YouTubePoller] Initial check failed:", err)
  );

  // Then poll every 5 minutes
  pollingInterval = setInterval(() => {
    checkForNewUploads().catch((err) =>
      console.error("[YouTubePoller] Poll failed:", err)
    );
  }, POLL_INTERVAL_MS);
}

/**
 * Stop the YouTube polling service
 */
export function stopYouTubePoller(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("[YouTubePoller] Stopped polling");
  }
}
