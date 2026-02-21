import { assert, assertEquals } from "jsr:@std/assert@1";
import type { Server } from "node:http";
import { apiRequest, cleanupUser, integrationTest, startApp, stopApp, supabaseAdmin } from "./helpers/setup.ts";
import { createCareerProfile, createTestUser, type TestUser } from "./helpers/factories.ts";
import { stubCvScoring } from "./helpers/mocks.ts";

let baseUrl: string;
let server: Server;
let testUser: TestUser;
let api: ReturnType<typeof apiRequest>;

async function setup() {
  ({ baseUrl, server } = await startApp());
  testUser = await createTestUser();
  api = apiRequest(baseUrl, testUser.accessToken);
}

async function teardown() {
  await cleanupUser(testUser.user.id);
  await stopApp(server);
}

// ############################################
// ### GET /api/career-profiles
// ############################################

integrationTest("career-profiles: GET / returns empty array when no profiles exist", async () => {
  await setup();
  try {
    const res = await api.get("/api/career-profiles");
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data, []);
  } finally {
    await teardown();
  }
});

integrationTest("career-profiles: GET / returns profiles after creation", async () => {
  await setup();
  try {
    await createCareerProfile(supabaseAdmin, testUser.user);

    const res = await api.get("/api/career-profiles");
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.length, 1);
    assert(data[0].id);
    assertEquals(data[0].title, "Software Engineer");
  } finally {
    await teardown();
  }
});

// ############################################
// ### POST /api/career-profiles
// ############################################

integrationTest("career-profiles: POST / creates a profile with mocked CV scoring", async () => {
  await setup();
  const agentStub = stubCvScoring();
  try {
    // Upload a real test PDF to storage
    const filePath = `${testUser.user.id}/test-cv.pdf`;
    const pdfContent = await Deno.readFile(new URL("../utils/__tests__/fixtures/cv-jon-doe.pdf", import.meta.url));
    await supabaseAdmin.storage.from("curriculums").upload(filePath, pdfContent, { contentType: "application/pdf" });

    const res = await api.post("/api/career-profiles", { curriculumPath: filePath });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.title, "Software Engineer");
    assertEquals(typeof data.curriculumScore, "number");
  } finally {
    agentStub.restore();
    await teardown();
  }
});

// ############################################
// ### GET /api/career-profiles/:id
// ############################################

integrationTest("career-profiles: GET /:id returns a specific profile", async () => {
  await setup();
  try {
    const profile = await createCareerProfile(supabaseAdmin, testUser.user);

    const res = await api.get(`/api/career-profiles/${profile.id}`);
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.id, profile.id);
    assertEquals(data.title, "Software Engineer");
    assert(data.curriculumText);
  } finally {
    await teardown();
  }
});

integrationTest("career-profiles: GET /:id returns 404 for non-existent profile", async () => {
  await setup();
  try {
    const res = await api.get(`/api/career-profiles/${crypto.randomUUID()}`);
    assertEquals(res.status, 404);
  } finally {
    await teardown();
  }
});

// ############################################
// ### GET /api/career-profiles/:id/download
// ############################################

integrationTest("career-profiles: GET /:id/download returns a signed URL", async () => {
  await setup();
  try {
    const filePath = `${testUser.user.id}/download-test.pdf`;
    const pdfContent = new Uint8Array([37, 80, 68, 70]);
    await supabaseAdmin.storage.from("curriculums").upload(filePath, pdfContent, { contentType: "application/pdf" });

    const profile = await createCareerProfile(supabaseAdmin, testUser.user, { curriculumPath: filePath });

    const res = await api.get(`/api/career-profiles/${profile.id}/download`);
    assertEquals(res.status, 200);

    const data = await res.json();
    assert(data.signedUrl);
    assert(data.signedUrl.includes("/storage/v1"));
  } finally {
    await teardown();
  }
});

// ############################################
// ### PATCH /api/career-profiles/:id
// ############################################

integrationTest("career-profiles: PATCH /:id updates the title", async () => {
  await setup();
  try {
    const profile = await createCareerProfile(supabaseAdmin, testUser.user);

    const res = await api.patch(`/api/career-profiles/${profile.id}`, { title: "Senior Engineer" });
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.title, "Senior Engineer");
  } finally {
    await teardown();
  }
});

// ############################################
// ### DELETE /api/career-profiles/:id
// ############################################

integrationTest("career-profiles: DELETE /:id removes the profile", async () => {
  await setup();
  try {
    const profile = await createCareerProfile(supabaseAdmin, testUser.user);

    const res = await api.delete(`/api/career-profiles/${profile.id}`);
    assertEquals(res.status, 204);

    // Verify it's gone
    const getRes = await api.get(`/api/career-profiles/${profile.id}`);
    assertEquals(getRes.status, 404);
  } finally {
    await teardown();
  }
});

// ############################################
// ### Auth: 401 Unauthorized
// ############################################

integrationTest("career-profiles: returns 401 without authorization header", async () => {
  await setup();
  try {
    const res = await fetch(`${baseUrl}/api/career-profiles`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    assertEquals(res.status, 401);
  } finally {
    await teardown();
  }
});
