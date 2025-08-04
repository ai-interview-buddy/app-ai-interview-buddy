export enum TimelineType {
  COVER_LETTER = "COVER_LETTER",
  NOTE = "NOTE",
  CV_ANALYSE = "CV_ANALYSE",
  INTERVIEW_STEP = "INTERVIEW_STEP",
  INTERVIEW_ANALYSE = "INTERVIEW_ANALYSE",
}

export interface TimelineItem {
  id: string;
  accountId: string;
  positionId: string;
  title: string;
  type: TimelineType;

  // For COVER_LETTER / NOTE
  text?: string;

  // For INTERVIEW_STEP
  interviewInstructions?: string;
  interviewScheduledDate?: Date;
  interviewInterviewerName?: string;

  // For INTERVIEW_ANALYSE
  interviewOriginalAudioPath?: string;
  interviewSpeechToTextPath?: string;
  interviewScore?: number;

  createdAt: Date;
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
