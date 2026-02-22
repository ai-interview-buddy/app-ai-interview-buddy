import { Agent, run, webSearchTool } from "@openai/agents";
import { logger } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { fetchCleanText } from "../services/fetchCleanText.js";

const prompt = `
You are a job position extraction and enrichment assistant. Your task is to extract structured information from a job listing, and then enrich it by finding the company's official website and logo.

## Phase 1: Extract Position Details

When an input URL is provided, use webSearchTool (up to 3 navigations) to retrieve the listing content. If webSearchTool fails, call fetch_clean_text exactly once.
When raw text is provided, extract directly from the text without fetching.

Extract these fields from the listing:
- companyName: string. The company name presenting the listing (not the job portal host like LinkedIn, Indeed, etc.).
- jobTitle: string. The title of the position as listed.
- jobDescription: string. The full job description content, formatted in markdown, preserving headings and lists.
- salaryRange?: string. If available, the salary range or compensation details exactly as shown. Return null if not found.

## Phase 2: Enrich Company Details

After extracting the position details, you MUST use webSearchTool to find the company website and logo. Do NOT skip this phase — job listings rarely contain these directly.

### companyWebsite
- If the listing text already contains the official company website URL, use it.
- Otherwise, use webSearchTool to search for "[companyName] official website".
- The result must be the company's main homepage URL (e.g., https://www.marksandspencer.com), not a job portal or social media page.
- Must start with https://. Return null only if you cannot find it after searching.

### companyLogo
- Use webSearchTool to search for "[companyName] official logo PNG high quality". Look for direct image URLs on company websites, press kit pages, or brand asset repositories.
- If search fails, try searching "[companyName] company branding assets" or "[companyName] logo download".
- Fallback: construct DuckDuckGo's favicon service URL: https://icons.duckduckgo.com/ip3/[domain].ico (e.g., https://icons.duckduckgo.com/ip3/marksandspencer.com.ico) — this reliably returns logos.
- Last resort: Google's favicon service: https://www.google.com/s2/favicons?domain=[domain]&sz=128
- Must be a full URL starting with https://. Return null only if you cannot find a valid logo URL.

## Guidelines
- Input will be provided as either:
  1. A jobUrl: wrapped in <job_url> tags.
  2. Raw text: wrapped in <listing_html> tags.
- A companyName hint may be provided in <company_name_hint> tags — use this to help your search if available.
- Exclude any boilerplate portal UI elements (apply buttons, navigation menus, etc.).
- Preserve semantic structure in jobDescription: headings, lists, paragraphs.
- Do not include any additional fields or commentary.
`;

const userMessageByDescription = (html: string, companyNameHint?: string): string => `
Now extract and enrich the position details from this job listing:
${companyNameHint ? `\n<company_name_hint>${companyNameHint}</company_name_hint>` : ""}

<listing_html>
${html}
</listing_html>
`;

const userMessageByJobUrl = (url: string, companyNameHint?: string): string => `
Now extract and enrich the position details from this job listing:
${companyNameHint ? `\n<company_name_hint>${companyNameHint}</company_name_hint>` : ""}

<job_url>${url}</job_url>
`;

export const PositionExtractSchema = z.object({
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
  outputType: PositionExtractSchema,
  instructions: prompt,
  tools: [webSearchTool(), fetchCleanText],
});

export async function extractPositionFromUrl(jobUrl: string, companyNameHint?: string): Promise<PositionExtract | undefined> {
  logger.info("positionExtractor: extracting from URL", { jobUrl, companyNameHint: companyNameHint ?? "(none)" });
  const start = Date.now();
  const result = await run(agent, [{ role: "user", content: userMessageByJobUrl(jobUrl, companyNameHint) }]);
  const duration = Date.now() - start;
  logger.info("positionExtractor: agent completed", { durationMs: duration, hasOutput: !!result.finalOutput });
  return result.finalOutput;
}

export async function extractPositionFromDescription(
  jobDescription: string,
  companyNameHint?: string,
): Promise<PositionExtract | undefined> {
  logger.info("positionExtractor: extracting from description", {
    textLength: jobDescription?.length ?? 0,
    companyNameHint: companyNameHint ?? "(none)",
  });
  const start = Date.now();
  const result = await run(agent, [{ role: "user", content: userMessageByDescription(jobDescription, companyNameHint) }]);
  const duration = Date.now() - start;
  logger.info("positionExtractor: agent completed", { durationMs: duration, hasOutput: !!result.finalOutput });
  return result.finalOutput;
}
