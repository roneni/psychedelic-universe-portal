import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

/** Admin client for server-side operations (uses service role key) */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

/** Public client for auth verification (uses anon key) */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
