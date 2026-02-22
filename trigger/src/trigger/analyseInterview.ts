import { task } from "@trigger.dev/sdk/v3";
import { parseQuestions, QuestionType, SimplifiedParagraph } from "../agents/questionParser.js";
import { QuestionScoringInput, QuestionScoringOutput, scoreQuestion } from "../agents/questionScoring.js";
import { createSupabaseAdmin } from "../lib/supabase.js";
import { convertAudioFileToText, DeepgramParagraph } from "../services/deepgram.js";

interface AnalyseInterviewPayload {
  timelineItemId: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export const analyseInterview = task({
  id: "analyse-interview",
  retry: {
    maxAttempts: 2,
  },
  run: async (payload: AnalyseInterviewPayload) => {
    const supabase = createSupabaseAdmin();

    console.log(`analyseInterview: starting for timeline_item ${payload.timelineItemId}`);

    // Fetch timeline item to get required fields
    const { data: timelineItem, error: fetchError } = await supabase
      .from("timeline_item")
      .select("*")
      .eq("id", payload.timelineItemId)
      .single();

    if (fetchError || !timelineItem) {
      throw new Error(`Failed to fetch timeline_item ${payload.timelineItemId}: ${fetchError?.message}`);
    }

    const interviewPath = timelineItem.interview_original_audio_path;
    if (!interviewPath) {
      throw new Error(`Timeline item ${payload.timelineItemId} has no interview_original_audio_path`);
    }

    console.log(`analyseInterview: loaded timeline_item with interview path: ${interviewPath}`);

    // Step 1: Deepgram transcription
    const { data: paragraphs, error: deepgramError } = await convertAudioFileToText(supabase, interviewPath);
    console.log(`analyseInterview: deepgram returned ${paragraphs?.length} paragraphs`);

    if (!paragraphs || deepgramError) {
      throw new Error("Deepgram returned empty paragraphs: " + deepgramError);
    }

    // Step 2: Parse questions
    const simplified: SimplifiedParagraph[] = paragraphs.map((p, idx) => ({
      id: idx,
      speaker: p.speaker,
      sentence: p.sentences.map((s) => s.text).join(" "),
    }));

    const parsedQuestions = await parseQuestions(simplified);
    if (!parsedQuestions) {
      throw new Error("Failed to parseQuestions, the answer was empty");
    }
    console.log(`analyseInterview: parsed ${parsedQuestions.questions.length} questions`);

    const candidateSpeakerId = parsedQuestions.candidateId;

    // Step 3: Score each question in parallel
    const scoringInputs = parsedQuestions.questions
      .filter((q) => q.questionSpeakerId !== candidateSpeakerId)
      .filter((q) => q.questionType !== QuestionType.GREETING_OR_CHIT_CHAT)
      .filter((q) => q.answerLastParagraphId > q.questionFirstParagraphId)
      .map((q) => {
        const currentParagraphs = paragraphs.slice(q.questionFirstParagraphId, q.answerLastParagraphId + 1);

        const utterances: QuestionScoringInput[] = currentParagraphs.map((p) => ({
          role: p.speaker === candidateSpeakerId ? ("CANDIDATE" as const) : ("INTERVIEWER" as const),
          sentence: p.sentences.map((s) => s.text).join(" "),
          sentiment: p.sentiment || "NEUTRAL",
          start: p.start,
          end: p.end,
        }));

        return scoreQuestion(q.qNum, utterances);
      });

    const allPromises = await Promise.allSettled(scoringInputs);
    console.log(`analyseInterview: scored ${allPromises.length} questions`);

    // Step 4: Build records and insert
    const records = allPromises
      .filter((p): p is PromiseFulfilledResult<QuestionScoringOutput> => p.status === "fulfilled")
      .map((p) => p.value)
      .map((output) => {
        const currentQuestion = parsedQuestions.questions.find((el) => el.qNum === output.qNum);
        if (!currentQuestion) throw new Error(`Invalid qNum ${output.qNum}`);
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
          account_id: timelineItem.account_id,
          timeline_item_id: timelineItem.id,
          question_number: output.qNum,
          question_type: currentQuestion.questionType,
          question_title: currentQuestion.question || "",
          question_format: "DEEPGRAM",
          question_json: JSON.stringify(currentParagraphs),
          question_start_second: currentParagraphs[0].start,
          answer_start_second: currentParagraphs[currentParagraphs.length - 1].end,
          structure,
          relevance,
          clarity_conciseness: clarityConciseness,
          specificity_detail: specificityDetail,
          actions_contribution: actionsContribution,
          results_impact: resultsImpact,
          competency_demonstration: competencyDemonstration,
          score,
          feedback: output.evaluation?.feedback,
        };
      });

    const { error: insertError } = await supabase.from("interview_question").insert(records);
    if (insertError) {
      console.error("Failed to insert interview_question records:", insertError);
      throw insertError;
    }

    console.log(`analyseInterview: inserted ${records.length} interview_question records`);

    // Step 5: Update timeline_item with transcript text and final score
    const text = paragraphs
      .map((s: DeepgramParagraph) => {
        const speaker = s.speaker === candidateSpeakerId ? "You" : "Interviewer";
        const sentence = s.sentences.map((s) => s.text).join(" ");
        const time = formatTime(s.start);
        return `**${speaker} [${time}]** \n\n ${sentence}`;
      })
      .join("\n\n");

    const finalScore = records.length > 0 ? Math.ceil(records.map((el) => el.score).reduce((prev, curr) => prev + curr, 0) / records.length) : 0;

    await supabase
      .from("timeline_item")
      .update({
        text: text,
        interview_score: finalScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", timelineItem.id);

    console.log(`analyseInterview: completed for ${timelineItem.id}, score: ${finalScore}`);
    return { success: true, questionCount: records.length, score: finalScore };
  },
});
