import { SupabaseClient, User } from "@supabase/supabase-js";
import { supabaseAdminClient } from "../lib/supabase.ts";
import { ServiceResponse } from "../types/ServiceResponse.ts";

export const remove = async (supabase: SupabaseClient, user: User): Promise<ServiceResponse<null>> => {
  if (!user?.id) throw new Error("Invalid user");
  const accountId = user.id;

  // 1. Delete related rows in tables
  const tables = ["career_profile", "interview_question", "job_position", "timeline_item"];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().eq("account_id", accountId);

    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }
  }

  // 2. Delete files in storage buckets
  const buckets = ["curriculums", "interviews"];
  for (const bucket of buckets) {
    const { data: files, error: listError } = await supabase.storage.from(bucket).list(`${accountId}/`, { limit: 1000 }); // adjust limit if needed

    if (listError) {
      console.error(`Error listing files in ${bucket}:`, listError);
      throw listError;
    }

    if (files && files.length > 0) {
      const paths = files.map((f) => `${accountId}/${f.name}`);
      const { error: removeError } = await supabase.storage.from(bucket).remove(paths);

      if (removeError) {
        console.error(`Error removing files in ${bucket}:`, removeError);
        throw removeError;
      }
    }
  }

  // 3. Delete user from auth
  const { error: authError } = await supabaseAdminClient.auth.admin.deleteUser(accountId);
  if (authError) {
    console.error("Error deleting auth user:", authError);
    throw authError;
  }

  return { error: null, data: null, count: 0 };
};
