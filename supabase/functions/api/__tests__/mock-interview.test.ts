import { assert, assertEquals } from "jsr:@std/assert@1";
import type { Server } from "node:http";
import { apiRequest, cleanupUser, integrationTest, startApp, stopApp, supabaseAdmin } from "./helpers/setup.ts";
import { createCareerProfile, createJobPosition, createTestUser, type TestUser } from "./helpers/factories.ts";
import {
  stubGlobalFetchSmart,
  stubMockInterviewInstructions,
  stubQuestionParser,
  stubQuestionScoring,
} from "./helpers/mocks.ts";

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
// ### POST /api/mock-interview
// ############################################

integrationTest("mock-interview: POST / creates a session with mocked agents", async () => {
  await setup();
  const instructionsStub = stubMockInterviewInstructions();
  const fetchStub = stubGlobalFetchSmart("test-ephemeral-token");
  try {
    const profile = await createCareerProfile(supabaseAdmin, testUser.user);
    const position = await createJobPosition(supabaseAdmin, testUser.user, { careerProfileId: profile.id });

    const res = await api.post("/api/mock-interview", {
      profileId: profile.id,
      positionId: position.id,
      customInstructions: "Focus on leadership and product strategy scenarios.",
    });
    assertEquals(res.status, 200);

    const data = await res.json();
    assert(data.token);
    assert(data.instructions);
    assert(data.voice);
    assertEquals(data.token, "test-ephemeral-token");
  } finally {
    instructionsStub.restore();
    fetchStub.restore();
    await teardown();
  }
});

integrationTest("mock-interview: POST / works without profileId and positionId", async () => {
  await setup();
  const instructionsStub = stubMockInterviewInstructions();
  const fetchStub = stubGlobalFetchSmart();
  try {
    const res = await api.post("/api/mock-interview", {});
    assertEquals(res.status, 200);

    const data = await res.json();
    assert(data.token);
    assert(data.instructions);
    assert(data.voice);
  } finally {
    instructionsStub.restore();
    fetchStub.restore();
    await teardown();
  }
});

// ############################################
// ### POST /api/mock-interview/analyse
// ############################################

integrationTest("mock-interview: POST /analyse analyses a mock interview transcript", async () => {
  await setup();
  const parserStub = stubQuestionParser();
  const scoringStub = stubQuestionScoring();
  try {
    const position = await createJobPosition(supabaseAdmin, testUser.user);

    const transcript = [
      {
        start: 0,
        end: 5,
        speaker: 0,
        sentences: [{ text: "Tell me about a time you faced a challenge at work", start: 0, end: 5 }],
        sentiment: "neutral",
      },
      {
        start: 5,
        end: 20,
        speaker: 1,
        sentences: [{ text: "At my previous company, I led a database migration project...", start: 5, end: 20 }],
        sentiment: "positive",
      },
    ];

    const res = await api.post("/api/mock-interview/analyse", {
      positionId: position.id,
      transcript,
    });
    assertEquals(res.status, 200);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.type, "MOCK_ANALYSE");
    assertEquals(data.title, "Mock Interview Review");
  } finally {
    parserStub.restore();
    scoringStub.restore();
    await teardown();
  }
});
