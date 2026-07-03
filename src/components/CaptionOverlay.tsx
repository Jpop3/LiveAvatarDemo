"use client";

import { useChatHistory, MessageSender } from "../liveavatar";

/**
 * Live subtitles.
 *
 * Reads the shared chat history (built from the avatar transcription events)
 * and renders the latest AVATAR message as a caption band across the lower
 * third of the video. Because captions come from the avatar's own transcription
 * (not a re-listen of the audio), clinical terms stay accurate.
 *
 * Render-and-discard: nothing is persisted here.
 */
export function CaptionOverlay() {
  const messages = useChatHistory();

  // Latest avatar utterance only.
  const latestAvatar = [...messages]
    .reverse()
    .find((m) => m.sender === MessageSender.AVATAR);

  if (!latestAvatar || !latestAvatar.message.trim()) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center px-4 pb-6">
      <p className="max-w-3xl rounded-lg bg-black/70 px-4 py-2 text-center text-base leading-relaxed text-white backdrop-blur-sm sm:text-lg">
        {latestAvatar.message}
      </p>
    </div>
  );
}
