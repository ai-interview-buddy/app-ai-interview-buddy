import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

// Setup test database connection
const supabaseUrl = process.env.SUPABASE_URL || "http://localhost:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

const supabase = createClient(supabaseUrl, supabaseKey);

describe("Trigger.dev Jobs - Database Operations", () => {
  describe("enrichJobPosition task", () => {
    it("should fetch job position from database", async () => {
      // Create test job position
      const { data: jobPosition, error: insertError } = await supabase
        .from("job_position")
        .insert({
          career_profile_id: "test-profile",
          company_name: "Test Corp",
          job_title: "Software Engineer",
          job_description: "We are hiring...",
          salary_range: "$100k-$150k",
          processing_status: "PENDING",
        })
        .select()
        .single();

      expect(insertError).toBeNull();
      expect(jobPosition).toBeDefined();
      expect(jobPosition?.id).toBeDefined();

      // Verify data was persisted
      const { data: fetchedPosition, error: fetchError } = await supabase
        .from("job_position")
        .select("*")
        .eq("id", jobPosition!.id)
        .single();

      expect(fetchError).toBeNull();
      expect(fetchedPosition).toBeDefined();
      expect(fetchedPosition?.company_name).toBe("Test Corp");

      // Cleanup
      await supabase.from("job_position").delete().eq("id", jobPosition!.id);
    });

    it("should update job position with enriched data", async () => {
      // Create test job position
      const { data: jobPosition } = await supabase
        .from("job_position")
        .insert({
          career_profile_id: "test-profile",
          company_name: "Apple Inc",
          job_title: "Senior Engineer",
          job_description: "Join our team...",
          salary_range: "$150k-$200k",
          processing_status: "PENDING",
        })
        .select()
        .single();

      expect(jobPosition).toBeDefined();

      // Simulate enrichment by updating status
      const { data: updated, error: updateError } = await supabase
        .from("job_position")
        .update({
          processing_status: "COMPLETED",
          company_website: "https://www.apple.com",
          company_logo: "https://logo.clearbit.com/apple.com",
        })
        .eq("id", jobPosition!.id)
        .select()
        .single();

      expect(updateError).toBeNull();
      expect(updated?.processing_status).toBe("COMPLETED");
      expect(updated?.company_website).toBeDefined();
      expect(updated?.company_logo).toBeDefined();

      // Cleanup
      await supabase.from("job_position").delete().eq("id", jobPosition!.id);
    });
  });

  describe("analyseInterview task", () => {
    it("should fetch timeline item from database", async () => {
      // First create a job position
      const { data: jobPosition } = await supabase
        .from("job_position")
        .insert({
          career_profile_id: "test-profile",
          company_name: "Test Corp",
          job_title: "Engineer",
          job_description: "Test job",
          salary_range: "$100k",
          processing_status: "COMPLETED",
        })
        .select()
        .single();

      expect(jobPosition).toBeDefined();

      // Create timeline item
      const { data: timelineItem, error: insertError } = await supabase
        .from("timeline_item")
        .insert({
          job_position_id: jobPosition!.id,
          type: "INTERVIEW_ANALYSE",
          title: "Interview Feedback",
          interview_original_audio_path: "test-user/interview.mp3",
          processing_status: "PENDING",
        })
        .select()
        .single();

      expect(insertError).toBeNull();
      expect(timelineItem).toBeDefined();

      // Verify we can fetch it
      const { data: fetched, error: fetchError } = await supabase
        .from("timeline_item")
        .select("*")
        .eq("id", timelineItem!.id)
        .single();

      expect(fetchError).toBeNull();
      expect(fetched?.type).toBe("INTERVIEW_ANALYSE");
      expect(fetched?.interview_original_audio_path).toBeDefined();

      // Cleanup
      await supabase.from("timeline_item").delete().eq("id", timelineItem!.id);
      await supabase.from("job_position").delete().eq("id", jobPosition!.id);
    });

    it("should update timeline item with analysis results", async () => {
      // Create test data
      const { data: jobPosition } = await supabase
        .from("job_position")
        .insert({
          career_profile_id: "test-profile",
          company_name: "Test Corp",
          job_title: "Engineer",
          job_description: "Test job",
          salary_range: "$100k",
          processing_status: "COMPLETED",
        })
        .select()
        .single();

      const { data: timelineItem } = await supabase
        .from("timeline_item")
        .insert({
          job_position_id: jobPosition!.id,
          type: "INTERVIEW_ANALYSE",
          title: "Interview Feedback",
          interview_original_audio_path: "test-user/interview.mp3",
          processing_status: "PENDING",
        })
        .select()
        .single();

      expect(timelineItem).toBeDefined();

      // Simulate analysis completion
      const { data: updated, error: updateError } = await supabase
        .from("timeline_item")
        .update({
          processing_status: "COMPLETED",
          text: "Great interview! You demonstrated strong problem-solving skills.",
        })
        .eq("id", timelineItem!.id)
        .select()
        .single();

      expect(updateError).toBeNull();
      expect(updated?.processing_status).toBe("COMPLETED");
      expect(updated?.text).toBeDefined();

      // Cleanup
      await supabase.from("timeline_item").delete().eq("id", timelineItem!.id);
      await supabase.from("job_position").delete().eq("id", jobPosition!.id);
    });
  });
});
