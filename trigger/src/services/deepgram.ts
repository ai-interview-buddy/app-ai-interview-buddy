import { createClient } from "@deepgram/sdk";
import { SupabaseClient } from "@supabase/supabase-js";

const deepgramApiKey = process.env.DEEPGRAM_API_KEY;

export interface DeepgramSentence {
  text: string;
  start: number;
  end: number;
}

export interface DeepgramParagraph {
  start: number;
  end: number;
  speaker: number;
  sentences: DeepgramSentence[];
  sentiment: string;
}

const deepgramSTT = {
  model: "nova-3",
  detect_language: true,
  smart_format: true,
  diarize: true,
  sentiment: true,
};

export const convertAudioFileToText = async (
  supabase: SupabaseClient,
  filePath: string
): Promise<{ data: DeepgramParagraph[] | null; error: string | null }> => {
  console.log(`interviewAnalyse: deepgram parsing ${filePath}`);
  const deepgram = createClient(deepgramApiKey);

  const supabaseUrl = process.env.SUPABASE_URL ?? "";
  const isLocal = supabaseUrl.startsWith("http://kong:") || supabaseUrl.includes("localhost");

  if (isLocal) {
    console.log(`interviewAnalyse: deepgram using local storage to upload a file ${filePath}`);
    const { data, error } = await supabase.storage.from("interviews").download(filePath);
    if (error || !data) {
      return { data: null, error: "Failed to download " + (error?.message || filePath) };
    }

    const arr = await (data as Blob).arrayBuffer();
    const buffer = Buffer.from(arr);

    const response = await deepgram.listen.prerecorded.transcribeFile(buffer, deepgramSTT);
    return processResult(response);
  }

  console.log(`interviewAnalyse: deepgram using global signed url ${filePath}`);
  const { data, error } = await supabase.storage.from("interviews").createSignedUrl(filePath, 3600);
  if (error || !data) {
    return { data: null, error: "Failed to issue url " + (error?.message || filePath) };
  }
  const url = data?.signedUrl;
  const response = await deepgram.listen.prerecorded.transcribeUrl({ url: url }, deepgramSTT);
  return processResult(response);
};

// deno-lint-ignore no-explicit-any
const processResult = (response: any): { data: DeepgramParagraph[] | null; error: string | null } => {
  const { error, result } = response;
  if (error || !result) {
    return { data: null, error: "Failed to process " + error?.message };
  }

  const paragraphs = result.results.channels[0].alternatives[0].paragraphs?.paragraphs as DeepgramParagraph[];

  return { data: paragraphs, error: null };
};
