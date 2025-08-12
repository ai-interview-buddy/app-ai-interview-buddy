export enum QuestionType {
  BEHAVIORAL = "BEHAVIORAL",
  TECHNICAL = "TECHNICAL",
  BACKGROUND_EXPERIENCE = "BACKGROUND_EXPERIENCE",
  GREETING_OR_CHIT_CHAT = "GREETING_OR_CHIT_CHAT",
}

export enum QuestionFormat {
  DEEPGRAM = "DEEPGRAM",
}

export interface InterviewQuestion {
  id: string;
  accountId: string;
  timelineItemId: string;

  // Extract
  questionNumber: number;
  questionType: QuestionType;
  questionTitle: string;
  questionFormat: QuestionFormat;
  questionJson: string;

  questionStartSecond?: number;
  answerStartSecond?: number;

  // Analyse
  structure?: number;
  relevance?: number;
  clarityConciseness?: number;
  specificityDetail?: number;
  actionsContribution?: number;
  resultsImpact?: number;
  competencyDemonstration?: number;
  score?: number; 

  feedback?: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface InterviewQuestionFilter {
  page?: number;
  size?: number;
  unpaged?: boolean;
  timelineItemId?: string;
  questionType?: QuestionType;
}


// ################################################
// ### other types
// ################################################

export enum InterviewRole {
  CANDIDATE = "CANDIDATE",
  INTERVIEWER = "INTERVIEWER",
}

interface DeepgramSentence {
  text: string;
  start: number;
  end: number;
}

export type DeepgramParagraph = {
  start: number;
  end: number;
  speaker: number;
  sentences: DeepgramSentence[];
  sentiment: string;
};

export interface SimplifiedParagraph {
  id: number;
  speaker: number;
  sentence: string;
}

export interface QuestionScoringInput {
  role: InterviewRole;
  sentence: string;
  sentiment: string;
  start: number;
  end: number;
}
