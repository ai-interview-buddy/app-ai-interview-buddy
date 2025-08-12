import { AgentInputItem } from "@openai/agents";
import { SupabaseClient, User } from "npm:@supabase/supabase-js@2";
import { generateCoverLetter } from "../agents/coverLetter.agent.ts";
import { generateLinkedinIntro } from "../agents/linkedinIntro.agent.ts";
import { generateReplyEmail } from "../agents/replyEmail.agent.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import {
  TimelineCoverLetter,
  TimelineCreateText,
  TimelineCustomInstructionsUpdate,
  TimelineFilter,
  TimelineInterviewAnalyse,
  TimelineItem,
  TimelineLinkedinIntro,
  TimelineReplyEmail,
  TimelineType,
} from "../types/TimelineItem.ts";
import { genericError } from "../utils/error.utils.ts";
import { convertMany, convertOne, oneToDbCase, safeErrorLog } from "../utils/typeConvertion.utils.ts";
import { getById as getCareerProfileById } from "./careerProfile.service.ts";
import { parseQuestionsByAudio } from "./interviewQuestion.service.ts";
import { getById as getJobPositionById } from "./jobPosition.service.ts";

export const getAll = async (supabase: SupabaseClient, params: TimelineFilter): Promise<ServiceResponse<TimelineItem[]>> => {
  let query = supabase
    .from("timeline_item")
    .select(`id,position_id,title,type,text,interview_scheduled_date,interview_interviewer_name,interview_score,created_at`)
    .order("created_at");

  if (params.jobPositionId) {
    query = query.eq("position_id", params.jobPositionId);
  }

  if (params.type) {
    query = query.eq("type", params.type);
  }

  if (params.unpaged) {
    const result = await query;
    return convertMany(result);
  } else if (params.page !== undefined && params.size !== undefined) {
    const from = params.page * params.size;
    const to = from + params.size - 1;
    const result = await query.range(from, to);
    return convertMany(result);
  } else {
    return genericError("Must provide either page & size, or unpaged=true for timeline-items listing");
  }
};

export const getById = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<TimelineItem>> => {
  const result = await supabase.from("timeline_item").select("*").eq("id", id).single();
  return convertOne(result);
};

export const createNote = async (
  supabase: SupabaseClient,
  user: User,
  body: TimelineCreateText
): Promise<ServiceResponse<TimelineItem>> => {
  try {
    const { data: jobPosition } = await getJobPositionById(supabase, body.positionId);
    if (!jobPosition) throw Error(`Invalid jobPosition ${body.positionId} for ${user.id}`);

    const record = {
      accountId: user.id,
      positionId: body.positionId,
      title: body.title,
      type: TimelineType.NOTE,
      text: body.text,
      createdAt: new Date().toISOString(),
    };
    const result = await supabase.from("timeline_item").insert(oneToDbCase(record)).select().single();
    return convertOne(result);
  } catch (err) {
    console.error(`Error creating NOTE timeline item: ${safeErrorLog(err)}`);
    return genericError("Failed to archive job positions", String(err));
  }
};

export const createCoverLetter = async (
  supabase: SupabaseClient,
  user: User,
  body: TimelineCoverLetter
): Promise<ServiceResponse<TimelineItem>> => {
  try {
    const { data: jobPosition } = await getJobPositionById(supabase, body.positionId);
    if (!jobPosition) throw Error(`Invalid jobPosition ${body.positionId} for ${user.id}`);
    const { data: careerPosition } = await getCareerProfileById(supabase, jobPosition!.careerProfileId);

    const letter = await generateCoverLetter(careerPosition!.curriculumText, jobPosition!.jobDescription, body.customInstructions);

    const record = {
      accountId: user.id,
      positionId: body.positionId,
      title: "Cover Letter",
      type: TimelineType.COVER_LETTER,
      text: letter,
      customInstructions: body.customInstructions,
      createdAt: new Date().toISOString(),
    };
    const result = await supabase.from("timeline_item").insert(oneToDbCase(record)).select().single();
    return convertOne(result);
  } catch (err) {
    console.error(`Error creating COVER_LETTER timeline item: ${safeErrorLog(err)}`);
    return genericError("Failed to create a timeline item", String(err));
  }
};

export const createLinkedinIntro = async (
  supabase: SupabaseClient,
  user: User,
  body: TimelineLinkedinIntro
): Promise<ServiceResponse<TimelineItem>> => {
  try {
    const { data: jobPosition } = await getJobPositionById(supabase, body.positionId);
    if (!jobPosition) throw Error(`Invalid jobPosition ${body.positionId} for ${user.id}`);
    const { data: careerPosition } = await getCareerProfileById(supabase, jobPosition!.careerProfileId);

    const output = await generateLinkedinIntro(
      careerPosition!.curriculumText,
      jobPosition!.jobDescription,
      body.customInstructions,
      body.greeting
    );

    const record = {
      accountId: user.id,
      positionId: body.positionId,
      title: "LinkedIn Intro",
      type: TimelineType.LINKEDIN_INTRO,
      text: output,
      customInstructions: body.customInstructions,
      createdAt: new Date().toISOString(),
    };
    const result = await supabase.from("timeline_item").insert(oneToDbCase(record)).select().single();
    return convertOne(result);
  } catch (err) {
    console.error(`Error creating LINKEDIN_INTRO timeline item: ${safeErrorLog(err)}`);
    return genericError("Failed to create a timeline item", String(err));
  }
};

export const createReplyEmail = async (
  supabase: SupabaseClient,
  user: User,
  body: TimelineReplyEmail
): Promise<ServiceResponse<TimelineItem>> => {
  try {
    const { data: jobPosition } = await getJobPositionById(supabase, body.positionId);
    if (!jobPosition) throw Error(`Invalid jobPosition ${body.positionId} for ${user.id}`);

    const output = await generateReplyEmail(jobPosition!.jobDescription, body.customInstructions, body.emailBody);

    const record = {
      accountId: user.id,
      positionId: body.positionId,
      title: output?.emailSubject || "Reply to an email",
      type: TimelineType.REPLY_EMAIL,
      text: output?.emailBody,
      customInstructions: body.customInstructions,
      createdAt: new Date().toISOString(),
    };
    const result = await supabase.from("timeline_item").insert(oneToDbCase(record)).select().single();
    return convertOne(result);
  } catch (err) {
    console.error(`Error creating REPLY_EMAIL timeline item: ${safeErrorLog(err)}`);
    return genericError("Failed to create a timeline item", String(err));
  }
};

export const createInterviewAnalyse = async (
  supabase: SupabaseClient,
  user: User,
  body: TimelineInterviewAnalyse
): Promise<ServiceResponse<TimelineItem>> => {
  try {
    console.log(`interviewAnalyse: starting to process ${body.interviewPath} for position ${body.positionId}`);

    const { data: jobPosition } = await getJobPositionById(supabase, body.positionId);
    if (!jobPosition) throw Error(`Invalid jobPosition ${body.positionId} for ${user.id}`);

    const record = {
      accountId: user.id,
      positionId: body.positionId,
      title: "Interview Feedback",
      type: TimelineType.INTERVIEW_ANALYSE,
      interviewOriginalAudioPath: body.interviewPath,
    };

    const result = await supabase.from("timeline_item").insert(oneToDbCase(record)).select().single();
    const saved: ServiceResponse<TimelineItem> = convertOne(result);
    console.log(`interviewAnalyse: saved timeline_item ${saved.data?.id}; ${saved.error?.message}; starting background-tasks`);

    EdgeRuntime.waitUntil(parseQuestionsByAudio(supabase, saved.data!));

    return saved;
  } catch (err) {
    console.error(`Error creating REPLY_EMAIL timeline item: ${safeErrorLog(err)}`);
    return genericError("Failed to create a timeline item", String(err));
  }
};

export const update = async (supabase: SupabaseClient, id: string, updates: TimelineItem): Promise<ServiceResponse<TimelineItem>> => {
  try {
    const payload = oneToDbCase({
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const query = await supabase.from("timeline_item").update(payload).eq("id", id).select().single();
    return convertOne(query);
  } catch (error) {
    console.error(`Failed to update timeline item ${id}: ${safeErrorLog(error)}`);
    throw error;
  }
};

export const updateCustomInstructions = async (
  supabase: SupabaseClient,
  id: string,
  body: TimelineCustomInstructionsUpdate
): Promise<ServiceResponse<TimelineItem>> => {
  try {
    const { data: record } = await getById(supabase, id);
    if (!record) throw Error(`Failed to retrieve timeline item ${id}`);

    const extraMessages: AgentInputItem[] = [
      { role: "assistant", status: "completed", content: [{ type: "output_text", text: record.text || "" }] },
      { role: "user", content: [{ type: "input_text", text: body.customInstructions }] },
    ];

    const { data: jobPosition } = await getJobPositionById(supabase, record.positionId);
    const { data: careerPosition } = await getCareerProfileById(supabase, jobPosition!.careerProfileId);

    let output: string | undefined;

    switch (record.type) {
      case TimelineType.LINKEDIN_INTRO:
        output = await generateLinkedinIntro(
          careerPosition!.curriculumText,
          jobPosition!.jobDescription,
          record?.customInstructions || "",
          "",
          extraMessages
        );
        break;

      case TimelineType.COVER_LETTER:
        output = await generateCoverLetter(careerPosition!.curriculumText, jobPosition!.jobDescription, body.customInstructions);
        break;

      case TimelineType.REPLY_EMAIL: {
        const result = await generateReplyEmail(jobPosition!.jobDescription, body.customInstructions, "not available");
        output = result?.emailBody;
        break;
      }

      default:
        throw new Error("invalid type");
    }

    const payload = oneToDbCase({
      text: output,
      customInstructions: body.customInstructions,
      updatedAt: new Date().toISOString(),
    });

    const result = await supabase.from("timeline_item").update(payload).eq("id", id).select().single();
    return convertOne(result);
  } catch (err) {
    console.error(`Error updating custom instructions: ${safeErrorLog(err)}`);
    return genericError("Failed to update timeline item", String(err));
  }
};

export const remove = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<null>> => {
  try {
    return await supabase.from("timeline_item").delete().eq("id", id);
  } catch (err) {
    console.error(`Error deleting timeline item ${id}: ${safeErrorLog(err)}`);
    throw err;
  }
};
