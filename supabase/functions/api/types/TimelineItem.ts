export enum TimelineType {
  COVER_LETTER = "COVER_LETTER",
  LINKEDIN_INTRO = "LINKEDIN_INTRO",
  NOTE = "NOTE",
  REPLY_EMAIL = "REPLY_EMAIL",
  CV_ANALYSE = "CV_ANALYSE",
  INTERVIEW_STEP = "INTERVIEW_STEP",
  INTERVIEW_ANALYSE = "INTERVIEW_ANALYSE",
  MOCK_ANALYSE = "MOCK_ANALYSE",
}

export interface TimelineItem {
  id: string;
  accountId: string;
  positionId?: string;
  title: string;
  type: TimelineType;

  // For COVER_LETTER / NOTE / LINKEDIN_INTRO / REPLY_EMAIL
  text?: string;
  customInstructions?: string;

  // For INTERVIEW_STEP
  interviewInstructions?: string;
  interviewScheduledDate?: Date;
  interviewInterviewerName?: string;

  // For INTERVIEW_ANALYSE
  interviewOriginalAudioPath?: string;
  interviewSpeechToTextPath?: string;
  interviewScore?: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineFilter {
  page?: number;
  size?: number;
  unpaged?: boolean;
  jobPositionId?: string;
  type?: string;
}

export interface TimelineCreateText {
  positionId: string;
  title: string;
  text: string;
}

export interface TimelineCoverLetter {
  positionId: string;
  customInstructions: string;
}

export interface TimelineLinkedinIntro {
  positionId: string;
  greeting?: string;
  customInstructions: string;
}

export interface TimelineReplyEmail {
  positionId: string;
  emailBody: string;
  customInstructions: string;
}

export interface TimelineInterviewAnalyse {
  positionId?: string;
  interviewPath: string;
}

export interface TimelineCustomInstructionsUpdate {
  customInstructions: string;
}

export const isInterviewAnalyseType = (type: string): boolean =>
  type === TimelineType.INTERVIEW_ANALYSE || type === TimelineType.MOCK_ANALYSE;

export type SignedUrl = {
  signedUrl: string;
};
