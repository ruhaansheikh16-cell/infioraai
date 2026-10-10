# Infiora AI — Product Roadmap

Infiora AI is an all-in-one AI assistant: Chat, Study, Writing and Smart Search,
with user accounts and saved history, shipped on the web and later on Android.
Work is split into small, self-contained milestones. Each one should leave the
app deployable and working.

## ✅ Milestone 1 — Product surface + live AI (done)
- Branded landing page, logo, dark navy / purple-blue design system, light/dark theme.
- App shell: desktop sidebar with "New chat" and recent history; mobile top bar,
  slide-out drawer and bottom tab bar.
- **AI Chat** — real streaming answers via `/api/chat`, copy, regenerate, stop,
  retry on error, input length validation.
- **Study Assistant** — Explain (by level), Revision notes, Quiz me, Step-by-step.
- **Writing Assistant** — Essay (length/tone), Email (tone), Grammar fix, Translate.
- **Settings** — theme, clear history, privacy notes; account section placeholder.
- **Smart Search** screen — UI only; honestly reports that search isn't connected.
- History is kept in memory for the current browser tab (`src/lib/conversations.tsx`).
- PWA manifest + favicon as groundwork for Android.

## Milestone 2 — User accounts
- Enable Netlify Identity (`@netlify/identity`): sign up, log in, log out,
  password reset. Run the identity skill's `enable.cjs` script.
- Sign-in / sign-up screens, wire the Settings "Account" card and sidebar footer.
- Require a signed-in user (or a rate-limited guest allowance) on `/api/chat`.

## Milestone 3 — Saved conversations (Netlify Database)
- Drizzle schema in `db/schema.ts`: `conversations` (id, user_id, mode, task,
  options jsonb, title, timestamps) and `messages` (id, conversation_id, role,
  content, created_at).
- API routes: list / get / create / rename / delete conversations, append messages.
- Swap `ConversationsProvider` internals to call these APIs (UI stays the same).
- Rename conversation in the sidebar; search history.
- Persist user settings (theme, default study level, default translation language).

## Milestone 4 — Smart Search with real sources
- Choose a web search provider (e.g. Tavily, Brave Search API or a search-grounded
  model such as `perplexity/sonar` via AI Gateway). Store any key as a server env var.
- `/api/search`: fetch results → have the model write a cited answer → stream
  answer + source list. Never show results if the provider fails.
- Source cards with favicon, title, domain and clickable links; follow-up questions.

## Milestone 5 — Hardening
- Per-user rate limiting and usage counters (database-backed).
- Better error states (offline banner, 429 "slow down" messaging).
- Export a conversation (Markdown / PDF), share link (read-only).
- Accessibility pass (keyboard navigation, focus rings, screen-reader labels).
- Automated tests for prompt building and API validation.

## Milestone 6 — Android app & Google Play
- Add 192×192 and 512×512 PNG + maskable icons to the manifest, plus a service worker
  for offline shell caching.
- Package as a Trusted Web Activity with Bubblewrap (or wrap with Capacitor).
- Host `/.well-known/assetlinks.json` for Digital Asset Links.
- Write a privacy policy page, store listing, screenshots, content rating.
- Build a signed AAB, test on internal track, then submit for Google Play review.
  The app is **not published** until Google approves the listing.
