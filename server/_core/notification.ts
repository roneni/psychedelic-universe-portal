export type NotificationPayload = {
  title: string;
  content: string;
};

/**
 * Stub notification service. Logs to console and returns false.
 */
export async function notifyOwner(
  payload: NotificationPayload
): Promise<boolean> {
  console.log("[Notification] (stub)", payload.title, payload.content);
  return false;
}
