import { SupabaseClient } from "@supabase/supabase-js";
import { parseQuestions } from "../agents/questionParser.agent.ts";
import { QuestionScoringOutput, scoreQuestion } from "../agents/questionScoring.agent.ts";
import {
  DeepgramParagraph,
  InterviewQuestion,
  InterviewQuestionFilter,
  InterviewRole,
  QuestionFormat,
  QuestionType,
  SimplifiedParagraph,
} from "../types/InterviewQuestion.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { TimelineItem } from "../types/TimelineItem.ts";
import { genericError } from "../utils/error.utils.ts";
import { formatTime } from "../utils/format.utils.ts";
import { convertMany, convertOne, oneToDbCase, safeErrorLog } from "../utils/typeConvertion.utils.ts";
import { convertAudioFileToText } from "./deepgram.service.ts";
import { update as updateTimeline } from "./timelineItem.service.ts";

export const getAll = async (supabase: SupabaseClient, params: InterviewQuestionFilter): Promise<ServiceResponse<InterviewQuestion[]>> => {
  let query = supabase
    .from("interview_question")
    .select(
      `id, timeline_item_id, question_number, question_type, question_title, structure, relevance, clarity_conciseness, specificity_detail, actions_contribution, results_impact, competency_demonstration, score, created_at, updated_at`
    )
    .order("created_at");

  if (params.timelineItemId) {
    query = query.eq("timeline_item_id", params.timelineItemId);
  }

  if (params.questionType) {
    query = query.eq("question_type", params.questionType);
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
    return genericError("Must provide either page & size, or unpaged=true for interview-question listing");
  }
};

export const getById = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<InterviewQuestion>> => {
  const result = await supabase.from("interview_question").select("*").eq("id", id).single();
  return convertOne(result);
};

const processTranscriptionAndSave = async (supabase: SupabaseClient, timelineRecord: TimelineItem, paragraphs: DeepgramParagraph[]) => {
  const simplified: SimplifiedParagraph[] = paragraphs.map((p, idx) => {
    return { id: idx, speaker: p.speaker, sentence: p.sentences.map((s) => s.text).join(" ") };
  });

  const parsedQuestions = await parseQuestions(simplified);
  if (!parsedQuestions) {
    return genericError("Failed to parseQuestions, the answer was empty");
  }
  console.log(`interviewAnalyse: timelineRecord ${timelineRecord.id} agent parseQuestions ${parsedQuestions.questions.length} questions`);

  const candidateSpeakerId = parsedQuestions.candidateId;

  const scoringInputs = parsedQuestions.questions
    .filter((q) => q.questionSpeakerId !== candidateSpeakerId)
    .filter((q) => q.questionType !== QuestionType.GREETING_OR_CHIT_CHAT)
    .filter((q) => q.answerLastParagraphId > q.questionFirstParagraphId)
    .map((q) => {
      const currentParagraphs = paragraphs.slice(q.questionFirstParagraphId, q.answerLastParagraphId + 1);

      const utterances = currentParagraphs.map((p) => ({
        role: p.speaker === candidateSpeakerId ? InterviewRole.CANDIDATE : InterviewRole.INTERVIEWER,
        sentence: p.sentences.map((s) => s.text).join(" "),
        sentiment: p.sentiment || "NEUTRAL",
        start: p.start,
        end: p.end,
      }));

      return scoreQuestion(q.qNum, utterances);
    });

  const allPromises = await Promise.allSettled(scoringInputs);
  console.log(`interviewAnalyse: timelineRecord ${timelineRecord.id} agent scoreQuestion ${allPromises.length} premises received`);

  const records = allPromises
    .filter((p): p is PromiseFulfilledResult<QuestionScoringOutput> => p.status === "fulfilled")
    .map((p) => p.value)
    .map((output) => {
      const currentQuestion = parsedQuestions.questions.find((el) => el.qNum === output.qNum);
      if (!currentQuestion) throw new Error(`Invalid qNum ${output.qNum} timelineRecord ${timelineRecord.id}`);
      const currentParagraphs = paragraphs.slice(currentQuestion.questionFirstParagraphId, currentQuestion.answerLastParagraphId + 1);

      const structure = output.evaluation?.structure || 0;
      const relevance = output.evaluation?.relevance || 0;
      const clarityConciseness = output.evaluation?.clarityConciseness || 0;
      const specificityDetail = output.evaluation?.specificityDetail || 0;
      const actionsContribution = output.evaluation?.actionsContribution || 0;
      const resultsImpact = output.evaluation?.resultsImpact || 0;
      const competencyDemonstration = output.evaluation?.competencyDemonstration || 0;
      const score = Math.ceil(
        (structure + relevance + clarityConciseness + specificityDetail + actionsContribution + resultsImpact + competencyDemonstration) / 7
      );

      return {
        accountId: timelineRecord.accountId,
        timelineItemId: timelineRecord.id,

        questionNumber: output.qNum,
        questionType: currentQuestion.questionType,
        questionTitle: currentQuestion.question || "",
        questionFormat: QuestionFormat.DEEPGRAM,
        questionJson: JSON.stringify(currentParagraphs),

        questionStartSecond: currentParagraphs[0].start,
        answerStartSecond: currentParagraphs[currentParagraphs.length - 1].end,

        structure,
        relevance,
        clarityConciseness,
        specificityDetail,
        actionsContribution,
        resultsImpact,
        competencyDemonstration,
        score,
        feedback: output.evaluation?.feedback,
      };
    });

  const recordCases = records.map((el) => oneToDbCase(el));
  const { error } = await supabase.from("interview_question").insert(recordCases);
  if (error) {
    console.log(error);
    throw error;
  }

  console.log(`interviewAnalyse: finished interview ${timelineRecord.id} create ${records.length} questions`);

  const text = paragraphs
    ?.map((s: DeepgramParagraph) => {
      const speaker = s.speaker === candidateSpeakerId ? "You" : "Interviewer";
      const sentence = s.sentences.map((s) => s.text).join(" ");
      const time = formatTime(s.start);
      return `**${speaker} [${time}]** \n\n ${sentence}`;
    })
    .join("\n\n");

  const finalScore =
    records.length > 0 ? Math.ceil(records.map((el) => el.score).reduce((prev, curr) => prev + curr, 0) / records.length) : 0;
  const timelineToUpdate = { ...timelineRecord, text: text, interviewScore: finalScore };

  await updateTimeline(supabase, timelineRecord.id, timelineToUpdate);

  console.log(`interviewAnalyse: timelineRecord ${timelineRecord.id} timeline item updated`);
  return records;
};

export const parseQuestionsByAudio = async (supabase: SupabaseClient, timelineRecord: TimelineItem) => {
  console.log(`interviewAnalyse: timelineRecord ${timelineRecord.id} received background-tasks`);

  const { data: paragraphs, error: deepgramError } = await convertAudioFileToText(supabase, timelineRecord.interviewOriginalAudioPath!);
  console.log(`interviewAnalyse: timelineRecord ${timelineRecord.id} response from deepgram ${paragraphs?.length} paragraphs`);

  if (!paragraphs || deepgramError) {
    return genericError("Failed deepgram has return an empty paragraphs object" + deepgramError);
  }

  return await processTranscriptionAndSave(supabase, timelineRecord, paragraphs);
};

export const parseQuestionsByTranscript = async (
  supabase: SupabaseClient,
  timelineRecord: TimelineItem,
  transcript: DeepgramParagraph[]
) => {
  console.log(`interviewAnalyse: timelineRecord ${timelineRecord.id} received transcript-based analysis`);

  if (!transcript || transcript.length === 0) {
    return genericError("Failed: transcript is empty");
  }

  return await processTranscriptionAndSave(supabase, timelineRecord, transcript);
};

export const remove = async (supabase: SupabaseClient, id: string): Promise<ServiceResponse<null>> => {
  try {
    return await supabase.from("interview_question").delete().eq("id", id);
  } catch (err) {
    console.error(`Error deleting interview_question item ${id}: ${safeErrorLog(err)}`);
    throw err;
  }
};
