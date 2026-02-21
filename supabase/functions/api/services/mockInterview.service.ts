import { SupabaseClient, User } from "@supabase/supabase-js";
import mockInterviewAgent from "../agents/mockInterview.agent.ts";
import { MockInterviewAnalyseRequest, MockInterviewRequest, MockInterviewResponse, MockInterviewVoice } from "../types/MockInterview.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { TimelineItem, TimelineType } from "../types/TimelineItem.ts";
import { genericError } from "../utils/error.utils.ts";
import { safeErrorLog } from "../utils/typeConvertion.utils.ts";
import { getById as getCareerProfileById } from "./careerProfile.service.ts";
import { parseQuestionsByTranscript } from "./interviewQuestion.service.ts";
import { getById as getJobPositionById } from "./jobPosition.service.ts";
import { create as createTimeline } from "./timelineItem.service.ts";

const OPENAI_REALTIME_URL = "https://api.openai.com/v1/realtime/client_secrets";
const OPENAI_REALTIME_MODEL = "gpt-realtime-mini";

const voices: MockInterviewVoice[] = [
  // We recommend marin and cedar for best quality.
  { name: "marin", weight: 1 },
  { name: "cedar", weight: 1 },

  // other voices
  { name: "alloy", weight: 0.6 },
  { name: "ash", weight: 0.6 },
  { name: "ballad", weight: 0.6 },
  { name: "coral", weight: 0.6 },
  { name: "echo", weight: 0.6 },
  { name: "sage", weight: 0.6 },
  { name: "shimmer", weight: 0.6 },
  { name: "verse", weight: 0.6 },
];

const requestRealtimeSession = async (openAiKey: string, instructions: string, voice: string) => {
  const response = await fetch(OPENAI_REALTIME_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openAiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session: {
        type: "realtime",
        instructions,
        model: OPENAI_REALTIME_MODEL,
        audio: {
          input: {
            transcription: {
              language: "en",
              model: "gpt-4o-mini-transcribe", // Enable transcription of user's audio
            },
          },
          output: { voice },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI realtime session error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const token = data?.value ?? null;

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

    const { profileId, positionId, customInstructions } = payload;

    const { data: candidateProfile, error: candidateProfileError } = profileId ? await getCareerProfileById(supabase, profileId) : {};
    if (candidateProfileError) {
      const message = candidateProfileError.message ?? safeErrorLog(candidateProfileError);
      throw new Error(`Failed to load career profile: ${message}`);
    }

    const { data: jobPosition, error: jobPositionError } = positionId ? await getJobPositionById(supabase, positionId) : {};
    if (jobPositionError) {
      const message = jobPositionError.message ?? safeErrorLog(jobPositionError);
      throw new Error(`Failed to load job position: ${message}`);
    }

    const voice = getRandomVoice();
    const instructions = await mockInterviewAgent.buildMockInterviewInstructions(user, candidateProfile, jobPosition, customInstructions);

    const token = await requestRealtimeSession(openAiKey, instructions, voice);

    return {
      error: null,
      data: {
        token,
        instructions,
        voice,
      },
      count: null,
    };
  } catch (error) {
    console.error(`Failed to create mock interview session: ${safeErrorLog(error)}`);
    return genericError("Unable to create mock interview session", error instanceof Error ? error.message : undefined);
  }
};

export const analyseMockInterview = async (
  supabase: SupabaseClient,
  user: User,
  payload: MockInterviewAnalyseRequest
): Promise<ServiceResponse<TimelineItem>> => {
  try {
    const { positionId, transcript } = payload;

    // 1. Create a TimelineItem of type MOCK_ANALYSE
    const newInterview: Partial<TimelineItem> = {
      accountId: user.id,
      type: TimelineType.MOCK_ANALYSE,
      title: "Mock Interview Review",
      positionId: positionId,
      interviewScore: 0,
      text: "",
    };

    const { data: timelineItem, error: timelineError } = await createTimeline(supabase, newInterview);
    if (timelineError || !timelineItem) {
      throw new Error(`Failed to create timeline item: ${timelineError?.message}`);
    }

    // 2. Trigger analysis background task (which now also supports direct transcript)
    // We don't await this if we want it to be background, but here we probably want to return the result or at least start it.
    // The user request implies they want to wait for it or redirect to the item.
    // In parseQuestionsByAudio it was a background task in some contexts, but here it's a direct service call.
    await parseQuestionsByTranscript(supabase, timelineItem, transcript);

    return {
      error: null,
      data: timelineItem,
      count: null,
    };
  } catch (error) {
    console.error(`Failed to analyse mock interview: ${safeErrorLog(error)}`);
    return genericError("Unable to analyse mock interview", error instanceof Error ? error.message : undefined);
  }
};

const getRandomVoice = () => {
  const totalWeight = voices.reduce((acc, voice) => acc + voice.weight, 0);
  let random = Math.random() * totalWeight;
  for (const voice of voices) {
    random -= voice.weight;
    if (random < 0) {
      return voice.name;
    }
  }
  return voices[0].name;
};
