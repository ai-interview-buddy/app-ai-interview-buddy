import { SupabaseClient, User } from "npm:@supabase/supabase-js@2";
import { cvScoringAgent, cvScoringWeight } from "../agents/cvScoring.agent.ts";
import { CareerProfile, CareerProfileCreate, CareerProfileUpdate } from "../types/CareerProfile.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { readPdf } from "../utils/pdf.utils.ts";
import { convertMany, convertOne, convertStorageError, oneToDbCase, safeErrorLog } from "../utils/typeConvertion.utils.ts";

export const getAll = async (supabase: SupabaseClient): Promise<ServiceResponse<CareerProfile[]>> => {
  const query = await supabase.from("career_profile").select("id,title,curriculum_path,curriculum_score,updated_at");
  return convertMany(query);
};

export const getById = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<CareerProfile>> => {
  const query = await supabase.from("career_profile").select("*").eq("id", id).single();
  return convertOne(query);
};

export const getSignedUrlById = async (supabase: SupabaseClient, id: string) => {
  const response = await getById(supabase, id);
  if (response.error) return response;
  const result = await supabase.storage.from("curriculums").createSignedUrl(response.data.curriculumPath, 360);

  // TODO: review this in prod, maybe, to require some other workaround
  const url = result.data?.signedUrl;
  if (url?.includes("http://kong:8000/storage/v1")) {
    const newUrl = url.replace("http://kong:8000/storage/v1", `http://localhost:54321/storage/v1`);
    return {
      ...result,
      data: { ...result.data, signedUrl: newUrl },
    };
  }

  return result;
};

export const create = async (supabase: SupabaseClient, user: User, body: CareerProfileCreate): Promise<ServiceResponse<CareerProfile>> => {
  const { data, error } = await supabase.storage.from("curriculums").download(body.curriculumPath);

  if (error) return convertStorageError(error);

  const arrayBuffer = await data.arrayBuffer();
  const pdfContent = await readPdf(arrayBuffer);

  const agentOutput = await cvScoringAgent(pdfContent);

  const curriculumScore = agentOutput?.analysis.reduce((acc, curr) => {
    const weight = cvScoringWeight[curr.item] ?? 0;
    return acc + curr.score * weight;
  }, 0);

  const record = {
    accountId: user.id,
    title: agentOutput?.jobTitle,
    curriculumPath: body.curriculumPath,
    curriculumText: pdfContent.content,
    curriculumScore: Math.floor(curriculumScore ?? 0),
    curriculumAnalyse: agentOutput?.analysis,
  };

  const saved = await supabase.from("career_profile").insert(oneToDbCase(record)).select().single();

  return convertOne(saved);
};

export const update = async (
  supabase: SupabaseClient,
  id: string,
  updates: CareerProfileUpdate
): Promise<ServiceResponse<CareerProfile>> => {
  const updatedAt = new Date().toISOString();
  const value = oneToDbCase({ ...updates, updatedAt });
  const query = await supabase.from("career_profile").update(value).eq("id", id).select().single();
  return convertOne(query);
};

export const remove = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<null>> => {
  let file = "";
  try {
    const record = await getById(supabase, id);
    if (record.error) {
      return record;
    }

    if (record.data) {
      file = record.data.curriculumPath;
      await supabase.storage.from("curriculums").remove([file]);
    }
  } catch (error) {
    console.log(`failed to delete file ${file} while deleting career_profile ${id}: ${safeErrorLog(error)}`);
  }

  const query = await supabase.from("career_profile").delete().eq("id", id);
  return query;
};
