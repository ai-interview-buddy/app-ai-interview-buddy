import { SupabaseClient, User } from "@supabase/supabase-js";
import { buildMockInterviewInstructions } from "../agents/mockInterview.agent.ts";
import {
  MockInterviewRequest,
  MockInterviewResponse,
} from "../types/MockInterview.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { genericError } from "../utils/error.utils.ts";
import { safeErrorLog } from "../utils/typeConvertion.utils.ts";
import { getById as getCareerProfileById } from "./careerProfile.service.ts";
import { getById as getJobPositionById } from "./jobPosition.service.ts";

const OPENAI_REALTIME_URL = "https://api.openai.com/v1/realtime/sessions";
const OPENAI_REALTIME_MODEL = "gpt-realtime-mini";

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

    const {careerProfileId,positionId,customInstructions } = payload;

      const { data : candidateProfile, error: candidateProfileError } = careerProfileId ? await getCareerProfileById(supabase, careerProfileId): {};
      if (candidateProfileError) {
        const message = candidateProfileError.message ?? safeErrorLog(candidateProfileError);
        throw new Error(`Failed to load career profile: ${message}`);
      }


      const { data: jobPosition, error: jobPositionError } =positionId ? await getJobPositionById(supabase, positionId) : {};
      if (jobPositionError) {
        const message = jobPositionError.message ?? safeErrorLog(jobPositionError);
        throw new Error(`Failed to load job position: ${message}`);
      }


    const instructions = await buildMockInterviewInstructions(user, candidateProfile, jobPosition, customInstructions);

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
