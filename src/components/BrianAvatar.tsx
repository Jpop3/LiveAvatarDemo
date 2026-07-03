"use client";

import { useState } from "react";
import { LiveAvatarContextProvider } from "../liveavatar";
import { AvatarStage } from "./AvatarStage";
import { DISCLOSURE_TEXT } from "../config";

/**
 * Top-level demo component.
 *
 *   Start screen  ->  fetch FULL-mode token  ->  mount AvatarStage in provider
 *
 * Full Mode only. Voice chat is on so the presenter/audience can speak to the
 * avatar; HeyGen handles ASR + LLM + TTS behind the session.
 */
export function BrianAvatar() {
  const [sessionToken, setSessionToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/start-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pushToTalk: false }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error || "Failed to start session.");
        return;
      }
      const { session_token } = await res.json();
      setSessionToken(session_token);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleStopped = () => {
    setSessionToken("");
  };

  if (sessionToken) {
    return (
      <LiveAvatarContextProvider
        sessionAccessToken={sessionToken}
        voiceChatConfig={true}
      >
        <AvatarStage onSessionStopped={handleStopped} />
      </LiveAvatarContextProvider>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Dr Brian Kaplan
        </h1>
        <p className="mt-1 text-sm text-gray-400">{DISCLOSURE_TEXT}</p>
      </div>

      {error && (
        <div className="w-full rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full rounded-lg bg-white px-6 py-3 text-base font-medium text-black transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Starting…" : "Start conversation"}
      </button>

      <p className="text-xs text-gray-500">
        You&apos;ll be asked to allow microphone access so you can speak with the
        avatar.
      </p>
    </div>
  );
}
