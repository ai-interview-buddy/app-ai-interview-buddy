import { MockInterviewRequest, MockInterviewResponse } from "@/supabase/functions/api/types/MockInterview";
import { API_BASE_URL, defaultHeaders } from "./api";

export const createMockInterviewSession = async (token: string, request: MockInterviewRequest): Promise<MockInterviewResponse> => {
  const res = await fetch(`${API_BASE_URL}/mock-interview`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(request),
  });
  if (!res.ok) throw new Error("Failed to create mock interview session");

  return await res.json();
};
