"use client";

import React, { useEffect, useRef } from "react";
import { SessionState } from "@heygen/liveavatar-web-sdk";
import { useSession, useVoiceChat } from "../liveavatar";
import { DisclosureOverlay } from "./DisclosureOverlay";
import { CaptionOverlay } from "./CaptionOverlay";

const KEEP_ALIVE_INTERVAL_MS = 30_000;

/**
 * The layered avatar stage:
 *   - <video> base layer (the WebRTC stream)
 *   - CaptionOverlay (live subtitles)
 *   - DisclosureOverlay (persistent AI disclosure + logo)
 *   - status pill + End button
 *
 * Auto-starts the session on mount, attaches the stream once ready, and runs
 * a keep-alive interval so the session doesn't drop mid-conversation.
 */
export function AvatarStage({
  onSessionStopped,
}: {
  onSessionStopped: () => void;
}) {
  const {
    sessionState,
    isStreamReady,
    connectionQuality,
    startSession,
    stopSession,
    keepAlive,
    attachElement,
  } = useSession();

  const { isAvatarTalking } = useVoiceChat();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Reset the UI when the session disconnects.
  useEffect(() => {
    if (sessionState === SessionState.DISCONNECTED) {
      onSessionStopped();
    }
  }, [sessionState, onSessionStopped]);

  // Auto-start once, when the session is inactive.
  useEffect(() => {
    if (sessionState === SessionState.INACTIVE) {
      startSession();
    }
  }, [startSession, sessionState]);

  // Attach the media stream to the <video> element once it's ready.
  useEffect(() => {
    if (isStreamReady && videoRef.current) {
      attachElement(videoRef.current);
    }
  }, [attachElement, isStreamReady]);

  // Keep the session alive on an interval while connected.
  useEffect(() => {
    if (sessionState !== SessionState.CONNECTED) return;
    const id = setInterval(() => {
      keepAlive().catch(() => {
        /* non-fatal — session may already be closing */
      });
    }, KEEP_ALIVE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [sessionState, keepAlive]);

  const connected = sessionState === SessionState.CONNECTED;

  const qualityColor =
    connectionQuality === "GOOD"
      ? "text-green-400"
      : connectionQuality === "BAD"
        ? "text-red-400"
        : "text-gray-400";

  return (
    <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`h-full w-full object-contain transition-opacity duration-500 ${
          connected ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Waiting state */}
      {!connected && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/70">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/70" />
          <p className="text-sm">Connecting to Dr Kaplan…</p>
        </div>
      )}

      {/* Persistent AI disclosure + logo (top-right) */}
      <DisclosureOverlay />

      {/* Live subtitles (bottom) */}
      <CaptionOverlay />

      {/* Status pill (top-left) */}
      <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-sm">
          <div
            className={`h-2 w-2 rounded-full ${
              connected
                ? isAvatarTalking
                  ? "animate-pulse bg-purple-400"
                  : "bg-green-400"
                : sessionState === SessionState.CONNECTING
                  ? "animate-pulse bg-yellow-400"
                  : "bg-gray-500"
            }`}
          />
          <span className="text-xs font-medium uppercase tracking-wider text-white/70">
            {connected ? (isAvatarTalking ? "Speaking" : "Live") : sessionState}
          </span>
        </div>
        {connected && (
          <span
            className={`rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm ${qualityColor}`}
          >
            {connectionQuality}
          </span>
        )}
      </div>

      {/* End button (bottom-right) */}
      <button
        onClick={() => stopSession()}
        className="absolute bottom-3 right-3 z-20 rounded-lg bg-red-500/80 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-red-500"
      >
        End
      </button>
    </div>
  );
}
