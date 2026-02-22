import { assert, assertEquals } from "jsr:@std/assert@1";
import TriggerTaskService from "../TriggerTask.utils.ts";

// Track fetch calls for assertions
let capturedUrl = "";
let capturedBody = "";
let fetchShouldFail = false;

const originalFetch = globalThis.fetch;

function mockFetch(url: string | URL | Request, options?: RequestInit): Promise<Response> {
  capturedUrl = url.toString();
  capturedBody = (options?.body as string) || "";

  if (fetchShouldFail) {
    return Promise.resolve(new Response("Internal Server Error", { status: 500 }));
  }

  return Promise.resolve(new Response(JSON.stringify({ id: "run_test_123" }), { status: 200 }));
}

Deno.test("triggerTask builds correct URL and sends payload", async () => {
  Deno.env.set("TRIGGER_API_URL", "https://test.trigger.dev");
  Deno.env.set("TRIGGER_SECRET_KEY", "tr_dev_test_key");
  globalThis.fetch = mockFetch as typeof fetch;
  capturedUrl = "";
  capturedBody = "";
  fetchShouldFail = false;

  try {
    await TriggerTaskService.triggerTask("enrich-job-position", { jobPositionId: "abc-123" });

    assert(capturedUrl.length > 0, "fetch should have been called");
    assert(capturedUrl.includes("/api/v1/tasks/enrich-job-position/trigger"), "URL should contain task ID");

    const body = JSON.parse(capturedBody);
    assertEquals(body.payload.jobPositionId, "abc-123");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("triggerTask does not throw on HTTP error (fire-and-forget)", async () => {
  Deno.env.set("TRIGGER_API_URL", "https://test.trigger.dev");
  Deno.env.set("TRIGGER_SECRET_KEY", "tr_dev_test_key");
  globalThis.fetch = mockFetch as typeof fetch;
  fetchShouldFail = true;

  try {
    await TriggerTaskService.triggerTask("enrich-job-position", { jobPositionId: "abc-123" });
  } finally {
    globalThis.fetch = originalFetch;
    fetchShouldFail = false;
  }
});
