import { logger, task } from "@trigger.dev/sdk/v3";
import { extractPositionFromDescription, extractPositionFromUrl } from "../agents/positionExtractor.js";
import { createSupabaseAdmin } from "../lib/supabase.js";
import { isUrlReachable } from "../services/fetchCleanText.js";

interface EnrichJobPositionPayload {
  jobPositionId: string;
}

export const enrichJobPosition = task({
  id: "enrich-job-position",
  retry: {
    maxAttempts: 3,
  },
  run: async (payload: EnrichJobPositionPayload) => {
    const supabase = createSupabaseAdmin();

    logger.info("Starting enrichment", { jobPositionId: payload.jobPositionId });

    await supabase
      .from("job_position")
      .update({ processing_status: "PROCESSING", updated_at: new Date().toISOString() })
      .eq("id", payload.jobPositionId);

    try {
      // Fetch the record to get job_url, raw_job_description, and company_name
      const { data: jobPosition, error: fetchError } = await supabase
        .from("job_position")
        .select("job_url, raw_job_description, company_name")
        .eq("id", payload.jobPositionId)
        .single();

      if (fetchError || !jobPosition) {
        throw new Error(`Failed to fetch job position ${payload.jobPositionId}: ${fetchError?.message}`);
      }

      const mode = jobPosition.job_url ? "url" : "description";
      logger.info("Fetched job position from DB", {
        mode,
        companyName: jobPosition.company_name,
        jobUrl: jobPosition.job_url ?? "(none)",
        rawTextLength: jobPosition.raw_job_description?.length ?? 0,
      });

      logger.info("Running position extractor agent", { mode });
      const extracted = jobPosition.job_url
        ? await extractPositionFromUrl(jobPosition.job_url, jobPosition.company_name)
        : await extractPositionFromDescription(jobPosition.raw_job_description, jobPosition.company_name);

      if (!extracted) {
        throw new Error("positionExtractor returned empty");
      }

      logger.info("Agent returned result", {
        companyName: extracted.companyName,
        jobTitle: extracted.jobTitle,
        companyWebsite: extracted.companyWebsite ?? "(null)",
        companyLogo: extracted.companyLogo ?? "(null)",
        salaryRange: extracted.salaryRange ?? "(null)",
        jobDescriptionLength: extracted.jobDescription?.length ?? 0,
      });

      // Validate URLs are actually reachable
      let companyLogo: string | null = null;
      if (extracted.companyLogo) {
        const logoReachable = await isUrlReachable(extracted.companyLogo);
        logger.info("Logo URL reachability check", { url: extracted.companyLogo, reachable: logoReachable });
        companyLogo = logoReachable ? extracted.companyLogo : null;
      }

      let companyWebsite: string | null = null;
      if (extracted.companyWebsite) {
        const websiteReachable = await isUrlReachable(extracted.companyWebsite);
        logger.info("Website URL reachability check", { url: extracted.companyWebsite, reachable: websiteReachable });
        companyWebsite = websiteReachable ? extracted.companyWebsite : null;
      }

      await supabase
        .from("job_position")
        .update({
          company_name: extracted.companyName,
          company_logo: companyLogo,
          company_website: companyWebsite,
          job_title: extracted.jobTitle,
          job_description: extracted.jobDescription,
          salary_range: extracted.salaryRange,
          processing_status: "COMPLETED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.jobPositionId);

      logger.info("Enrichment completed", {
        jobPositionId: payload.jobPositionId,
        companyName: extracted.companyName,
        companyWebsite: companyWebsite ?? "(null)",
        companyLogo: companyLogo ?? "(null)",
      });

      return { success: true, jobPositionId: payload.jobPositionId };
    } catch (error) {
      logger.error("Enrichment failed", {
        jobPositionId: payload.jobPositionId,
        error: error instanceof Error ? error.message : String(error),
      });

      await supabase
        .from("job_position")
        .update({ processing_status: "FAILED", updated_at: new Date().toISOString() })
        .eq("id", payload.jobPositionId);

      throw error;
    }
  },
});
