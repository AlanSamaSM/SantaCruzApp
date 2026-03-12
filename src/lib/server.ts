import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client (uses anon key but only in API routes).
 * We keep this separate to make it clear: LODGIFY_API_KEY never reaches the browser.
 */
export function getServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Generate a short, non-guessable access code.
 * Format: SCX-XXXXXX (6 alphanumeric chars, no ambiguous chars)
 */
export function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  let code = "SCX-";
  for (const b of bytes) {
    code += chars[b % chars.length];
  }
  return code;
}
