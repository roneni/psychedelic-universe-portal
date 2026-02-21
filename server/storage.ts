import { supabaseAdmin } from "./supabase";

const BUCKET = "uploads";

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const blob =
    typeof data === "string"
      ? new Blob([data], { type: contentType })
      : new Blob([data as any], { type: contentType });

  const { error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(key, blob, { contentType, upsert: true });

  if (error) {
    throw new Error(`Storage upload failed: ${error.message}`);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(key);

  return { key, url: urlData.publicUrl };
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const { data } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(key);

  return { key, url: data.publicUrl };
}
