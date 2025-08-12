import { createClient, DeepgramResponse, SyncPrerecordedResponse } from "@deepgram/sdk";
import { Buffer } from 'node:buffer';
import { SupabaseClient } from "npm:@supabase/supabase-js@2";
import { isLocal } from "../middlewares/supabaseContext.middleware.ts";
import { DeepgramParagraph } from "../types/InterviewQuestion.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { genericError } from "../utils/error.utils.ts";
const deepgramApiKey = Deno.env.get("DEEPGRAM_API_KEY");

const deepgramSTT = {
  model: "nova-3",
  smart_format: true,
  diarize: true,
  sentiment: true,
};

export const convertAudioFileToText = async (supabase: SupabaseClient, filePath: string): Promise<ServiceResponse<DeepgramParagraph[]>> => {
  console.log(`interviewAnalyse: deepgram parsing ${filePath}`);
  const deepgram = createClient(deepgramApiKey);

  if (isLocal) {
    console.log(`interviewAnalyse: deepgram using local storage to upload a file ${filePath}`);
    const { data, error } = await supabase.storage.from("interviews").download(filePath);
    if (error || !data) {
      return genericError("Failed to download" + (error.message || filePath));
    }

    const arr = await (data as Blob).arrayBuffer();
    const buffer: Buffer = Buffer.from(arr);

    const response = await deepgram.listen.prerecorded.transcribeFile(buffer, deepgramSTT);
    return processResult(response);
  }

  console.log(`interviewAnalyse: deepgram using global signed url ${filePath}`);
  const { data, error } = await supabase.storage.from("interviews").createSignedUrl(filePath, 3600);
  if (error || !data) {
    return genericError("Failed to issue url" + (error.message || filePath));
  }
  const url = data?.signedUrl;
  const response = await deepgram.listen.prerecorded.transcribeUrl({ url: url }, deepgramSTT);
  return processResult(response);
};

const processResult = (response: DeepgramResponse<SyncPrerecordedResponse>): ServiceResponse<DeepgramParagraph[]> => {
  const { error, result } = response;
  if (error || !result) {
    return genericError("Failed to download " + error!.message);
  }

  const paragraphs = result.results.channels[0].alternatives[0].paragraphs?.paragraphs as unknown as DeepgramParagraph[];

  return { data: paragraphs, error: null, count: 0 };
};
