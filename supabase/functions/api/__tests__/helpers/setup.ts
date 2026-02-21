import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { app } from "../../app.ts";
import type { Server } from "node:http";

// Environment variables are loaded via --env-file=.env.test in the deno test command.
// We cannot use @std/dotenv here because some modules (e.g. lib/supabase.ts, agents)
// initialize clients at the top level during import, before any runtime code executes.

// Polyfill EdgeRuntime for test environment
if (typeof (globalThis as Record<string, unknown>).EdgeRuntime === "undefined") {
  (globalThis as Record<string, unknown>).EdgeRuntime = {
    waitUntil: (promise: Promise<unknown>) => {
      promise.catch(console.error);
    },
  };
}

/**
 * Wrapper around Deno.test that disables resource and op leak detection.
 * Express.js creates persistent keep-alive timers and connections that
 * trigger false-positive leak warnings in Deno's test runner.
 */
export const integrationTest = (name: string, fn: () => Promise<void>) => {
  Deno.test({ name, fn, sanitizeResources: false, sanitizeOps: false });
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "http://localhost:54321";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!SUPABASE_ANON_KEY) throw new Error("SUPABASE_ANON_KEY env var is required — see readme.md for .env.test setup");
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error("SUPABASE_SERVICE_ROLE_KEY env var is required — see readme.md for .env.test setup");

/**
 * Supabase client with service_role key — bypasses RLS.
 * Use for test setup/teardown (creating users, seeding data, cleanup).
 */
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

/**
 * Creates a Supabase client authenticated with a user's access token.
 * Use for operations that should respect RLS.
 */
export const supabaseClient = (accessToken: string): SupabaseClient => {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
};

/**
 * Starts the Express app on a random available port.
 * Returns the base URL and a close function.
 */
export const startApp = (): Promise<{ baseUrl: string; server: Server }> => {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const addr = server.address();
      const port = typeof addr === "object" && addr ? addr.port : 0;
      resolve({ baseUrl: `http://localhost:${port}`, server });
    });
  });
};

/**
 * Stops the Express app server.
 */
export const stopApp = (server: Server): Promise<void> => {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
};

/**
 * Deletes a test user and all their data via admin API.
 */
export const cleanupUser = async (userId: string): Promise<void> => {
  // Data cascades from RLS-protected tables when the user is deleted
  // But we also clean up explicitly to be safe
  await supabaseAdmin.from("interview_question").delete().eq("account_id", userId);
  await supabaseAdmin.from("timeline_item").delete().eq("account_id", userId);
  await supabaseAdmin.from("job_position").delete().eq("account_id", userId);
  await supabaseAdmin.from("career_profile").delete().eq("account_id", userId);
  await supabaseAdmin.auth.admin.deleteUser(userId);
};

/**
 * Helper to make authenticated HTTP requests to the test server.
 */
export const apiRequest = (baseUrl: string, accessToken: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  return {
    get: (path: string) => fetch(`${baseUrl}${path}`, { method: "GET", headers }),
    post: (path: string, body?: unknown) =>
      fetch(`${baseUrl}${path}`, { method: "POST", headers, body: body ? JSON.stringify(body) : undefined }),
    patch: (path: string, body?: unknown) =>
      fetch(`${baseUrl}${path}`, { method: "PATCH", headers, body: body ? JSON.stringify(body) : undefined }),
    delete: (path: string) => fetch(`${baseUrl}${path}`, { method: "DELETE", headers }),
  };
};
