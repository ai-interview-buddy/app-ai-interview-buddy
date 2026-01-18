import { DeepgramParagraph } from "./InterviewQuestion.ts";

export type MockInterviewVoice = {
  name: string;
  weight: number;
};

export type MockInterviewRequest = {
  profileId?: string;
  positionId?: string;
  customInstructions?: string;
};

export type MockInterviewResponse = {
  token: string;
  instructions: string;
  voice: string;
};

export type MockInterviewAnalyseRequest = {
  positionId?: string;
  transcript: DeepgramParagraph[];
};
