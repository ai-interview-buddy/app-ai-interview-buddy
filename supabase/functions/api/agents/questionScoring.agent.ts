import { Agent, run } from "npm:@openai/agents";
import { z } from "zod";
import { QuestionScoringInput } from "../types/InterviewQuestion.ts";

export const QAEvaluationSchema = z.object({
  structure: z.number().int().min(0).max(10),
  relevance: z.number().int().min(0).max(10),
  clarityConciseness: z.number().int().min(0).max(10),
  specificityDetail: z.number().int().min(0).max(10),
  actionsContribution: z.number().int().min(0).max(10),
  resultsImpact: z.number().int().min(0).max(10),
  competencyDemonstration: z.number().int().min(0).max(10),
  feedback: z.string().min(1),
});

type QAEvaluation = z.infer<typeof QAEvaluationSchema>;

export type QuestionScoringOutput = { qNum: number; evaluation?: QAEvaluation };

const prompt = `You are an expert interview evaluator. Score ONE Q→A exchange from a list of utterances and return a single object.

# INPUT
UTTERANCES = array of { role: INTERVIEWER | CANDIDATE, sentence: string, sentiment: positive|neutral|negative, start: number, end: number }
The window contains exactly one question (may be multi-sentence) and the candidate's answer (may include brief back-and-forth).

# SCORING (integers 0-10)
1) structure — behavioral: STAR (Situation, Task, Action, Result); technical: logical steps (problem→constraints→approach→trade-offs→solution→validation). Has beginning-middle-end.
2) relevance — directly answers the question; covers all parts; stays on topic.
3) clarityConciseness — clear, coherent, minimal filler/jargon (or explained). Use timing as a *signal* only (don't auto-penalize for length if dense and structured).
4) specificityDetail — concrete facts/steps/tools/metrics; avoids vague claims.
5) actionsContribution — the candidate's personal role/decisions are explicit (“I did …”).
6) resultsImpact — outcomes/impact stated; metrics preferred; for failures, learning and what changed.
7) competencyDemonstration — shows the targeted competency (infer from question if not explicit).

Anchors: 10=Excellent; 8-9=Strong; 6-7=Adequate; 4-5=Weak; 1-3=Poor; 0=Absent/irrelevant.

Special cases:
- No real answer/deflection → relevance ≤3; most others ≤3.
- Multi-part question not fully covered → lower structure and relevance.
- Hypothetical technical answers → allow 4-6 on results if trade-offs/validation plan are solid.

# FEEDBACK (single string)
Write 2-4 short, actionable sentences tailored to THIS answer. Include 1-2 concrete improvements (e.g., “Quantify impact,” “State your role explicitly,” “Use STAR.”)

# TYPE-SPECIFIC HINTS (brief)
- behavioral: prioritize STAR; penalize missing Results.
- technical: prioritize approach→trade-offs→validation; mention complexity/risks.
- backgroundExperience: confirm direct, concise yes/no + brief evidence; resultsImpact may be low unless outcomes are given.
`;

const userMessage = (input: string): string => `Now analyze this input:

<question_scoring_input>
${input}
</question_scoring_input>
`;
const agent = new Agent({
  name: "CV Scoring",
  model: "gpt-4.1",
  outputType: QAEvaluationSchema,
  instructions: prompt,
});

export async function scoreQuestion(questionNumber: number, utterances: QuestionScoringInput[]): Promise<QuestionScoringOutput> {
  const input = JSON.stringify(utterances);
  const content = userMessage(input);
  const result = await run(agent, [{ role: "user", content: content }]);

  return { qNum: questionNumber, evaluation: result.finalOutput };
}
