export type MockInterviewRequest = {
  careerProfileId?: string;
  positionId?: string;
  customInstructions?: string;
};

export type MockInterviewResponse = {
  token: string;
  instructions: string;
};
