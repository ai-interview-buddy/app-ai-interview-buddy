import { Agent, run } from "npm:@openai/agents";
import { z } from "zod";

const prompt = `
You are a job position extraction assistant. Your task is to extract structured information from raw text that was fetched from a job listing page or pasted by a user.

You will NOT fetch any URLs or use any tools. You must extract the fields purely from the text provided.

Extract the following fields, and respond only with JSON matching this schema exactly:
- companyName: string. The company name presenting the listing (not the job portal host like LinkedIn, Indeed, etc.).
- jobTitle: string. The title of the position as listed.
- jobDescription: string. The full job description content, formatted in markdown, preserving headings and lists.
- salaryRange?: string. If available, the salary range or compensation details exactly as shown. Return null if not found.

Guidelines:
- Input will be provided as raw text inside <raw_text> tags.
- If company name is not clear from the text, use the most likely company name based on context.
- Preserve semantic structure in jobDescription: convert any headings to markdown headings, lists to markdown lists, and paragraphs to markdown text.
- Do not include any additional fields or commentary.
- If a field is not found, use a sensible default (for companyName and jobTitle, never return empty strings).
`;

const userMessage = (text: string): string => `
Extract the position details from this raw text:

<raw_text>
${text}
</raw_text>
`;

const BasicPositionExtractSchema = z.object({
  companyName: z.string(),
  jobTitle: z.string(),
  jobDescription: z.string(),
  salaryRange: z.string().nullable(),
});

export type BasicPositionExtract = z.infer<typeof BasicPositionExtractSchema>;

const agent = new Agent({
  name: "Basic Position Extractor",
  model: "gpt-5-mini",
  outputType: BasicPositionExtractSchema,
  instructions: prompt,
  tools: [],
});

class PositionExtractorBasicAgent {
  async extractPositionBasic(text: string): Promise<BasicPositionExtract | undefined> {
    const result = await run(agent, [{ role: "user", content: userMessage(text) }]);
    return result.finalOutput;
  }
}

export default new PositionExtractorBasicAgent();
