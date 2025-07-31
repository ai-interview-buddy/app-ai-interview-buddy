import { Agent, run } from "npm:@openai/agents";
import { z } from "zod";
import { PdfContent } from "../types/PdfContent.ts";

const prompt = `
You are a CV analysis assistant. Evaluate the following resume based on these criteria: 
- **ATS** (ATS-friendly formatting and parsing),
- **Grammar** (spelling and grammar correctness),
- **Pages** (length in pages, ideally 1-2 pages),
- **Structure** (organization, section completeness, formatting consistency),
- **Content** (clarity of descriptions, use of action verbs, measurable achievements).

All scores should be on the bases 0 (low score) to 10 (best score).

Additionally, identify the possible jobTitle the candidate might be applying for. Usually related to their last work experience or from the introduction.

In the case the content doesn't look like a cv, then, jobTitle should be 'Invalid cv' and all scores equal 0.
`;

const userMessage = (pdfContent: PdfContent): string => `
Now analyze this resume provided by the user:

Pages of this document: ${pdfContent.pageCount};
<cv_content>
${pdfContent.content}
</cv_content>
`;

export const cvScoringWeight = {
  ats: 0.3, // ATS: 30%,
  content: 0.25, // Content: 25%
  structure: 0.2, // Structure: 20%
  grammar: 0.15, // Grammar: 25%
  pages: 0.1, // Length: 10%
};

const FeedbackItemSchema = z.object({
  item: z.enum(["ats", "grammar", "pages", "structure", "content"]),
  score: z.number().min(0).max(10),
  feedback: z.string(),
});

const OverallSchema = z.object({
  analysis: z.array(FeedbackItemSchema),
  jobTitle: z.string(),
});

const agent = new Agent({
  name: "CV Scoring",
  model: "gpt-4.1",
  outputType: OverallSchema,
  instructions: prompt,
});

export async function cvScoringAgent(pdfContent: PdfContent) {
  const content = userMessage(pdfContent);
  const result = await run(agent, [{ role: "user", content: content }]);

  return result.finalOutput;
}
