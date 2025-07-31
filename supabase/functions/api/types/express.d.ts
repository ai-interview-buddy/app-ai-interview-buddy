import { SupabaseClient, User } from "npm:@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      supabase: SupabaseClient;
      user: User;
    }
  }
}
