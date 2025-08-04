import { SupabaseClient, User } from "npm:@supabase/supabase-js@2";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { convertMany, convertOne, oneToDbCase, safeErrorLog } from "../utils/typeConvertion.utils.ts";
import { TimelineFilter, TimelineCoverLetter, TimelineCreateText, TimelineItem, TimelineType } from "../types/TimelineItem.ts";
import { genericError } from "../utils/error.utils.ts";

export const getAll = async (supabase: SupabaseClient, params: TimelineFilter): Promise<ServiceResponse<TimelineItem[]>> => {
  let query = supabase
    .from("timeline_item")
    .select(`id,position_id,title,type,text,interview_scheduled_date,interview_interviewer_name,interview_score,created_at`);

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
    const record = {
      accountId: user.id,
      positionId: body.positionId,
      title: "Cover Letter",
      type: TimelineType.COVER_LETTER,
      text: body.customInstructions,
      createdAt: new Date().toISOString(),
    };
    const result = await supabase.from("timeline_item").insert(oneToDbCase(record)).select().single();
    return convertOne(result);
  } catch (err) {
    console.error(`Error creating COVER_LETTER timeline item: ${safeErrorLog(err)}`);
    return genericError("Failed to archive job positions", String(err));
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
