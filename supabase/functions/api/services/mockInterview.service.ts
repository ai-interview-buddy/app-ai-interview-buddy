import { SupabaseClient, User } from "npm:@supabase/supabase-js@2";
import { buildMockInterviewInstructions } from "../agents/mockInterview.agent.ts";
import { getById as getCareerProfileById } from "./careerProfile.service.ts";
import { getById as getJobPositionById } from "./jobPosition.service.ts";
import {
  MockInterviewInstructionInput,
  MockInterviewInstructionPayload,
  MockInterviewRequest,
  MockInterviewResponse,
} from "../types/MockInterview.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { genericError } from "../utils/error.utils.ts";
import { safeErrorLog } from "../utils/typeConvertion.utils.ts";

const OPENAI_REALTIME_URL = "https://api.openai.com/v1/realtime/sessions";
const OPENAI_REALTIME_MODEL = "gpt-realtime-mini";
const MAX_CUSTOM_INSTRUCTION_LENGTH = 2000;

const sanitizeCustomInstructions = (customInstructions?: string | null): string | undefined => {
  if (!customInstructions) return undefined;
  const trimmed = customInstructions.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > MAX_CUSTOM_INSTRUCTION_LENGTH) {
    return trimmed.slice(0, MAX_CUSTOM_INSTRUCTION_LENGTH) + "…";
  }

  const lower = trimmed.toLowerCase();
  const bannedPatterns = [
    /(ignore|disregard|forget)\s+(all\s+)?(earlier|previous|above)\s+instructions/,
    /(override|bypass)\s+(these|the)\s+instructions/,
    /(act|pretend)\s+as\s+.*?(hacker|malicious|unethical)/,
  ];

  if (bannedPatterns.some((pattern) => pattern.test(lower))) {
    return undefined;
  }

  const relevantKeywords = [
    "interview",
    "candidate",
    "question",
    "role",
    "company",
    "job",
    "behaviour",
    "behavior",
    "culture",
    "strength",
    "weakness",
    "communication",
    "team",
  ];

  const isRelevant = relevantKeywords.some((keyword) => lower.includes(keyword));
  if (!isRelevant) {
    return undefined;
  }

  return trimmed;
};

const createInstructionPayload = (
  candidateProfile: MockInterviewInstructionInput["candidateProfile"],
  jobPosition: MockInterviewInstructionInput["jobPosition"],
  customInstructions?: string
): MockInterviewInstructionPayload => {
  const input: MockInterviewInstructionInput = {
    candidateProfile,
    jobPosition,
    customInstructions,
  };

  return buildMockInterviewInstructions(input);
};

const requestRealtimeSession = async (openAiKey: string) => {
  const response = await fetch(OPENAI_REALTIME_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_REALTIME_MODEL,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI realtime session error (${response.status}): ${errorBody}`);
  }

  const session = await response.json();
  const token = session?.client_secret?.value ?? session?.client_secret ?? null;

  if (!token || typeof token !== "string") {
    throw new Error("OpenAI realtime session did not return a client token");
  }

  return token;
};

export const createMockInterviewSession = async (
  supabase: SupabaseClient,
  user: User,
  payload: MockInterviewRequest
): Promise<ServiceResponse<MockInterviewResponse>> => {
  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return genericError("OpenAI API key is not configured");
    }

    let candidateProfile: MockInterviewInstructionInput["candidateProfile"] = undefined;
    let jobPosition: MockInterviewInstructionInput["jobPosition"] = undefined;

    if (payload.careerProfileId) {
      const { data, error } = await getCareerProfileById(supabase, payload.careerProfileId);
      if (error) {
        const message = error.message ?? safeErrorLog(error);
        throw new Error(`Failed to load career profile: ${message}`);
      }

      if (!data || data.accountId !== user.id) {
        throw new Error("Career profile not found");
      }

      candidateProfile = {
        title: data.title ?? null,
        curriculumText: data.curriculumText ?? null,
      };
    }

    if (payload.positionId) {
      const { data, error } = await getJobPositionById(supabase, payload.positionId);
      if (error) {
        const message = error.message ?? safeErrorLog(error);
        throw new Error(`Failed to load job position: ${message}`);
      }

      if (!data || data.accountId !== user.id) {
        throw new Error("Job position not found");
      }

      jobPosition = {
        jobTitle: data.jobTitle ?? null,
        companyName: data.companyName ?? null,
        jobDescription: data.jobDescription ?? null,
      };
    }

    const customInstructions = sanitizeCustomInstructions(payload.customInstructions);

    const instructionsPayload = createInstructionPayload(candidateProfile, jobPosition, customInstructions);
    const instructions = JSON.stringify(instructionsPayload);

    const token = await requestRealtimeSession(openAiKey);

    return {
      error: null,
      data: {
        token,
        instructions,
      },
      count: null,
    };
  } catch (error) {
    console.error(`Failed to create mock interview session: ${safeErrorLog(error)}`);
    return genericError("Unable to create mock interview session", error instanceof Error ? error.message : undefined);
  }
};
