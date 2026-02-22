import { assert, assertEquals } from "jsr:@std/assert@1";
import type { Server } from "node:http";
import { apiRequest, cleanupUser, integrationTest, startApp, stopApp, supabaseAdmin } from "./helpers/setup.ts";
import {
  createCareerProfile,
  createJobPosition,
  createTestUser,
  createTimelineItem,
  type TestUser,
} from "./helpers/factories.ts";
import { stubCoverLetter, stubLinkedinIntro, stubReplyEmail, stubTriggerTask } from "./helpers/mocks.ts";
import { TimelineType } from "../types/TimelineItem.ts";

let baseUrl: string;
let server: Server;
let testUser: TestUser;
let api: ReturnType<typeof apiRequest>;
let positionId: string;

async function setup() {
  ({ baseUrl, server } = await startApp());
  testUser = await createTestUser();
  api = apiRequest(baseUrl, testUser.accessToken);

  // Most timeline operations need a career profile and job position
  const profile = await createCareerProfile(supabaseAdmin, testUser.user);
  const position = await createJobPosition(supabaseAdmin, testUser.user, { careerProfileId: profile.id });
  positionId = position.id;
}

async function teardown() {
  await cleanupUser(testUser.user.id);
  await stopApp(server);
}

// ############################################
// ### GET /api/timeline-items (unpaged)
// ############################################

integrationTest("timeline-items: GET /?unpaged=true returns all items", async () => {
  await setup();
  try {
    await createTimelineItem(supabaseAdmin, testUser.user, positionId, { title: "Note 1" });
    await createTimelineItem(supabaseAdmin, testUser.user, positionId, { title: "Note 2" });

    const res = await api.get("/api/timeline-items?unpaged=true");
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.length, 2);
  } finally {
    await teardown();
  }
});

// ############################################
// ### GET /api/timeline-items (paginated)
// ############################################

integrationTest("timeline-items: GET /?page=0&size=1 returns paginated items", async () => {
  await setup();
  try {
    await createTimelineItem(supabaseAdmin, testUser.user, positionId, { title: "Note 1" });
    await createTimelineItem(supabaseAdmin, testUser.user, positionId, { title: "Note 2" });

    const res = await api.get("/api/timeline-items?page=0&size=1");
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.length, 1);
  } finally {
    await teardown();
  }
});

// ############################################
// ### GET /api/timeline-items (filtered by jobPositionId)
// ############################################

integrationTest("timeline-items: GET / filtered by jobPositionId", async () => {
  await setup();
  try {
    await createTimelineItem(supabaseAdmin, testUser.user, positionId, { title: "Linked Note" });

    const res = await api.get(`/api/timeline-items?unpaged=true&jobPositionId=${positionId}`);
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.length, 1);
    assertEquals(data[0].title, "Linked Note");
  } finally {
    await teardown();
  }
});

// ############################################
// ### GET /api/timeline-items (error without pagination)
// ############################################

integrationTest("timeline-items: GET / returns error without pagination params", async () => {
  await setup();
  try {
    const res = await api.get("/api/timeline-items");
    assertEquals(res.status, 400);
  } finally {
    await teardown();
  }
});

// ############################################
// ### POST /api/timeline-items/note
// ############################################

integrationTest("timeline-items: POST /note creates a NOTE timeline item", async () => {
  await setup();
  try {
    const res = await api.post("/api/timeline-items/note", {
      positionId,
      title: "Interview stages overview",
      text: "1) Screening; 2) Technical; 3) Final",
    });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.title, "Interview stages overview");
    assertEquals(data.type, TimelineType.NOTE);
    assertEquals(data.text, "1) Screening; 2) Technical; 3) Final");
  } finally {
    await teardown();
  }
});

// ############################################
// ### POST /api/timeline-items/cover-letter
// ############################################

integrationTest("timeline-items: POST /cover-letter creates a COVER_LETTER with mocked agent", async () => {
  await setup();
  const agentStub = stubCoverLetter();
  try {
    const res = await api.post("/api/timeline-items/cover-letter", {
      positionId,
      customInstructions: "Use my CV highlights matching the job description",
    });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.type, TimelineType.COVER_LETTER);
    assertEquals(data.title, "Cover Letter");
    assert(data.text);
  } finally {
    agentStub.restore();
    await teardown();
  }
});

// ############################################
// ### POST /api/timeline-items/linkedin-intro
// ############################################

integrationTest("timeline-items: POST /linkedin-intro creates a LINKEDIN_INTRO with mocked agent", async () => {
  await setup();
  const agentStub = stubLinkedinIntro();
  try {
    const res = await api.post("/api/timeline-items/linkedin-intro", {
      positionId,
      greeting: "Hi there!",
      customInstructions: "Create a short and direct introductory message",
    });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.type, TimelineType.LINKEDIN_INTRO);
    assertEquals(data.title, "LinkedIn Intro");
    assert(data.text);
  } finally {
    agentStub.restore();
    await teardown();
  }
});

// ############################################
// ### POST /api/timeline-items/reply-email
// ############################################

integrationTest("timeline-items: POST /reply-email creates a REPLY_EMAIL with mocked agent", async () => {
  await setup();
  const agentStub = stubReplyEmail();
  try {
    const res = await api.post("/api/timeline-items/reply-email", {
      positionId,
      emailBody: "Hello, we would like to book a meeting. Please send us 3 timeslots.",
      customInstructions: "Keep tone warm and professional",
    });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.type, TimelineType.REPLY_EMAIL);
    assert(data.text);
  } finally {
    agentStub.restore();
    await teardown();
  }
});

// ############################################
// ### POST /api/timeline-items/analyse-interview
// ############################################

integrationTest("timeline-items: POST /analyse-interview creates an INTERVIEW_ANALYSE and queues processing via Trigger.dev", async () => {
  await setup();
  const trigger = stubTriggerTask();
  try {
    // Upload a fake audio file
    const audioPath = `${testUser.user.id}/test-interview.mp3`;
    const audioContent = new Uint8Array([0, 0, 0]);
    await supabaseAdmin.storage.from("interviews").upload(audioPath, audioContent, { contentType: "audio/mpeg" });

    const res = await api.post("/api/timeline-items/analyse-interview", {
      positionId,
      interviewPath: audioPath,
    });
    assertEquals(res.status, 201);

    const data = await res.json();
    assert(data.id);
    assertEquals(data.type, TimelineType.INTERVIEW_ANALYSE);
    assertEquals(data.title, "Interview Feedback");

    // Verify triggerTask was called to queue background processing
    assertEquals(trigger.calls.length, 1);
    assertEquals(trigger.calls[0].taskId, "analyse-interview");
    assertEquals(trigger.calls[0].payload.timelineItemId, data.id);
  } finally {
    trigger.stub.restore();
    await teardown();
  }
});

// ############################################
// ### GET /api/timeline-items/:id
// ############################################

integrationTest("timeline-items: GET /:id returns a specific timeline item", async () => {
  await setup();
  try {
    const item = await createTimelineItem(supabaseAdmin, testUser.user, positionId, {
      title: "My Note",
      text: "Some text",
    });

    const res = await api.get(`/api/timeline-items/${item.id}`);
    assertEquals(res.status, 200);

    const data = await res.json();
    assertEquals(data.id, item.id);
    assertEquals(data.title, "My Note");
  } finally {
    await teardown();
  }
});

integrationTest("timeline-items: GET /:id returns 404 for non-existent item", async () => {
  await setup();
  try {
    const res = await api.get(`/api/timeline-items/${crypto.randomUUID()}`);
    assertEquals(res.status, 404);
  } finally {
    await teardown();
  }
});

// ############################################
// ### PATCH /api/timeline-items/:id/custom-instructions
// ############################################

integrationTest("timeline-items: PATCH /:id/custom-instructions updates with mocked agent", async () => {
  await setup();
  const agentStub = stubCoverLetter("Updated cover letter text based on new instructions");
  try {
    const item = await createTimelineItem(supabaseAdmin, testUser.user, positionId, {
      type: TimelineType.COVER_LETTER,
      title: "Cover Letter",
      text: "Original cover letter",
      customInstructions: "Original instructions",
    });

    const res = await api.patch(`/api/timeline-items/${item.id}/custom-instructions`, {
      customInstructions: "Make it more concise",
    });

    // The controller returns 201 for this endpoint
    assert(res.status === 200 || res.status === 201);

    const data = await res.json();
    assertEquals(data.id, item.id);
  } finally {
    agentStub.restore();
    await teardown();
  }
});

// ############################################
// ### DELETE /api/timeline-items/:id
// ############################################

integrationTest("timeline-items: DELETE /:id removes the item", async () => {
  await setup();
  try {
    const item = await createTimelineItem(supabaseAdmin, testUser.user, positionId);

    const res = await api.delete(`/api/timeline-items/${item.id}`);
    assertEquals(res.status, 204);

    // Verify it's gone
    const getRes = await api.get(`/api/timeline-items/${item.id}`);
    assertEquals(getRes.status, 404);
  } finally {
    await teardown();
  }
});
