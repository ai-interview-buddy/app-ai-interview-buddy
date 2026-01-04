import { DeepgramParagraph } from "./InterviewQuestion.ts";

export type MockInterviewRequest = {
  profileId?: string;
  positionId?: string;
  customInstructions?: string;
};

export type MockInterviewResponse = {
  token: string;
};

export type MockInterviewAnalyseRequest = {
  positionId?: string;
  transcript: DeepgramParagraph[];
};
