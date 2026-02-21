import { assert, assertEquals } from "jsr:@std/assert@1";
import type { Server } from "node:http";
import { apiRequest, cleanupUser, integrationTest, startApp, stopApp, supabaseAdmin } from "./helpers/setup.ts";
import { createCareerProfile, createJobPosition, createTestUser, type TestUser } from "./helpers/factories.ts";
import { stubGlobalFetchSmart, stubPositionExtractorFromDescription, stubPositionExtractorFromUrl } from "./helpers/mocks.ts";

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
// ### GET /api/job-positions
// ############################################

integrationTest("job-positions: GET / returns empty array when no positions exist", async () => {
  await setup();
  try {
    const res = await api.get("/api/job-positions");
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data, []);
  } finally {
    await teardown();
  }
});

integrationTest("job-positions: GET / returns positions after creation", async () => {
  await setup();
  try {
    await createJobPosition(supabaseAdmin, testUser.user);

    const res = await api.get("/api/job-positions");
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.length, 1);
    assertEquals(data[0].companyName, "Acme Corp");
    assertEquals(data[0].jobTitle, "Senior Software Engineer");
  } finally {
    await teardown();
  }
});

// ############################################
// ### POST /api/job-positions/by-url
// ############################################

integrationTest("job-positions: POST /by-url creates a position with mocked extractor", async () => {
  await setup();
  const extractorStub = stubPositionExtractorFromUrl();
  const fetchStub = stubGlobalFetchSmart();
  try {
    const profile = await createCareerProfile(supabaseAdmin, testUser.user);

    const res = await api.post("/api/job-positions/by-url", {
      profileId: profile.id,
      jobUrl: "https://example.com/jobs/senior-engineer",
    });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.companyName, "Acme Corp");
    assertEquals(data.jobTitle, "Senior Software Engineer");
  } finally {
    extractorStub.restore();
    fetchStub.restore();
    await teardown();
  }
});

// ############################################
// ### POST /api/job-positions/by-description
// ############################################

integrationTest("job-positions: POST /by-description creates a position with mocked extractor", async () => {
  await setup();
  const extractorStub = stubPositionExtractorFromDescription();
  const fetchStub = stubGlobalFetchSmart();
  try {
    const profile = await createCareerProfile(supabaseAdmin, testUser.user);

    const res = await api.post("/api/job-positions/by-description", {
      profileId: profile.id,
      jobDescription: "<div><b>Acme Corp</b> is hiring a Senior Software Engineer</div>",
    });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.companyName, "Acme Corp");
  } finally {
    extractorStub.restore();
    fetchStub.restore();
    await teardown();
  }
});

// ############################################
// ### GET /api/job-positions/:id
// ############################################

integrationTest("job-positions: GET /:id returns a specific position", async () => {
  await setup();
  try {
    const position = await createJobPosition(supabaseAdmin, testUser.user);

    const res = await api.get(`/api/job-positions/${position.id}`);
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.id, position.id);
    assertEquals(data.companyName, "Acme Corp");
    assert(data.jobDescription);
  } finally {
    await teardown();
  }
});

integrationTest("job-positions: GET /:id returns 404 for non-existent position", async () => {
  await setup();
  try {
    const res = await api.get(`/api/job-positions/${crypto.randomUUID()}`);
    assertEquals(res.status, 404);
  } finally {
    await teardown();
  }
});

// ############################################
// ### PATCH /api/job-positions/:id
// ############################################

integrationTest("job-positions: PATCH /:id updates a position", async () => {
  await setup();
  try {
    const position = await createJobPosition(supabaseAdmin, testUser.user);

    const res = await api.patch(`/api/job-positions/${position.id}`, {
      companyName: "New Corp",
      jobTitle: "Backend Engineer",
    });
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.companyName, "New Corp");
    assertEquals(data.jobTitle, "Backend Engineer");
  } finally {
    await teardown();
  }
});

// ############################################
// ### PATCH /api/job-positions/archive
// ############################################

integrationTest("job-positions: PATCH /archive toggles archived status", async () => {
  await setup();
  try {
    const position = await createJobPosition(supabaseAdmin, testUser.user, { archived: false });

    const res = await api.patch("/api/job-positions/archive", [position.id]);
    assertEquals(res.status, 204);

    // Verify the position is now archived
    const getRes = await api.get(`/api/job-positions/${position.id}`);
    const data = await getRes.json();
    assertEquals(data.archived, true);
  } finally {
    await teardown();
  }
});

// ############################################
// ### PATCH /api/job-positions/offer
// ############################################

integrationTest("job-positions: PATCH /offer marks offer received", async () => {
  await setup();
  try {
    const position = await createJobPosition(supabaseAdmin, testUser.user, { offerReceived: false });

    const res = await api.patch("/api/job-positions/offer", [position.id]);
    assertEquals(res.status, 204);

    // Verify offer_received is true
    const getRes = await api.get(`/api/job-positions/${position.id}`);
    const data = await getRes.json();
    assertEquals(data.offerReceived, true);
  } finally {
    await teardown();
  }
});

// ############################################
// ### DELETE /api/job-positions/:id
// ############################################

integrationTest("job-positions: DELETE /:id removes the position", async () => {
  await setup();
  try {
    const position = await createJobPosition(supabaseAdmin, testUser.user);

    const res = await api.delete(`/api/job-positions/${position.id}`);
    assertEquals(res.status, 204);

    // Verify it's gone
    const getRes = await api.get(`/api/job-positions/${position.id}`);
    assertEquals(getRes.status, 404);
  } finally {
    await teardown();
  }
});
