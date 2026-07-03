/**
 * Non-secret client-safe config.
 *
 * Only the API base URL is exposed to the browser (the SDK context needs it).
 * The API key and all avatar/voice/context IDs are read from process.env
 * inside the server-only route handlers (app/api/*) and are NEVER imported here.
 */

// Safe to expose. Falls back to the public LiveAvatar base URL.
export const API_URL =
  process.env.NEXT_PUBLIC_LIVEAVATAR_API_URL ||
  process.env.LIVEAVATAR_API_URL ||
  "https://api.liveavatar.com";

// The on-screen AI disclosure text. Persistent for the whole session.
export const DISCLOSURE_TEXT =
  "This is an AI version of Dr Brian Kaplan, made by Cochlear.";
