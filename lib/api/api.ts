const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
export const API_BASE_URL = `${supabaseUrl}/functions/v1/api`;

export const defaultHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});
