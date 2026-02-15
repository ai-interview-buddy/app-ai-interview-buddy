# PostHog Funnels

This document describes the PostHog funnel configuration, custom events, and the analytics architecture used to track user journeys.

## Architecture

We use a **hybrid approach**:

- **Custom events** (`posthog.capture()`) for flows where route changes don't happen (e.g., onboarding TabView steps) and for precise completion tracking (e.g., interview analysis finished).
- **`$screen` events** (automatic via `posthog.screen()`) for interview route transitions where each step is a separate page.

### Key files

| File | Purpose |
|---|---|
| `lib/analytics/useAnalytics.ts` | Typed analytics hook + event constants |
| `components/analytics/Analytics.jsx` | Automatic screen tracking + identity sync + `account_created` |
| `components/analytics/AnalyticsProvider.jsx` | PostHog provider setup with session replay |

## Event Taxonomy

| Event Name | Trigger Location | Properties |
|---|---|---|
| `onboarding_step_viewed` | `app/onboarding.tsx` | `step_index`, `step_title` |
| `onboarding_skipped` | `app/onboarding.tsx` | `skipped_at_step`, `step_title` |
| `onboarding_completed` | `app/onboarding.tsx` | — |
| `account_created` | `components/analytics/Analytics.jsx` | `user_id` |
| `cv_uploaded` | `app/onboard-complete.tsx` | `career_profile_id` |
| `mock_interview_started` | `app/(tabs)/interview/mock-interview-step1.tsx` | — |
| `mock_interview_completed` | `app/(tabs)/interview/mock-interview-step1.tsx` | `interview_id` |
| `interview_recording_started` | `app/(tabs)/interview/create-interview-analyse-step2-record.tsx` | — |
| `interview_recording_completed` | `app/(tabs)/interview/create-interview-analyse-step2-record.tsx` | `interview_id` |
| `interview_upload_completed` | `app/(tabs)/interview/create-interview-analyse-step2-upload.tsx` | `interview_id` |
| `interview_tutorial_step_viewed` | `components/interview/InterviewTutorial.tsx` | `step_index`, `step_title` |
| `interview_tutorial_completed` | `components/interview/InterviewTutorial.tsx` | — |

## Funnels

### 1. Onboarding Completed

Tracks the full onboarding journey from first screen to CV upload. Shows where users drop off.

| Step | Event | Filter |
|---|---|---|
| 1 | `onboarding_step_viewed` | `step_index = 0` ("Nail your next interview") |
| 2 | `onboarding_step_viewed` | `step_index = 1` ("Practice Mock Interviews") |
| 3 | `onboarding_step_viewed` | `step_index = 2` ("Record or Upload Your Interviews") |
| 4 | `onboarding_step_viewed` | `step_index = 3` ("Track Job Positions in seconds") |
| 5 | `onboarding_step_viewed` | `step_index = 4` ("Tailor your path") |
| 6 | `onboarding_step_viewed` | `step_index = 5` ("Start by signing in...") |
| 7 | `account_created` | — |
| 8 | `cv_uploaded` | — |

> **Why custom events?** The onboarding uses `react-native-tab-view` within a single `/onboarding` route. Step transitions are state changes, not route changes, so `$screen` events only fire once.

### 2. Mock Interview

Tracks the mock interview flow from creation to completion.

| Step | Event | Filter |
|---|---|---|
| 1 | `$screen` | `$screen_name = /interview/create-interview` |
| 2 | `$screen` | `$screen_name = /interview/mock-interview-step1` |
| 3 | `mock_interview_completed` | — |

### 3. Real Interview — Record

Tracks the real interview recording flow.

| Step | Event | Filter |
|---|---|---|
| 1 | `$screen` | `$screen_name = /interview/create-interview` |
| 2 | `$screen` | `$screen_name = /interview/create-interview-analyse-step1` |
| 3 | `$screen` | `$screen_name = /interview/create-interview-analyse-step2-record` |
| 4 | `interview_recording_completed` | — |

### 4. Real Interview — Upload

Tracks the real interview upload flow.

| Step | Event | Filter |
|---|---|---|
| 1 | `$screen` | `$screen_name = /interview/create-interview` |
| 2 | `$screen` | `$screen_name = /interview/create-interview-analyse-step1` |
| 3 | `$screen` | `$screen_name = /interview/create-interview-analyse-step2-upload` |
| 4 | `interview_upload_completed` | — |

### 5. Interview Tutorial

Tracks the interview tutorial flow that explains the difference between mock and real interviews. Shown once to first-time users before they create an interview.

| Step | Event | Filter |
|---|---|---|
| 1 | `interview_tutorial_step_viewed` | `step_index = 0` ("Mock Interview VS Real Interview") |
| 2 | `interview_tutorial_step_viewed` | `step_index = 1` ("Mock Interview") |
| 3 | `interview_tutorial_step_viewed` | `step_index = 2` ("Real Interview") |
| 4 | `interview_tutorial_completed` | — |

> **Why custom events?** Like onboarding, the interview tutorial uses `react-native-tab-view` within a single `/interview/interview-tutorial` route. Step transitions are state changes, not route changes, so `$screen` events only fire once.

## PostHog Dashboard Configuration

Each funnel is created in PostHog under **Product Analytics → New Insight → Funnel**.

Steps use either:
- **Custom events** — select the event name directly (e.g., `onboarding_step_viewed`) and add property filters (e.g., `step_index = 0`)
- **Screen events** — select `Screen` event and filter by `$screen_name` property

### Tips

- Set funnel conversion window to **7 days** for onboarding (users may not complete in one session)
- Set funnel conversion window to **1 hour** for interview funnels (single-session flows)
- Use **ordered** funnel mode (steps must happen in sequence)
- Add **breakdown by** `distinct_id` to see individual user paths

## Adding New Events

1. Add the event constant to `AnalyticsEvents` in `lib/analytics/useAnalytics.ts`
2. Import `useAnalytics` and `AnalyticsEvents` in the component
3. Call `capture(AnalyticsEvents.YOUR_EVENT, { ...properties })` at the right moment
4. Update this document with the new event
5. Create or update the funnel in PostHog dashboard
