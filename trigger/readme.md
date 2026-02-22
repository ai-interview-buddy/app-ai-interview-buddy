# Trigger.dev — Background Job Queue

## Why Trigger.dev?

Supabase Edge Functions have a ~2-4 minute timeout, but some of our AI pipelines take longer:

- **Job position enrichment** (by URL): web scraping + AI agent with tools = 30s–4min
- **Job position enrichment** (by description): AI agent with tool-based logo/website lookup = 20s–2min
- **Interview analysis**: Deepgram STT + question parsing + scoring = 1–5min

Trigger.dev runs these as background tasks with retries, observability, and no timeout constraints.

## Architecture

```
User request
  → Supabase Edge Function (fast sync response, ~2-5s)
    → Basic AI agent (no tools, small model) extracts minimal fields
    → INSERT record with processing_status = 'pending'
    → Fire-and-forget HTTP POST to Trigger.dev REST API
    → Return 201 immediately

Trigger.dev worker (async, up to 5 min)
  → Full AI agent with tools (web search, scraping)
  → UPDATE record with enriched data + processing_status = 'completed'

Frontend polls every 5-10s while status is 'pending' or 'processing'
```

## Local Development Setup

### 1. Start local Trigger.dev (Docker)

```bash
cd trigger/docker
docker compose up
```

### 2. Create a project in local Trigger.dev

1. Open **http://localhost:8030** in your browser
2. Sign up with email
3. Once you use the option to send a magic link, check docker logs `webapp-x` will have the magic link
4. Create a new project (e.g., "AI Interview Buddy")
5. Copy the **Project ref** (e.g., `proj_abc123...`) from project settings
6. Copy the **Secret key** (starts with `tr_dev_...`) from project settings > API keys

### 3. Configure environment variables

**`trigger/.env`** (copy from `trigger/.env.template`):

```env
TRIGGER_PROJECT_REF=proj_abc123...      # From step 2
TRIGGER_SECRET_KEY=tr_dev_...           # From step 2

SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=...           # From `npx supabase status`

OPENAI_API_KEY=sk-...
DEEPGRAM_API_KEY=...
WEB_SCRAPING_TOKEN=...                  # Crawlbase token
```

**`supabase/functions/.env`** — add these two lines:

```env
TRIGGER_API_URL=http://host.docker.internal:8030
TRIGGER_SECRET_KEY=tr_dev_...           # Same key as above
```

### 4. Login to local Trigger.dev CLI

```bash
cd trigger
npx trigger login -a http://localhost:8030 --profile local
```

### 5. Start the Trigger.dev dev worker

```bash
cd trigger
npm install
npx trigger dev --profile local
```

This watches `src/trigger/` for task changes and connects to your local Trigger.dev instance.

After this point, you can follow the main `readme.md`.

## Task Definitions

### `enrich-job-position`

**File:** `trigger/src/trigger/enrichJobPosition.ts`
**Payload:** `{ jobPositionId }`

Fetches the job position record from the database, then runs the full position extractor AI agent (with web search + scraping tools) to enrich it with company logo, website, and detailed description. Updates `processing_status` to `completed` or `failed`.

### `analyse-interview`

**File:** `trigger/src/trigger/analyseInterview.ts`
**Payload:** `{ timelineItemId }`

Fetches the timeline item record from the database, downloads audio from Supabase storage, transcribes via Deepgram, parses questions with AI, scores each question across 7 dimensions, and saves results.

## How Tasks Are Triggered

Edge Functions trigger tasks via HTTP POST to the Trigger.dev REST API:

```
POST {TRIGGER_API_URL}/api/v1/tasks/{taskId}/trigger
Authorization: Bearer {TRIGGER_SECRET_KEY}
Content-Type: application/json
Body: { "payload": { ... } }
```

This is implemented in `supabase/functions/api/utils/TriggerTask.utils.ts` as a fire-and-forget call (errors are logged but don't fail the user request).

## Cloud Deployment

For production, use Trigger.dev Cloud:

1. Create a project at https://cloud.trigger.dev
2. Set `TRIGGER_API_URL=https://api.trigger.dev` in your Supabase Edge Function env
3. Deploy the worker:

```bash
cd trigger
npx trigger deploy
```

## Docker Management

```bash
# Start
cd trigger/docker && docker compose up -d

# Stop (keeps data)
cd trigger/docker && docker compose down

# Stop and delete all data
cd trigger/docker && docker compose down -v

# View logs
cd trigger/docker && docker compose logs -f webapp

# Check health
cd trigger/docker && docker compose ps
```

## Ports Reference

| Service    | Local Port | Purpose                     |
| ---------- | ---------- | --------------------------- |
| Webapp     | 8030       | Trigger.dev dashboard & API |
| Postgres   | 5433       | Trigger.dev database        |
| Redis      | 6389       | Trigger.dev queue           |
| ClickHouse | 9123       | Run analytics (HTTP)        |
| MinIO      | 9000/9001  | Object storage / console    |
| Registry   | 5000       | Docker image registry       |

Note: These ports are different from Supabase's to avoid conflicts.
