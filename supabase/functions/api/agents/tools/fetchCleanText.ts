import { tool } from "@openai/agents";
import { z } from "zod";

class FetchCleanText {
  private stripHtml(html: string): string {
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

  private async processFetchResult(res: Response): Promise<string> {
    const contentType = res.headers.get("content-type") || "";
    const body = await res.text();

    // If it's not HTML, just return the raw text
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
      return body.trim();
    }

    // Strip tags and normalize whitespace
    return this.stripHtml(body);
  }

  private async fetchWithScraping(url: string): Promise<string> {
    const webScrapingToken = Deno.env.get("WEB_SCRAPING_TOKEN");
    if (!webScrapingToken) {
      throw new Error(`Direct fetch failed and WEB_SCRAPING_TOKEN is not set — cannot scrape ${url}`);
    }
    console.log(`fetchCleanText: falling back to scraping for ${url}`);
    const scrapingUrl = `https://api.crawlbase.com/?token=${webScrapingToken}&url=${url}`;
    const scrapingRes = await fetch(scrapingUrl);
    if (!scrapingRes.ok) {
      throw new Error(`Scraping also failed for ${url}: ${scrapingRes.status} ${scrapingRes.statusText}`);
    }
    return await this.processFetchResult(scrapingRes);
  }

  async fetchJobPositionUrl(url: string): Promise<string> {
    console.log(`fetchCleanText: fetching ${url}`);
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
        console.log(`fetchCleanText: direct fetch returned ${res.status} for ${url}`);
        return await this.fetchWithScraping(url);
      }

      return await this.processFetchResult(res);
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "name" in err && (err as { name?: string }).name === "AbortError") {
        console.log(`fetchCleanText: direct fetch timed out for ${url}`);
      } else {
        console.log(`fetchCleanText: direct fetch error for ${url}: ${err}`);
      }
      return await this.fetchWithScraping(url);
    } finally {
      clearTimeout(timeout);
    }
  }

  asTool() {
    return tool({
      name: "fetch_clean_text",
      description: "Fetch a URL and return plain text with all HTML tags removed.",
      parameters: z.object({
        url: z.string(),
      }),
      execute: async ({ url }) => {
        return await this.fetchJobPositionUrl(url);
      },
    });
  }
}

export default new FetchCleanText();
