import { SupabaseClient, User } from "@supabase/supabase-js";
import { CareerProfile } from "../../types/CareerProfile.ts";
import { InterviewQuestion, QuestionFormat, QuestionType } from "../../types/InterviewQuestion.ts";
import { JobPosition } from "../../types/JobPosition.ts";
import { TimelineItem, TimelineType } from "../../types/TimelineItem.ts";
import { supabaseAdmin } from "./setup.ts";

// ############################################
// ### Test User
// ############################################

export interface TestUser {
  user: User;
  accessToken: string;
}

export const createTestUser = async (overrides?: { email?: string; password?: string }): Promise<TestUser> => {
  const email = overrides?.email ?? `test-${crypto.randomUUID()}@test.local`;
  const password = overrides?.password ?? "test-password-123!";

  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name: "Test User" },
  });

  if (createError || !created.user) {
    throw new Error(`Failed to create test user: ${createError?.message}`);
  }

  const { data: session, error: signInError } = await supabaseAdmin.auth.signInWithPassword({ email, password });

  if (signInError || !session.session) {
    throw new Error(`Failed to sign in test user: ${signInError?.message}`);
  }

  return {
    user: created.user,
    accessToken: session.session.access_token,
  };
};

// ############################################
// ### Career Profile
// ############################################

export const buildCareerProfile = (overrides?: Partial<CareerProfile>): CareerProfile => ({
  id: crypto.randomUUID(),
  accountId: crypto.randomUUID(),
  title: "Software Engineer",
  curriculumPath: `${crypto.randomUUID()}/cv.pdf`,
  curriculumText: "John Doe - Software Engineer with 5 years of experience in TypeScript, React, and Node.js.",
  curriculumScore: 75,
  curriculumAnalyse: JSON.stringify([
    { item: "ats", score: 8, feedback: "Good ATS formatting" },
    { item: "grammar", score: 7, feedback: "Minor grammar issues" },
    { item: "pages", score: 9, feedback: "Good length" },
    { item: "structure", score: 7, feedback: "Well structured" },
    { item: "content", score: 8, feedback: "Strong content" },
  ]),
  ...overrides,
});

export const createCareerProfile = async (
  supabase: SupabaseClient,
  user: User,
  overrides?: Partial<CareerProfile>,
): Promise<CareerProfile> => {
  const profile = buildCareerProfile({ accountId: user.id, ...overrides });
  const { id: _id, ...record } = profile;

  const { data, error } = await supabase
    .from("career_profile")
    .insert({
      account_id: record.accountId,
      title: record.title,
      curriculum_path: record.curriculumPath,
      curriculum_text: record.curriculumText,
      curriculum_score: record.curriculumScore,
      curriculum_analyse: record.curriculumAnalyse,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create career profile: ${error.message}`);
  return { ...profile, id: data.id };
};

// ############################################
// ### Job Position
// ############################################

export const buildJobPosition = (overrides?: Partial<JobPosition>): JobPosition => ({
  id: crypto.randomUUID(),
  accountId: crypto.randomUUID(),
  careerProfileId: undefined,
  companyName: "Acme Corp",
  companyLogo: undefined,
  companyWebsite: "https://acme.example.com",
  jobUrl: "https://jobs.example.com/senior-engineer",
  jobTitle: "Senior Software Engineer",
  jobDescription: "We are looking for a Senior Software Engineer to join our team. Requirements: 5+ years experience with TypeScript.",
  salaryRange: "$120,000 - $160,000",
  expectedSalary: undefined,
  offerReceived: false,
  archived: false,
  processingStatus: "COMPLETED",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createJobPosition = async (
  supabase: SupabaseClient,
  user: User,
  overrides?: Partial<JobPosition>,
): Promise<JobPosition> => {
  const position = buildJobPosition({ accountId: user.id, ...overrides });
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("job_position")
    .insert({
      account_id: user.id,
      career_profile_id: position.careerProfileId ?? null,
      company_name: position.companyName,
      company_logo: position.companyLogo ?? null,
      company_website: position.companyWebsite ?? null,
      job_url: position.jobUrl ?? null,
      job_title: position.jobTitle,
      job_description: position.jobDescription,
      salary_range: position.salaryRange ?? null,
      expected_salary: position.expectedSalary ?? null,
      offer_received: position.offerReceived,
      archived: position.archived,
      processing_status: position.processingStatus ?? "COMPLETED",
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create job position: ${error.message}`);
  return { ...position, id: data.id, createdAt: new Date(data.created_at), updatedAt: new Date(data.updated_at) };
};

// ############################################
// ### Timeline Item
// ############################################

export const buildTimelineItem = (overrides?: Partial<TimelineItem>): TimelineItem => ({
  id: crypto.randomUUID(),
  accountId: crypto.randomUUID(),
  positionId: undefined,
  title: "Test Timeline Item",
  type: TimelineType.NOTE,
  text: "This is a test note for the timeline.",
  customInstructions: undefined,
  interviewInstructions: undefined,
  interviewScheduledDate: undefined,
  interviewInterviewerName: undefined,
  interviewOriginalAudioPath: undefined,
  interviewSpeechToTextPath: undefined,
  interviewScore: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createTimelineItem = async (
  supabase: SupabaseClient,
  user: User,
  positionId: string,
  overrides?: Partial<TimelineItem>,
): Promise<TimelineItem> => {
  const item = buildTimelineItem({ accountId: user.id, positionId, ...overrides });
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("timeline_item")
    .insert({
      account_id: user.id,
      position_id: positionId,
      title: item.title,
      type: item.type,
      text: item.text ?? null,
      custom_instructions: item.customInstructions ?? null,
      interview_instructions: item.interviewInstructions ?? null,
      interview_scheduled_date: item.interviewScheduledDate ?? null,
      interview_interviewer_name: item.interviewInterviewerName ?? null,
      interview_original_audio_path: item.interviewOriginalAudioPath ?? null,
      interview_speech_to_text_path: item.interviewSpeechToTextPath ?? null,
      interview_score: item.interviewScore ?? null,
      created_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create timeline item: ${error.message}`);
  return { ...item, id: data.id, createdAt: new Date(data.created_at), updatedAt: new Date(data.updated_at) };
};

// ############################################
// ### Interview Question
// ############################################

export const buildInterviewQuestion = (overrides?: Partial<InterviewQuestion>): InterviewQuestion => ({
  id: crypto.randomUUID(),
  accountId: crypto.randomUUID(),
  timelineItemId: crypto.randomUUID(),
  questionNumber: 1,
  questionType: QuestionType.BEHAVIORAL,
  questionTitle: "Tell me about a time you faced a challenge at work",
  questionFormat: QuestionFormat.DEEPGRAM,
  questionJson: JSON.stringify([
    { start: 0, end: 5, speaker: 0, sentences: [{ text: "Tell me about a challenge", start: 0, end: 5 }], sentiment: "neutral" },
  ]),
  questionStartSecond: 0,
  answerStartSecond: 5,
  structure: 7,
  relevance: 8,
  clarityConciseness: 7,
  specificityDetail: 6,
  actionsContribution: 7,
  resultsImpact: 6,
  competencyDemonstration: 7,
  score: 7,
  feedback: "Good use of STAR method. Consider quantifying your results more.",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

export const createInterviewQuestion = async (
  supabase: SupabaseClient,
  user: User,
  timelineItemId: string,
  overrides?: Partial<InterviewQuestion>,
): Promise<InterviewQuestion> => {
  const question = buildInterviewQuestion({ accountId: user.id, timelineItemId, ...overrides });

  const { data, error } = await supabase
    .from("interview_question")
    .insert({
      account_id: user.id,
      timeline_item_id: timelineItemId,
      question_number: question.questionNumber,
      question_type: question.questionType,
      question_title: question.questionTitle,
      question_format: question.questionFormat,
      question_json: question.questionJson,
      question_start_second: question.questionStartSecond ?? null,
      answer_start_second: question.answerStartSecond ?? null,
      structure: question.structure ?? null,
      relevance: question.relevance ?? null,
      clarity_conciseness: question.clarityConciseness ?? null,
      specificity_detail: question.specificityDetail ?? null,
      actions_contribution: question.actionsContribution ?? null,
      results_impact: question.resultsImpact ?? null,
      competency_demonstration: question.competencyDemonstration ?? null,
      score: question.score ?? null,
      feedback: question.feedback ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create interview question: ${error.message}`);
  return { ...question, id: data.id, createdAt: new Date(data.created_at), updatedAt: new Date(data.updated_at) };
};
