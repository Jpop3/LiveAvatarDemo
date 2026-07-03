import { NextRequest } from "next/server";

/**
 * Mints a FULL-mode LiveAvatar session token.
 *
 * FULL mode = HeyGen runs ASR + LLM (GPT-4o-mini) + TTS + avatar.
 * Brian's persona/guardrails/Q&A bind here via avatar_persona.context_id.
 *
 * All secrets are read from server-side env vars. The API key never leaves
 * this handler.
 */

const API_URL = process.env.LIVEAVATAR_API_URL || "https://api.liveavatar.com";
const API_KEY = process.env.LIVEAVATAR_API_KEY;
const AVATAR_ID = process.env.BRIAN_AVATAR_ID;
const VOICE_ID = process.env.BRIAN_VOICE_ID;
const CONTEXT_ID = process.env.BRIAN_CONTEXT_ID;
const IS_SANDBOX = process.env.LIVEAVATAR_SANDBOX === "true";

interface StartSessionRequestBody {
  pushToTalk?: boolean;
}

export async function POST(request: NextRequest) {
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: "LIVEAVATAR_API_KEY is not set in the environment." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let session_token = "";
  let session_id = "";

  try {
    const body: StartSessionRequestBody = await request.json().catch(() => ({}));
    const pushToTalk = body.pushToTalk === true;

    const res = await fetch(`${API_URL}/v1/sessions/token`, {
      method: "POST",
      headers: {
        "X-API-KEY": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mode: "FULL",
        avatar_id: AVATAR_ID,
        avatar_persona: {
          voice_id: VOICE_ID,
          context_id: CONTEXT_ID,
          language: "en",
        },
        ...(pushToTalk && { interactivity_type: "PUSH_TO_TALK" }),
        is_sandbox: IS_SANDBOX,
      }),
    });

    if (!res.ok) {
      const contentType = res.headers.get("content-type");
      let errorMessage = "Failed to retrieve session token";
      if (contentType && contentType.includes("application/json")) {
        try {
          const resp = await res.json();
          if (resp.data && resp.data.length > 0 && resp.data[0].message) {
            errorMessage = resp.data[0].message;
          } else if (resp.error) {
            errorMessage = resp.error;
          } else if (resp.message) {
            errorMessage = resp.message;
          }
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
      } else {
        const text = await res.text();
        errorMessage = text || errorMessage;
      }
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await res.json();
    // Response shape: data.data.session_token / data.data.session_id
    session_token = data.data.session_token;
    session_id = data.data.session_id;
  } catch (error) {
    console.error("Error retrieving session token:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!session_token) {
    return new Response(
      JSON.stringify({ error: "Failed to retrieve session token" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  return new Response(JSON.stringify({ session_token, session_id }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
