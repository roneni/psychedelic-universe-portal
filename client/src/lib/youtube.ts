const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "AIzaSyATfNbtD_0hwWt49smGHA9ki4Kb_GGaXJU";
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || "UCyRw5ZEQ2mVwNKq9GnSTHRA";

export async function getChannelStats() {
  if (!API_KEY) {
    console.warn("YouTube API Key is missing. Using simulation mode.");
    return null;
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch YouTube stats");
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return {
        subscriberCount: parseInt(data.items[0].statistics.subscriberCount),
        videoCount: parseInt(data.items[0].statistics.videoCount),
        viewCount: parseInt(data.items[0].statistics.viewCount)
      };
    }
    return null;
  } catch (error) {
    console.error("YouTube API Error:", error);
    return null;
  }
}
