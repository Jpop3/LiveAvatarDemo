"use client";

import { DISCLOSURE_TEXT } from "../config";

/**
 * Persistent AI-disclosure overlay.
 *
 * Always on, for the entire session. This is the mandatory AI-disclosure
 * guardrail rendered visually and continuously — it does not depend on the
 * avatar saying anything. Sits above the video; never blocks interaction.
 *
 * Cochlear logo: drop a transparent-background file at /public/cochlear-logo.svg
 * and it renders next to the disclosure text. If the file is missing the text
 * still shows on its own.
 */
export function DisclosureOverlay() {
  return (
    <div className="pointer-events-none absolute top-3 right-3 z-20 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 backdrop-blur-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cochlear-logo.svg"
        alt="Cochlear"
        className="h-4 w-auto"
        onError={(e) => {
          // Hide the img if the asset isn't present yet.
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      <span className="text-[11px] font-medium leading-tight text-white/90 sm:text-xs">
        {DISCLOSURE_TEXT}
      </span>
    </div>
  );
}
