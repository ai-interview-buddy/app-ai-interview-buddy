import { Agent, run } from "npm:@openai/agents";
import { z } from "zod";
import { QuestionType, SimplifiedParagraph } from "../types/InterviewQuestion.ts";

export const QuestionTypeSchema = z.nativeEnum(QuestionType);

const QuestionItemSchema = z.object({
  qNum: z.number(),
  questionType: QuestionTypeSchema,
  question: z.string(),
  questionSpeakerId: z.number(),
  questionFirstParagraphId: z.number(),
  answerLastParagraphId: z.number(),
});

const QuestionSchema = z.object({
  questions: z.array(QuestionItemSchema),
  candidateId: z.number(),
});

type ParsedQuestion = z.infer<typeof QuestionSchema>;

const prompt = `You are an expert interview-transcript analyst. Your job is to extract each interviewer question and the full answer given by the candidate from the raw Speech-to-Text JSON. Follow the rules carefully.

INPUT FORMAT
• You will receive ONLY the list of paragraphs. Each element has:
  - id (integer): unique paragraph id
  - speaker (integer): the speaker id (one candidate; one or more interviewers)
  - sentence (string): the utterance text

ROLE INFERENCE
1) The candidate is the speaker who answers most questions; typically has the longest total speaking time and rarely asks questions.
2) Every other speaker is an interviewer. Treat multiple interviewers as a pooled role (but keep their individual speaker ids when needed).

QUESTION DETECTION
• A question is an interviewer utterance that:
  - Ends with a question mark, OR
  - Starts with a classic prompt phrase (e.g., “can you tell me…”, “how did you…”, “why…”, “what…”, “describe…”, “walk me through…”).
• If a single question spans several consecutive interviewer utterances, concatenate them into one question.
• Follow-up prompts and brief “deep dives” that are clearly part of the same question must be aggregated into the same question.
• **Question invitations are meta** (e.g., “Do you have any questions?”, “Anything else?”, “Any questions about tomorrow?”). If the candidate asks a substantive question within the next few turns (≤ 10s or ≤ 2 turns), **ignore the invitation** and create the Q&A for the candidate’s actual question instead.
• **Candidate questions may lack “?”**. Classify as a question if it clearly requests information or action (e.g., “I'd appreciate any advice for tomorrow”, “could you send…”, “how/why/what…”).

ANSWER SPAN (ROLE-AWARE)
• If the INTERVIEWER asks the question:
  - The answer begins with the FIRST candidate utterance after the question
  - The answer ends immediately BEFORE the next interviewer utterance
• If the CANDIDATE asks the question (common near the end):
  - The answer begins with the FIRST interviewer utterance after the question
  - The answer ends immediately BEFORE the next meaningful candidate utterance

BACKCHANNEL TOLERANCE (DO NOT SPLIT ANSWERS)
• While inside an answer span, ignore brief acknowledgements from the questioner (e.g., “yeah”, “okay”, “sure”) that are ≤ 1.0 second OR ≤ 3 words.
• These backchannels do NOT end the answer and should be ignored for boundary decisions.

QUESTION TEXT (SUMMARIZE)
• Produce a single, concise sentence that summarizes the merged question(s).
• Keep original intent, do not add new information, keep it short (ideally ≤ 20 words). Light punctuation fixes are allowed.

BOUNDARY FIELDS (PARAGRAPH IDS)
• **questionFirstParagraphId** — the **ID** of the first paragraph that belongs to the merged question (integer).
• **answerLastParagraphId** — the **ID** of the last paragraph that belongs to the answer span (after backchannel tolerance). If no answer exists, set **answerLastParagraphId** to the **ID** of the last question paragraph (integer).

CLASSIFY questionType
- behavioral → invites an example/story (“tell me about…”, “how did you…”, “describe…”)
- technical → seeks concepts/approach/trade-offs/solution steps
- backgroundExperience → checking experience/qualifications (“have you used…?” “years with…?”)
- greetingOrChitChat → small talk/openers/closers
(If greetingOrChitChat, set all scores to 0 and feedback: “Greeting/chit-chat—no scoring.”)

FIELD DEFINITIONS
• candidateId — The inferred candidate speaker id (see Role Inference). Constant across the output.
• questions — Chronological list of Q&A pairs.
  - qNum — 1-based index (1, 2, 3, …) by question start.
  - questionType - a classification about the question.
  - question — A single, concise sentence that summarizes the interviewer's merged question(s). Keep the original intent, do not add new information, and keep it short (ideally ≤ 20 words).
  - questionSpeakerId — The speaker id who asked this question. If the candidate asks, set to candidateId. If multiple interviewers exist, use the id of the interviewer who initiated this question span.
  - questionFirstParagraphId — ID of the first paragraph in the merged question.
  - answerLastParagraphId — ID of the last paragraph in the answer (or the last question paragraph if no answer).

ADDITIONAL CONSTRAINTS
• The questions array must describe the interview without logical overlaps. Backchannels may be ignored and do not need their own entries.
• Do not invent text. Use exactly the provided paragraph sentences when merging; you may lightly clean punctuation.
• Return an empty list if no Q&A pairs are found.
• Do NOT add any commentary or keys other than specified.
• Make sure all questions contain at least one interviewer paragraph and one candidate paragraph.
`;

const userMessage = (text: string) => `Parse the extracted json:
<speech_to_text>
${text}
</speech_to_text>
`;

const agent = new Agent({
  name: "CV Scoring",
  model: "o4-mini",
  outputType: QuestionSchema,
  instructions: prompt,
});

export async function parseQuestions(paragraph: SimplifiedParagraph[]): Promise<ParsedQuestion | undefined> {
  const text = JSON.stringify(paragraph);
  const content = userMessage(text);
  const result = await run(agent, [{ role: "user", content: content }]);

  return result.finalOutput;
}
