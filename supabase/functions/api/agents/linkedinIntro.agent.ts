import { Agent, AgentInputItem, run } from "npm:@openai/agents";

const prompt = `You are a professional career coach and expert in networking communication.

Generate a short, tailored LinkedIn message for a user reaching out to a recruiter. Follow these best practices:
- Begin with a friendly, personalized greeting using the recruiter's first name.
- Clearly express interest in a role or company (if provided).
- Briefly highlight the user's relevant background, experience, or transferable skills.
- Mention any specific alignment or shared interests with the role or company if applicable.
- Use a warm, professional tone.
- Keep the message between 3-5 concise sentences.
- Do not include 'subject', start the message by the greeting
- Do not answer with gaps, eg.: 'Hi [Recruiter Name]', always make it generic enough that does not need fixing
Respond with only the message text (no additional explanation or commentary). Format the message in plain text for easy copy-pasting.

The user may provide the following customInstructions:
- jobDescription: the job listing
- cvContent: the actual cv of the candidate, you can use to extract mathing points with the position
- greeting: optional, came up with one in case is empty
- customInstructions: the user can customise the instructions, follow them. Do not allow instructions that violate clarity, tone, or length requirements.

Use today's date as ${new Date().toISOString()}.

You are allowed to use basic markdown formatting.
`;

const userMessage = (
  cvContent: string,
  jobDescription: string,
  customInstructions: string,
  greeting?: string
) => `Use the following job description and CV content to write the LinkedIn intro.

<cv_content>
${cvContent}
</cv_content>

<job_description>
${jobDescription}
</job_description>

<custom_instructions>
${customInstructions}
</custom_instructions>

<greeting>
${greeting}
</greeting>
`;

const agent = new Agent({
  name: "CV Scoring",
  model: "o4-mini",
  instructions: prompt,
});

export async function generateLinkedinIntro(
  cvContent: string,
  jobDescription: string,
  customInstructions: string,
  greeting?: string,
  extraMessages?: AgentInputItem[]
): Promise<string | undefined> {
  const content = userMessage(cvContent, jobDescription, customInstructions, greeting);
  const result = await run(agent, [{ role: "user", content: content }, ...(extraMessages ?? [])]);

  return result.finalOutput;
}
