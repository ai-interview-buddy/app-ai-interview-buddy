import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Setup test database connection
const supabaseUrl = process.env.SUPABASE_URL || "http://localhost:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is required. " +
      "Run `supabase status` and set the env var, or create a .env.test file.",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper to create a test user via Supabase Auth admin API
async function createTestUser(supabase: SupabaseClient) {
  const email = `trigger-test-${crypto.randomUUID()}@test.local`;
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: "test-password-123!",
    email_confirm: true,
  });
  if (error || !data.user) throw new Error(`Failed to create test user: ${error?.message}`);
  return data.user;
}

describe("Trigger.dev Jobs - Database Operations", () => {
  let testUserId: string;

  beforeAll(async () => {
    const user = await createTestUser(supabase);
    testUserId = user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await supabase.from("timeline_item").delete().eq("account_id", testUserId);
      await supabase.from("job_position").delete().eq("account_id", testUserId);
      await supabase.auth.admin.deleteUser(testUserId);
    }
  });

  describe("enrichJobPosition task", () => {
    it("should fetch job position from database", async () => {
      // Create test job position
      const { data: jobPosition, error: insertError } = await supabase
        .from("job_position")
        .insert({
          account_id: testUserId,
          career_profile_id: null,
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
          account_id: testUserId,
          career_profile_id: null,
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
          account_id: testUserId,
          career_profile_id: null,
          company_name: "Test Corp",
          job_title: "Engineer",
          job_description: "Test job",
          salary_range: "$100k",
          processing_status: "COMPLETED",
        })
        .select()
        .single();

      expect(jobPosition).toBeDefined();

      // Create timeline item (use correct column name: position_id)
      const { data: timelineItem, error: insertError } = await supabase
        .from("timeline_item")
        .insert({
          account_id: testUserId,
          position_id: jobPosition!.id,
          type: "INTERVIEW_ANALYSE",
          title: "Interview Feedback",
          interview_original_audio_path: "test-user/interview.mp3",
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
          account_id: testUserId,
          career_profile_id: null,
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
          account_id: testUserId,
          position_id: jobPosition!.id,
          type: "INTERVIEW_ANALYSE",
          title: "Interview Feedback",
          interview_original_audio_path: "test-user/interview.mp3",
        })
        .select()
        .single();

      expect(timelineItem).toBeDefined();

      // Simulate analysis completion
      const { data: updated, error: updateError } = await supabase
        .from("timeline_item")
        .update({
          text: "Great interview! You demonstrated strong problem-solving skills.",
        })
        .eq("id", timelineItem!.id)
        .select()
        .single();

      expect(updateError).toBeNull();
      expect(updated?.text).toBeDefined();

      // Cleanup
      await supabase.from("timeline_item").delete().eq("id", timelineItem!.id);
      await supabase.from("job_position").delete().eq("id", jobPosition!.id);
    });
  });
});
