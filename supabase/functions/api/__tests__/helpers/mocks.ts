import { type Stub, stub } from "jsr:@std/testing/mock";
import cvScoringAgent from "../../agents/cvScoring.agent.ts";
import positionExtractorAgent from "../../agents/positionExtractor.agent.ts";
import PositionExtractorBasic from "../../agents/PositionExtractorBasic.agent.ts";
import FetchCleanText from "../../agents/tools/fetchCleanText.ts";
import coverLetterAgent from "../../agents/coverLetter.agent.ts";
import linkedinIntroAgent from "../../agents/linkedinIntro.agent.ts";
import replyEmailAgent from "../../agents/replyEmail.agent.ts";
import mockInterviewAgent from "../../agents/mockInterview.agent.ts";
import questionParserAgent from "../../agents/questionParser.agent.ts";
import questionScoringAgent from "../../agents/questionScoring.agent.ts";
import deepgramService from "../../services/deepgram.service.ts";
import TriggerTaskService from "../../utils/TriggerTask.utils.ts";

// ############################################
// ### Default mock responses
// ############################################

const defaultCvScoringResponse = {
  jobTitle: "Software Engineer",
  analysis: [
    { item: "ats", score: 8, feedback: "Good ATS formatting" },
    { item: "grammar", score: 7, feedback: "Minor grammar issues" },
    { item: "pages", score: 9, feedback: "Good length" },
    { item: "structure", score: 7, feedback: "Well structured" },
    { item: "content", score: 8, feedback: "Strong content" },
  ],
};

const defaultPositionExtractResponse = {
  companyName: "Acme Corp",
  companyLogo: null,
  companyWebsite: "https://acme.example.com",
  jobTitle: "Senior Software Engineer",
  jobDescription: "We are looking for a Senior Software Engineer with 5+ years of experience.",
  salaryRange: "$120,000 - $160,000",
};

const defaultBasicPositionExtractResponse = {
  companyName: "Acme Corp",
  jobTitle: "Senior Software Engineer",
  jobDescription: "We are looking for a Senior Software Engineer with 5+ years of experience.",
  salaryRange: "$120,000 - $160,000",
};

const defaultFetchCleanTextResponse = "Acme Corp - Senior Software Engineer. We are looking for a Senior Software Engineer with 5+ years of experience. Salary: $120,000 - $160,000";

const defaultCoverLetterResponse = "Dear Hiring Manager,\n\nI am writing to express my interest...";

const defaultLinkedinIntroResponse = "Hi there! I came across the Senior Engineer role at Acme Corp...";

const defaultReplyEmailResponse = {
  emailSubject: "RE: Interview Confirmation",
  emailBody: "Thank you for the opportunity. I confirm my availability...",
};

const defaultMockInterviewInstructions = "You are an experienced interviewer. Begin by greeting the candidate...";

const defaultQuestionParserResponse = {
  candidateId: 1,
  questions: [
    {
      qNum: 1,
      questionType: "BEHAVIORAL",
      question: "Tell me about a time you faced a challenge",
      questionSpeakerId: 0,
      questionFirstParagraphId: 0,
      answerLastParagraphId: 1,
    },
  ],
};

const defaultQuestionScoringResponse = {
  qNum: 1,
  evaluation: {
    structure: 7,
    relevance: 8,
    clarityConciseness: 7,
    specificityDetail: 6,
    actionsContribution: 7,
    resultsImpact: 6,
    competencyDemonstration: 7,
    feedback: "Good use of STAR method. Consider quantifying results more.",
  },
};

const defaultDeepgramResponse = {
  data: [
    {
      start: 0,
      end: 5,
      speaker: 0,
      sentences: [{ text: "Tell me about a challenge", start: 0, end: 5 }],
      sentiment: "neutral",
    },
    {
      start: 5,
      end: 15,
      speaker: 1,
      sentences: [{ text: "Sure, at my previous company I led a migration project...", start: 5, end: 15 }],
      sentiment: "positive",
    },
  ],
  error: null,
  count: 0,
};

// ############################################
// ### Stub helpers
// ############################################

// deno-lint-ignore no-explicit-any
export const stubCvScoring = (response?: any): Stub => {
  return stub(cvScoringAgent, "cvScoringAgent", () => Promise.resolve(response ?? defaultCvScoringResponse));
};

// deno-lint-ignore no-explicit-any
export const stubPositionExtractorFromUrl = (response?: any): Stub => {
  return stub(positionExtractorAgent, "extractPositionFromUrl", () => Promise.resolve(response ?? defaultPositionExtractResponse));
};

// deno-lint-ignore no-explicit-any
export const stubPositionExtractorFromDescription = (response?: any): Stub => {
  return stub(positionExtractorAgent, "extractPositionFromDescription", () =>
    Promise.resolve(response ?? defaultPositionExtractResponse),
  );
};

// deno-lint-ignore no-explicit-any
export const stubPositionExtractorBasic = (response?: any): Stub => {
  return stub(PositionExtractorBasic, "extractPositionBasic", () =>
    Promise.resolve(response ?? defaultBasicPositionExtractResponse),
  );
};

export const stubFetchCleanText = (response?: string): Stub => {
  return stub(FetchCleanText, "fetchJobPositionUrl", () => Promise.resolve(response ?? defaultFetchCleanTextResponse));
};

export const stubTriggerTask = (): Stub => {
  return stub(TriggerTaskService, "triggerTask", () => Promise.resolve());
};

export const stubCoverLetter = (response?: string): Stub => {
  return stub(coverLetterAgent, "generateCoverLetter", () => Promise.resolve(response ?? defaultCoverLetterResponse));
};

export const stubLinkedinIntro = (response?: string): Stub => {
  return stub(linkedinIntroAgent, "generateLinkedinIntro", () => Promise.resolve(response ?? defaultLinkedinIntroResponse));
};

// deno-lint-ignore no-explicit-any
export const stubReplyEmail = (response?: any): Stub => {
  return stub(replyEmailAgent, "generateReplyEmail", () => Promise.resolve(response ?? defaultReplyEmailResponse));
};

export const stubMockInterviewInstructions = (response?: string): Stub => {
  return stub(mockInterviewAgent, "buildMockInterviewInstructions", () =>
    Promise.resolve(response ?? defaultMockInterviewInstructions),
  );
};

// deno-lint-ignore no-explicit-any
export const stubQuestionParser = (response?: any): Stub => {
  return stub(questionParserAgent, "parseQuestions", () => Promise.resolve(response ?? defaultQuestionParserResponse));
};

// deno-lint-ignore no-explicit-any
export const stubQuestionScoring = (response?: any): Stub => {
  return stub(questionScoringAgent, "scoreQuestion", (_qNum: number) =>
    Promise.resolve(response ?? defaultQuestionScoringResponse),
  );
};

// deno-lint-ignore no-explicit-any
export const stubDeepgram = (response?: any): Stub => {
  return stub(deepgramService, "convertAudioFileToText", () => Promise.resolve(response ?? defaultDeepgramResponse));
};

/**
 * Stubs globalThis.fetch to intercept external calls while passing through Supabase requests.
 * Handles URL reachability checks (HEAD), OpenAI Realtime API, and falls through to
 * the real fetch for Supabase/localhost requests so that DB operations continue to work.
 */
export const stubGlobalFetchSmart = (realtimeToken?: string): Stub => {
  const originalFetch = globalThis.fetch;

  return stub(globalThis, "fetch", (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    const method = init?.method?.toUpperCase() ?? "GET";

    // Pass through Supabase / localhost requests to the real fetch
    if (url.includes("localhost") || url.includes("127.0.0.1")) {
      return originalFetch(input, init);
    }

    // URL reachability checks (HEAD requests from fetch.utils.ts)
    if (method === "HEAD") {
      return Promise.resolve(new Response(null, { status: 200 }));
    }

    // OpenAI Realtime API
    if (url.includes("openai.com/v1/realtime")) {
      return Promise.resolve(
        new Response(JSON.stringify({ value: realtimeToken ?? "mock-ephemeral-token" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      );
    }

    // Default: return 200 OK for any other external request
    return Promise.resolve(new Response(null, { status: 200 }));
  });
};

// ############################################
// ### Bulk stub/restore helpers
// ############################################

export interface StubCollection {
  stubs: Stub[];
  restore: () => void;
}

/**
 * Stubs all external agent dependencies at once.
 * Call `.restore()` in a finally block to clean up.
 */
export const stubAllAgents = (): StubCollection => {
  const stubs = [
    stubCvScoring(),
    stubPositionExtractorFromUrl(),
    stubPositionExtractorFromDescription(),
    stubPositionExtractorBasic(),
    stubFetchCleanText(),
    stubTriggerTask(),
    stubCoverLetter(),
    stubLinkedinIntro(),
    stubReplyEmail(),
    stubMockInterviewInstructions(),
    stubQuestionParser(),
    stubQuestionScoring(),
    stubDeepgram(),
    stubGlobalFetchSmart(),
  ];

  return {
    stubs,
    restore: () => stubs.forEach((s) => s.restore()),
  };
};
