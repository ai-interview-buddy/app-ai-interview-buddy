# CLAUDE.md — AI Interview Buddy

## Project Overview

AI Interview Buddy is a cross-platform (iOS, Android, Web) mobile app that helps job seekers prepare for interviews using AI. Users upload CVs, track job positions, conduct AI-powered mock interviews with real-time voice, and get AI feedback/scoring.

**Bundle ID:** `com.aiinterviewbuddy.appinterviewbuddy`
**Production URL:** `https://app.aiinterviewbuddy.com`

## Tech Stack

- **Frontend:** React Native + Expo SDK 53, Expo Router (file-based routing)
- **Styling:** TailwindCSS via NativeWind + Gluestack UI components
- **State:** Zustand (auth), TanStack React Query (server state)
- **Forms:** React Hook Form + Zod validation
- **Backend:** Supabase (PostgreSQL + Edge Functions on Deno)
- **AI:** OpenAI GPT (via OpenAI Agents SDK), Deepgram (speech-to-text/TTS)
- **Real-time:** React Native WebRTC (mock interviews)
- **Analytics:** PostHog
- **Language:** TypeScript (strict mode)

## Project Structure

```
app/                    # Expo Router pages (file-based routing)
  (tabs)/               # Main app tabs (protected routes)
    career-profile/     # CV management
    interview/          # Interview recording/analysis
    job-position/       # Job position tracking
    account/            # Account settings
  auth/                 # Authentication screens
components/             # Reusable UI components
  ui/                   # Gluestack UI base components
  <feature>/            # Feature-specific components
lib/                    # Business logic
  api/                  # React Query hooks & fetch functions
  openai/               # OpenAI RealTimeClient wrapper
  supabase/             # Supabase client, auth store, login helpers
  utils/                # Utility functions
supabase/               # Backend infrastructure
  migrations/           # SQL migrations
  functions/api/        # Deno Edge Function (Express.js)
    agents/             # AI agents (9 agents)
    controllers/        # Request handlers
    routes/             # Express routes
    services/           # Business services
    middlewares/         # CORS, auth
    types/              # TypeScript types
```

## Common Commands

```bash
# Development
npx supabase start                  # Start local Supabase
npx supabase functions serve        # Start Edge Functions
npx expo start                      # Start Expo dev server
npx expo start --web                # Web dev mode
adb reverse tcp:54321 tcp:54321     # Port forward for Android

# Supabase
npx supabase migration new <name>   # Create migration
npx supabase migration up           # Apply migrations locally
npx supabase db push                # Push migrations to production
npx supabase functions deploy api   # Deploy edge function

# Builds
npx expo run:android                # Local Android build
npx expo run:ios                    # Local iOS build
eas build --platform android        # Production Android build
eas build --platform ios            # Production iOS build
npx expo export --platform web      # Web static export

# Linting
npm run lint                        # ESLint
```

## Starting the project

When requested to start the project, you should:

> **Important:** If you're in a git worktree (`.claude/worktrees/`), Supabase may already
> be running from the main worktree. Check with `npx supabase status` first — if it's
> already running, skip `supabase start`. You still need to run `npm install` since each
> worktree has its own `node_modules`.

```sh
npm install
npx supabase start            # Skip if already running (check with `npx supabase status`)
npx supabase migration up
npx supabase functions serve
npx expo start
```

Then you are able to access the project by navigating to `http://localhost:8081` in the browser.

## Before doing a commit

Before doing a commit, you should run the following commands:

```sh
npm run lint
# expect no errors - warnings is fine;

(cd supabase/functions/api && deno install && deno lint && deno test --allow-read)
# expect no errors

npx expo start
# then navigate http://localhost:8081 in the browser, wait the page to load (without error)
# expect the following (or similar):
#   λ Bundled 1731ms node_modules/expo-router/node/render.js (3850 modules)
#   Web node_modules/expo-router/entry.js ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░ 99.9% (3868/3868)
#   Web Bundled 3663ms node_modules/expo-router/entry.js (3868 modules)
#   Web Bundled 575ms node_modules/expo-router/entry.js (3810 modules)

npx expo prebuild --clean
# expect changes in only the ios/AIInterviewBuddy.xcodeproj/project.pbxproj file

npx expo export --platform web
# the export works without issue

npx expo run:ios
# the build works with success

npx expo run:android
# the build works with success
```

## Code Conventions

### Naming

- **Components:** PascalCase `.tsx` files
- **Utilities/libs:** camelCase `.ts` files
- **API layer:** `*.fetch.tsx` (fetch logic), `*.query.tsx` (React Query hooks)
- **Backend:** `*.service.ts`, `*.agent.ts`, `*.route.ts`, `*.controller.ts`

### Formatting (Prettier)

- Print width: 140, 2 spaces, semicolons, double quotes, LF line endings

### Path Alias

- `@/*` maps to project root (e.g., `@/components/...`, `@/lib/...`)

### Patterns

- Unless for forms, avoid using Gluestack UI (`components/ui/`)
- Lucide React Native for icons
- Zustand with persistence for auth state only
- TanStack React Query for all server data
- Zod for validation (pinned to `3.25.67` due to bug in newer versions)
- TUS protocol for large file uploads (audio, CVs)
- Row-level security (RLS) on all database tables

## Color Scheme

- **Primary Yellow:** `#FFC629`
- **Secondary Black:** `#1D252C`

## Environment Variables

### App (.env)

- `EXPO_PUBLIC_SUPABASE_URL` — Supabase URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` — Google OAuth (web)
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID` — Google OAuth (iOS)
- `EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME` — Google iOS URL scheme
- `EXPO_PUBLIC_POSTHOG_API_URL` — PostHog API URL
- `EXPO_PUBLIC_POSTHOG_API_KEY` — PostHog API key

### Supabase Functions (.env)

- `OPENAI_API_KEY` — OpenAI API key
- `DEEPGRAM_API_KEY` — Deepgram API key
- `ALLOWED_ORIGINS` — CORS origins
- `WEB_SCRAPING_TOKEN` — Crawlbase token

## Deployment

- **Mobile:** EAS Build → EAS Submit (App Store / Play Store)
- **Web:** `npx expo export --platform web` → Vercel
- **Backend:** Supabase hosted (project ref: `ihledqmotlhyxnqoipzd`)
- **No CI/CD pipeline** — deployments are manual

## Key Architecture Notes

- Single app (not a monorepo) with clear frontend/backend separation
- Auth: Google + Apple Sign-In via Supabase Auth
- Protected routes use `Stack.Protected` guards in Expo Router
- The backend is a single Supabase Edge Function running an Express.js app on Deno
- AI agents use the OpenAI Agents SDK for structured AI interactions
- Mock interviews use WebRTC for real-time voice communication
- No test framework is configured
