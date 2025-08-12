import { InterviewQuestion, QuestionType } from "@/supabase/functions/api/types/InterviewQuestion";
import { API_BASE_URL, defaultHeaders } from "./api";

export const fetchInterviewQuestions = async (
  token: string,
  params: {
    page?: number;
    size?: number;
    unpaged?: boolean;
    timelineItemId?: string;
    questionType?: QuestionType;
  }
): Promise<InterviewQuestion[]> => {
  const query = new URLSearchParams();

  if (params.unpaged) {
    query.append("unpaged", "true");
  } else if (params.page !== undefined && params.size !== undefined) {
    query.append("page", params.page.toString());
    query.append("size", params.size.toString());
  } else {
    throw new Error("Must provide either page & size, or unpaged=true");
  }

  if (params.timelineItemId) {
    query.append("timelineItemId", params.timelineItemId);
  }
  if (params.questionType) {
    query.append("questionType", params.questionType);
  }

  const res = await fetch(`${API_BASE_URL}/interview-questions?${query.toString()}`, {
    headers: defaultHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch interview question");
  return await res.json();
};

export const fetchInterviewQuestion = async (token: string, id: string): Promise<InterviewQuestion> => {
  const res = await fetch(`${API_BASE_URL}/interview-questions/${id}`, {
    headers: defaultHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to fetch interview question ${id}`);
  return await res.json();
};

export const deleteInterviewQuestion = async (token: string, id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/interview-questions/${id}`, {
    method: "DELETE",
    headers: defaultHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to delete interview question ${id}`);
  return true;
};
