import { supabaseUrl } from "../supabase/supabase";

export const API_BASE_URL = `${supabaseUrl}/functions/v1/api`;

export const defaultHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
