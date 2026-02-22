import test from "node:test";
import assert from "node:assert";
import { createClient } from "@supabase/supabase-js";

// Mock OpenAI and Deepgram
const mockOpenAI = {
  beta: {
    agents: {
      create: async () => ({
        id: "mock-agent-123",
        model: "gpt-5-mini",
      }),
    },
  },
};

const mockDeepgram = {
  listen: {
    prerecorded: {
      transcribeFile: async () => ({
        result: {
          results: {
            channels: [
              {
                alternatives: [
                  {
                    transcript: "This is a test interview",
                  },
                ],
              },
            ],
          },
        },
      }),
    },
  },
};

// Setup test database connection
const supabaseUrl = process.env.SUPABASE_URL || "http://localhost:54321";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

const supabase = createClient(supabaseUrl, supabaseKey);

test("enrichJobPosition task", async (t) => {
  await t.test("should fetch job position from database", async () => {
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

    assert(!insertError, `Failed to insert job position: ${insertError?.message}`);
    assert(jobPosition, "Job position should be created");
    assert(jobPosition.id, "Job position should have an ID");

    // Verify data was persisted
    const { data: fetchedPosition, error: fetchError } = await supabase
      .from("job_position")
      .select("*")
      .eq("id", jobPosition.id)
      .single();

    assert(!fetchError, `Failed to fetch job position: ${fetchError?.message}`);
    assert(fetchedPosition, "Should be able to fetch created job position");
    assert.strictEqual(fetchedPosition.company_name, "Test Corp");

    // Cleanup
    await supabase.from("job_position").delete().eq("id", jobPosition.id);
  });

  await t.test("should update job position with enriched data", async () => {
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

    assert(jobPosition, "Job position should be created");

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

    assert(!updateError, `Failed to update job position: ${updateError?.message}`);
    assert.strictEqual(updated!.processing_status, "COMPLETED");
    assert(updated!.company_website, "Should have company website");
    assert(updated!.company_logo, "Should have company logo");

    // Cleanup
    await supabase.from("job_position").delete().eq("id", jobPosition!.id);
  });
});

test("analyseInterview task", async (t) => {
  await t.test("should fetch timeline item from database", async () => {
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

    assert(jobPosition, "Job position should be created");

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

    assert(!insertError, `Failed to insert timeline item: ${insertError?.message}`);
    assert(timelineItem, "Timeline item should be created");

    // Verify we can fetch it
    const { data: fetched, error: fetchError } = await supabase
      .from("timeline_item")
      .select("*")
      .eq("id", timelineItem!.id)
      .single();

    assert(!fetchError, `Failed to fetch timeline item: ${fetchError?.message}`);
    assert.strictEqual(fetched!.type, "INTERVIEW_ANALYSE");
    assert(fetched!.interview_original_audio_path, "Should have audio path");

    // Cleanup
    await supabase.from("timeline_item").delete().eq("id", timelineItem!.id);
    await supabase.from("job_position").delete().eq("id", jobPosition!.id);
  });

  await t.test("should update timeline item with analysis results", async () => {
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

    assert(timelineItem, "Timeline item should be created");

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

    assert(!updateError, `Failed to update timeline item: ${updateError?.message}`);
    assert.strictEqual(updated!.processing_status, "COMPLETED");
    assert(updated!.text, "Should have analysis text");

    // Cleanup
    await supabase.from("timeline_item").delete().eq("id", timelineItem!.id);
    await supabase.from("job_position").delete().eq("id", jobPosition!.id);
  });
});
