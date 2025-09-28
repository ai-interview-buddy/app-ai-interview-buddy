import { Agent, run, webSearchTool } from "npm:@openai/agents";
import { z } from "zod";
import { JobPositionCreateByDescription, JobPositionCreateByUrl } from "../types/JobPosition.ts";
import { fetchCleanText } from "./tools/fetchCleanText.ts";

const prompt = `
You are a job position extraction assistant. Your task is to extract structured information from a job listing provided either as a URL or as raw HTML. 

When an input URL is provided, you are allowed to navigate (webSearchTool) up to 3 times to retrieve the complete listing HTML, following redirects or handling dynamically injected content. Use the provided webSearchTool() to fetch pages and handle each navigation step.
Do not use webSearchTool when parsing Raw HTML. 

If webSearchTool fails, call fetchCleanText exactly once to fetch the URL and return plain text (HTML stripped).

Extract the following fields, and respond only with JSON matching this schema exactly:
- companyName: string. The company name presenting the listing (not the portal host).
- companyLogo?: string. If available, the full URL to the company logo image starting with https://. Must be a valid url, or, return null.
- companyWebsite?: string. If available, the official company website URL starting with https://. Must be a valid url, or, return null.
- jobTitle: string. The title of the position as listed.
- jobDescription: string. The full job description content, formatted in markdown, preserving headings and lists.
- salaryRange?: string. If available, the salary range or compensation details exactly as shown.

Guidelines:
- Input will be provided as either:
   1. A jobUrl: wrap the URL in <job_url> tags, e.g. <job_url>https://...</job_url>.
   2. Raw HTML: wrap the HTML in <listing_html> tags.
- For URLs, perform up to 3 fetch navigations to resolve redirects or loaded widgets, focusing on the core job listing container.
- Exclude any boilerplate portal UI elements (e.g., apply buttons, navigation menus).
- Preserve semantic structure: convert HTML headings (<h1>-<h6>) to markdown headings, lists to markdown lists, and paragraphs to markdown text.
- Do not include any additional fields or commentary.
- If a field is not found, omit it from the JSON output.
`;

const userMessageByDescription = (html: string): string => `
Now extract the position details from this job listing using Raw HTML:

<listing_html>
${html}
</listing_html>
`;

const userMessageByJobUrl = (url: string): string => `
Now extract the position details from this job listing using the jobUrl:

<jobUrl>${url}</jobUrl>
`;

const PositionExtractSchema = z.object({
  companyName: z.string(),
  companyLogo: z.string().nullable(),
  companyWebsite: z.string().nullable(),
  jobTitle: z.string(),
  jobDescription: z.string(),
  salaryRange: z.string().nullable(),
});

export type PositionExtract = z.infer<typeof PositionExtractSchema>;

const agent = new Agent({
  name: "Position Extractor",
  model: "gpt-5-mini",
  modelSettings: {
    // reasoning: { effort: "minimal" },
    text: { verbosity: "low" },
  },
  outputType: PositionExtractSchema,
  instructions: prompt,
  tools: [webSearchTool(), fetchCleanText],
});

export async function extractPositionFromUrl(params: JobPositionCreateByUrl): Promise<PositionExtract | undefined> {
  const result = await run(agent, [{ role: "user", content: userMessageByJobUrl(params.jobUrl) }]);
  return result.finalOutput;
}

export async function extractPositionFromDescription(params: JobPositionCreateByDescription): Promise<PositionExtract | undefined> {
  const result = await run(agent, [{ role: "user", content: userMessageByDescription(params.jobDescription) }]);
  return result.finalOutput;
}
