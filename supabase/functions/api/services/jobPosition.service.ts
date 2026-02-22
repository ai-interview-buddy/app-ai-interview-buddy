import { SupabaseClient, User } from "@supabase/supabase-js";
import PositionExtractorBasic from "../agents/PositionExtractorBasic.agent.ts";
import FetchCleanText from "../agents/tools/fetchCleanText.ts";
import { JobPosition, JobPositionCreateByDescription, JobPositionCreateByUrl, JobPositionUpdate } from "../types/JobPosition.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { genericError } from "../utils/error.utils.ts";
import TriggerTaskService from "../utils/TriggerTask.utils.ts";
import { convertMany, convertOne, oneToDbCase, safeErrorLog } from "../utils/typeConvertion.utils.ts";

export const getAll = async (supabase: SupabaseClient): Promise<ServiceResponse<JobPosition[]>> => {
  const query = await supabase
    .from("job_position")
    .select(
      `id,career_profile_id,company_name,company_logo,company_website,job_url,job_title,salary_range,expected_salary,offer_received,archived,processing_status,created_at,updated_at`
    )
    .order("updated_at", { ascending: false });
  return convertMany(query);
};

export const getById = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<JobPosition>> => {
  const query = await supabase.from("job_position").select("*").eq("id", id).single();
  return convertOne(query);
};

export const createByUrl = async (
  supabase: SupabaseClient,
  user: User,
  params: JobPositionCreateByUrl
): Promise<ServiceResponse<JobPosition>> => {
  try {
    // Phase 1: Fetch URL content
    const pageText = await FetchCleanText.fetchJobPositionUrl(params.jobUrl);

    // Phase 2: Extract basic fields with lightweight AI agent
    const extracted = await PositionExtractorBasic.extractPositionBasic(pageText);
    if (!extracted) return genericError("positionExtractorBasic returned empty");

    // Phase 3: Insert with pending status
    const record = {
      accountId: user.id,
      careerProfileId: params.profileId,
      companyName: extracted.companyName,
      companyLogo: null,
      companyWebsite: null,
      jobUrl: params.jobUrl,
      jobTitle: extracted.jobTitle,
      jobDescription: extracted.jobDescription,
      salaryRange: extracted.salaryRange,
      rawJobDescription: pageText,
      expectedSalary: null,
      offerReceived: false,
      archived: false,
      processingStatus: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await supabase.from("job_position").insert(oneToDbCase(record)).select().single();
    const result = convertOne<JobPosition>(saved);

    // Phase 4: Queue AI enrichment (fire-and-forget)
    if (result.data) {
      TriggerTaskService.triggerTask("enrich-job-position", { jobPositionId: result.data.id });
    }

    return result;
  } catch (error) {
    console.error(`Failed to create job position by URL: ${safeErrorLog(error)}`);
    throw error;
  }
};

export const createByDescription = async (
  supabase: SupabaseClient,
  user: User,
  params: JobPositionCreateByDescription
): Promise<ServiceResponse<JobPosition>> => {
  try {
    // Phase 1: Extract basic fields with lightweight AI agent
    const extracted = await PositionExtractorBasic.extractPositionBasic(params.jobDescription);
    if (!extracted) return genericError("positionExtractorBasic returned empty");

    // Phase 2: Insert with pending status
    const record = {
      accountId: user.id,
      careerProfileId: params.profileId,
      companyName: extracted.companyName,
      companyLogo: null,
      companyWebsite: null,
      jobUrl: null,
      jobTitle: extracted.jobTitle,
      jobDescription: extracted.jobDescription,
      salaryRange: extracted.salaryRange,
      rawJobDescription: params.jobDescription,
      expectedSalary: null,
      offerReceived: false,
      archived: false,
      processingStatus: "PENDING",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await supabase.from("job_position").insert(oneToDbCase(record)).select().single();
    const result = convertOne<JobPosition>(saved);

    // Phase 3: Queue AI enrichment (fire-and-forget)
    if (result.data) {
      TriggerTaskService.triggerTask("enrich-job-position", { jobPositionId: result.data.id });
    }

    return result;
  } catch (error) {
    console.error(`Failed to create job position by description: ${safeErrorLog(error)}`);
    throw error;
  }
};

export const update = async (supabase: SupabaseClient, id: string, updates: JobPositionUpdate): Promise<ServiceResponse<JobPosition>> => {
  try {
    const actualUpdates = { ...updates, careerProfileId: updates.careerProfileId ? updates.careerProfileId : null };
    const payload = oneToDbCase({
      ...actualUpdates,
      updatedAt: new Date().toISOString(),
    });
    const query = await supabase.from("job_position").update(payload).eq("id", id).select().single();
    return convertOne(query);
  } catch (error) {
    console.error(`Failed to update job position ${id}: ${safeErrorLog(error)}`);
    throw error;
  }
};

export const remove = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<null>> => {
  try {
    const query = await supabase.from("job_position").delete().eq("id", id);
    return query;
  } catch (error) {
    console.error(`Failed to delete job position ${id}: ${safeErrorLog(error)}`);
    throw error;
  }
};

export const archiveMany = async (supabase: SupabaseClient, ids: string[]): Promise<ServiceResponse<null>> => {
  try {
    const { data, error } = await supabase.from("job_position").select("id, archived").in("id", ids);

    if (error) return genericError(error.message);
    if (!data || data.length !== ids.length) {
      return genericError("One or more job positions not found or do not belong to user");
    }

    const updatePromises = data.map((item: { id: string; archived: boolean }) =>
      supabase.from("job_position").update({ archived: !item.archived, updated_at: new Date().toISOString() }).eq("id", item.id)
    );

    const results = await Promise.all(updatePromises);

    const anyErrors = results.find((r) => r.error);
    if (anyErrors) return genericError(anyErrors.error!.message);

    return { error: null, data: null, count: null };
  } catch (err) {
    return genericError("Failed to archive job positions", String(err));
  }
};

export const markOfferReceived = async (supabase: SupabaseClient, ids: string[]): Promise<ServiceResponse<null>> => {
  try {
    const { data, error } = await supabase.from("job_position").select("id").in("id", ids);

    if (error) return genericError(error.message);
    if (!data || data.length !== ids.length) {
      return genericError("One or more job positions not found or do not belong to user");
    }

    const updatePromises = data.map((item: { id: string }) =>
      supabase.from("job_position").update({ offer_received: true, updated_at: new Date().toISOString() }).eq("id", item.id)
    );

    const results = await Promise.all(updatePromises);

    const anyErrors = results.find((r) => r.error);
    if (anyErrors) return genericError(anyErrors.error!.message);

    return { error: null, data: null, count: null };
  } catch (err) {
    return genericError("Failed to mark offer received for job positions", String(err));
  }
};
