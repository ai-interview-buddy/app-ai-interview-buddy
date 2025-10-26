export type MockInterviewRequest = {
  careerProfileId?: string;
  positionId?: string;
  customInstructions?: string;
};

export type MockInterviewContextMessage = {
  role: "system" | "user";
  content: string;
};

export type MockInterviewInstructionPayload = {
  systemInstruction: string;
  contextMessages: MockInterviewContextMessage[];
};

export type MockInterviewResponse = {
  token: string;
  instructions: string;
};

export type MockInterviewInstructionInput = {
  candidateProfile?: {
    title?: string | null;
    curriculumText?: string | null;
  } | null;
  jobPosition?: {
    jobTitle?: string | null;
    companyName?: string | null;
    jobDescription?: string | null;
  } | null;
  customInstructions?: string;
};
