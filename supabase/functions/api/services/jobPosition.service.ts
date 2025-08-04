import { SupabaseClient, User } from "npm:@supabase/supabase-js@2";
import { extractPositionFromDescription, extractPositionFromUrl } from "../agents/positionExtractor.agent.ts";
import { JobPosition, JobPositionCreateByDescription, JobPositionCreateByUrl, JobPositionUpdate } from "../types/JobPosition.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { genericError } from "../utils/error.utils.ts";
import { isUrlReachable } from "../utils/fetch.utils.ts";
import { convertMany, convertOne, oneToDbCase, safeErrorLog } from "../utils/typeConvertion.utils.ts";

export const getAll = async (supabase: SupabaseClient): Promise<ServiceResponse<JobPosition[]>> => {
  const query = await supabase
    .from("job_position")
    .select(
      `id,career_profile_id,company_name,company_logo,company_website,job_url,job_title,salary_range,expected_salary,offer_received,archived,created_at,updated_at`
    );
  return convertMany(query);
};

export const getById = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<JobPosition>> => {
  const query = await supabase.from("job_position").select("*").eq("id", id).single();
  return convertOne(query);
};

const cleanInvalidURLs = async (url: string | null): Promise<string | null> => {
  if (!url) return null;
  const ok = await isUrlReachable(url);
  if (!ok) {
    console.log("Invalid URL " + url)
    return null;
  }
  return url;
};

export const createByUrl = async (
  supabase: SupabaseClient,
  user: User,
  params: JobPositionCreateByUrl
): Promise<ServiceResponse<JobPosition>> => {
  try {
    const extracted = await extractPositionFromUrl({
      profileId: params.profileId,
      jobUrl: params.jobUrl,
    });

    if (!extracted) return genericError("positionExtractor returned empty");

    const record = {
      accountId: user.id,
      careerProfileId: params.profileId,
      companyName: extracted.companyName,
      companyLogo: await cleanInvalidURLs(extracted.companyLogo),
      companyWebsite: await cleanInvalidURLs(extracted.companyWebsite),
      jobUrl: params.jobUrl,
      jobTitle: extracted.jobTitle,
      jobDescription: extracted.jobDescription,
      salaryRange: extracted.salaryRange,
      expectedSalary: null,
      offerReceived: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await supabase.from("job_position").insert(oneToDbCase(record)).select().single();

    return convertOne(saved);
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
    const extracted = await extractPositionFromDescription({
      profileId: params.profileId,
      jobDescription: params.jobDescription,
    });

    if (!extracted) return genericError("positionExtractor returned empty");

    const record = {
      accountId: user.id,
      careerProfileId: params.profileId,
      companyName: extracted.companyName,
      companyLogo: await cleanInvalidURLs(extracted.companyLogo),
      companyWebsite: await cleanInvalidURLs(extracted.companyWebsite),
      jobUrl: null,
      jobTitle: extracted.jobTitle,
      jobDescription: extracted.jobDescription,
      salaryRange: extracted.salaryRange,
      expectedSalary: null,
      offerReceived: false,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await supabase.from("job_position").insert(oneToDbCase(record)).select().single();

    return convertOne(saved);
  } catch (error) {
    console.error(`Failed to create job position by description: ${safeErrorLog(error)}`);
    throw error;
  }
};

export const update = async (supabase: SupabaseClient, id: string, updates: JobPositionUpdate): Promise<ServiceResponse<JobPosition>> => {
  try {
    const payload = oneToDbCase({
      ...updates,
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
    console.log(data);

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
