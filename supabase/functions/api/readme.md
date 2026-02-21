# It uses deno

```sh
deno install
deno add npm:express
deno lint
deno test --allow-read
```

# jsr packages repository

https://jsr.io/

# Zod 3.25.67

At the time, there was a bug with versions above 3.25.67: https://github.com/openai/openai-agents-js/issues/187

# Integration Tests

## Prerequisites

- **Supabase must be running locally** (`npx supabase start` from the project root)
- Migrations must be applied (`npx supabase migration up`)
- A `.env.test` file must exist in this directory (see below)

## Setting up `.env.test`

The `.env.test` file is **not committed** (it's in `.gitignore`). Generate it automatically from your running Supabase instance.

From the **project root**:

```sh
touch supabase/functions/api/.env.test

npx supabase status 2>/dev/null | awk '
  /API URL:/ { print "SUPABASE_URL=" $NF }
  /anon key:/ { print "SUPABASE_ANON_KEY=" $NF }
  /service_role key:/ { print "SUPABASE_SERVICE_ROLE_KEY=" $NF }
  END { print "OPENAI_API_KEY=sk-test-dummy"; print "DEEPGRAM_API_KEY=test-dummy" }
' > supabase/functions/api/.env.test
```

## Running Tests

```sh
# Unit tests only (no Supabase needed)
deno test --allow-read utils/__tests__/

# Integration tests (requires Supabase running)
deno test --no-check --env-file=.env.test --allow-read --allow-net --allow-env --allow-sys __tests__/

# All tests
deno test --no-check --env-file=.env.test --allow-read --allow-net --allow-env --allow-sys

# Run a specific test file
deno test --no-check --env-file=.env.test --allow-read --allow-net --allow-env --allow-sys __tests__/career-profiles.test.ts
```
