# Brian LiveAvatar — Demo

A private, presenter-driven web app that streams the Brian Kaplan LiveAvatar in
real time, shows live subtitles, and carries a persistent on-screen AI-disclosure
overlay. Built on HeyGen **Full Mode** (HeyGen runs ASR + LLM + voice + avatar).

## Prerequisites

- Node.js 18+ and **pnpm** (or npm — swap the commands below)
- A LiveAvatar account + API key (https://app.liveavatar.com)
- Brian's avatar created & approved, plus his voice ID and Context ID

## Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Fill in secrets. `.env.local` already exists with TODO placeholders —
   replace each `TODO_...` value:

   - `LIVEAVATAR_API_KEY` — from the LiveAvatar Developers page
   - `BRIAN_AVATAR_ID` — Brian's approved avatar (or a public sample ID to test)
   - `BRIAN_VOICE_ID` — Brian's voice
   - `BRIAN_CONTEXT_ID` — the Context holding his persona/guardrails/Q&A
   - `LIVEAVATAR_SANDBOX` — leave `true` while building; `false` for the real demo

3. Run:

   ```bash
   pnpm dev
   ```

   Open http://localhost:3000, click **Start conversation**, allow the mic.

## How it works

- `app/api/start-session` mints a **FULL-mode** session token server-side. The
  API key never reaches the browser. Brian's persona binds via
  `avatar_persona.context_id`.
- `src/liveavatar/` holds the SDK context + hooks (session, chat history, voice
  chat). Adapted from HeyGen's official reference app, trimmed to Full Mode.
- `src/components/AvatarStage.tsx` renders the video, attaches the stream on
  `SESSION_STREAM_READY`, and runs a keep-alive interval.
- Subtitles (`CaptionOverlay`) come from the avatar transcription events — the
  same stream the SDK assembles into chat history. Render-and-discard: nothing
  is stored.
- The AI-disclosure overlay (`DisclosureOverlay`) is always on for the whole
  session. Replace `public/cochlear-logo.svg` with the real logo.

## Deploying (Vercel)

- Push to the connected repo; Vercel auto-detects Next.js.
- Add the same env vars in the Vercel dashboard (Project → Settings →
  Environment Variables).
- Keep it private: enable **Deployment Protection** (password/SSO) so the URL
  isn't publicly reachable. Or just run locally for a driven demo.

## Before showing externally

- Paid LiveAvatar plan (removes HeyGen's own watermark; confirms streaming
  minutes). Full Mode ≈ 2 credits/min (~USD 0.25/min).
- Brian likeness consent scope covers demonstration/showcase use.
- Persona/guardrails/Q&A loaded into the Context; `BRIAN_CONTEXT_ID` set.
- `LIVEAVATAR_SANDBOX=false` for the real run; credits topped up.

## Notes / things to verify against the current SDK

This was built to match HeyGen's LiveAvatar reference app. If `pnpm install`
pulls a newer `@heygen/liveavatar-web-sdk` than the reference used, double-check
these exports still resolve in `src/liveavatar/context.tsx`:

- `SessionEvent.SESSION_STREAM_READY`, `SESSION_STATE_CHANGED`
- `AgentEventsEnum.AVATAR_TRANSCRIPTION` / `AVATAR_TRANSCRIPTION_CHUNK` (captions)
- `session.attach(videoElement)` for stream attach
- the FULL-mode token body shape in `app/api/start-session/route.ts`
