import { assert, assertEquals } from "jsr:@std/assert@1";
import type { Server } from "node:http";
import { apiRequest, cleanupUser, integrationTest, startApp, stopApp, supabaseAdmin } from "./helpers/setup.ts";
import {
  createInterviewQuestion,
  createJobPosition,
  createTestUser,
  createTimelineItem,
  type TestUser,
} from "./helpers/factories.ts";
import { TimelineType } from "../types/TimelineItem.ts";

let baseUrl: string;
let server: Server;
let testUser: TestUser;
let api: ReturnType<typeof apiRequest>;
let timelineItemId: string;

async function setup() {
  ({ baseUrl, server } = await startApp());
  testUser = await createTestUser();
  api = apiRequest(baseUrl, testUser.accessToken);

  // Interview questions need a job position and timeline item
  const position = await createJobPosition(supabaseAdmin, testUser.user);
  const timelineItem = await createTimelineItem(supabaseAdmin, testUser.user, position.id, {
    type: TimelineType.INTERVIEW_ANALYSE,
    title: "Interview Feedback",
  });
  timelineItemId = timelineItem.id;
}

async function teardown() {
  await cleanupUser(testUser.user.id);
  await stopApp(server);
}

// ############################################
// ### GET /api/interview-questions (unpaged)
// ############################################

integrationTest("interview-questions: GET /?unpaged=true returns all questions", async () => {
  await setup();
  try {
    await createInterviewQuestion(supabaseAdmin, testUser.user, timelineItemId, { questionNumber: 1 });
    await createInterviewQuestion(supabaseAdmin, testUser.user, timelineItemId, { questionNumber: 2 });

    const res = await api.get("/api/interview-questions?unpaged=true");
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.length, 2);
  } finally {
    await teardown();
  }
});

// ############################################
// ### GET /api/interview-questions (filtered by timelineItemId)
// ############################################

integrationTest("interview-questions: GET / filtered by timelineItemId", async () => {
  await setup();
  try {
    await createInterviewQuestion(supabaseAdmin, testUser.user, timelineItemId, { questionNumber: 1 });

    const res = await api.get(`/api/interview-questions?unpaged=true&timelineItemId=${timelineItemId}`);
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.length, 1);
    assertEquals(data[0].timelineItemId, timelineItemId);
  } finally {
    await teardown();
  }
});

// ############################################
// ### GET /api/interview-questions (error without pagination)
// ############################################

integrationTest("interview-questions: GET / returns error without pagination params", async () => {
  await setup();
  try {
    const res = await api.get("/api/interview-questions");
    assertEquals(res.status, 400);
  } finally {
    await teardown();
  }
});

// ############################################
// ### GET /api/interview-questions/:id
// ############################################

integrationTest("interview-questions: GET /:id returns a specific question", async () => {
  await setup();
  try {
    const question = await createInterviewQuestion(supabaseAdmin, testUser.user, timelineItemId);

    const res = await api.get(`/api/interview-questions/${question.id}`);
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.id, question.id);
    assert(data.questionTitle);
    assert(data.questionJson);
    assertEquals(data.score, 7);
  } finally {
    await teardown();
  }
});

integrationTest("interview-questions: GET /:id returns 404 for non-existent question", async () => {
  await setup();
  try {
    const res = await api.get(`/api/interview-questions/${crypto.randomUUID()}`);
    assertEquals(res.status, 404);
  } finally {
    await teardown();
  }
});

// ############################################
// ### DELETE /api/interview-questions/:id
// ############################################

integrationTest("interview-questions: DELETE /:id removes the question", async () => {
  await setup();
  try {
    const question = await createInterviewQuestion(supabaseAdmin, testUser.user, timelineItemId);

    const res = await api.delete(`/api/interview-questions/${question.id}`);
    assertEquals(res.status, 204);

    // Verify it's gone
    const getRes = await api.get(`/api/interview-questions/${question.id}`);
    assertEquals(getRes.status, 404);
  } finally {
    await teardown();
  }
});
