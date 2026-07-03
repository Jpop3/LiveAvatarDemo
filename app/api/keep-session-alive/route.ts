/**
 * Keeps a live session from timing out mid-conversation.
 * Called on an interval by the client while the session is active.
 */

const API_URL = process.env.LIVEAVATAR_API_URL || "https://api.liveavatar.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { session_token } = body;

    if (!session_token) {
      return new Response(
        JSON.stringify({ error: "session_token is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const res = await fetch(`${API_URL}/v1/sessions/keep-alive`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session_token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Error keeping session alive:", errorData);
      return new Response(
        JSON.stringify({
          error: errorData.data?.message || "Failed to keep session alive",
        }),
        { status: res.status, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error keeping session alive:", error);
    return new Response(
      JSON.stringify({ error: "Failed to keep session alive" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
