import { tool } from "@openai/agents";
import { z } from "zod";

const webScrapingToken = Deno.env.get("WEB_SCRAPING_TOKEN");

function stripHtmlUnsafeButSimple(html: string): string {
  // Remove script/style/noscript/template blocks first
  const withoutCode = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "")
    .replace(/<template[\s\S]*?<\/template>/gi, "");
  // Strip remaining tags
  const withoutTags = withoutCode.replace(/<\/?[^>]+>/g, " ");
  // Decode a few common entities (quick pass)
  const decoded = withoutTags
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
  // Normalize whitespace
  return decoded
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const processFetchResult = async (res: Response) => {
  const contentType = res.headers.get("content-type") || "";
  const body = await res.text();

  // If it's not HTML, just return the raw text
  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
    return body.trim();
  }

  // Strip tags and normalize whitespace
  return stripHtmlUnsafeButSimple(body);
};

export const fetchJobPositionUrl = async (url: string) => {
  console.log(`Using fetchCleanText to parse the url ${url}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; OpenAI-Agents-Example/1.0)",
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    if (!res.ok) {
      if (webScrapingToken) {
        console.log(`Using fetchCleanText, failed to process using fetch, trying scraping ${url}`);
        const scrapingUrl = `https://api.crawlbase.com/?token=${webScrapingToken}&url=${url}`;
        const scrapingRes = await fetch(scrapingUrl);
        if (!scrapingRes.ok) {
          throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
        }
        return await processFetchResult(scrapingRes);
      }

      throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    }

    return await processFetchResult(res);
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && "name" in err && (err as { name?: string }).name === "AbortError") {
      throw new Error("Request timed out while fetching the URL.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};

export const fetchCleanText = tool({
  name: "fetch_clean_text",
  description: "Fetch a URL and return plain text with all HTML tags removed.",
  parameters: z.object({
    url: z.string(),
  }),
  async execute({ url }) {
    return await fetchJobPositionUrl(url);
  },
});
