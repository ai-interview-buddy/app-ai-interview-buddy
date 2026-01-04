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

export const analyseMockInterview = async (token: string, body: { positionId?: string; transcript: any[] }): Promise<{ id: string }> => {
  const res = await fetch(`${API_BASE_URL}/mock-interview/analyse`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to analyse mock interview");

  return await res.json();
};
