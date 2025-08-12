import { InterviewQuestion, QuestionType } from "@/supabase/functions/api/types/InterviewQuestion";
import { QueryClient, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { deleteInterviewQuestion, fetchInterviewQuestion, fetchInterviewQuestions } from "./interviewQuestion.fetch";

export const useInterviewQuestions = (
  token?: string,
  params?: {
    page?: number;
    size?: number;
    unpaged?: boolean;
    timelineItemId?: string;
    questionType?: QuestionType;
  }
): UseQueryResult<InterviewQuestion[], Error> => {
  return useQuery<InterviewQuestion[], Error>({
    queryKey: ["interview-questions", params],
    enabled: !!token && !!params && (params.unpaged || (params.page !== undefined && params.size !== undefined)),
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchInterviewQuestions(token!, params!),
  });
};

export const useInterviewQuestion = (token?: string, id?: string): UseQueryResult<InterviewQuestion, Error> => {
  return useQuery<InterviewQuestion, Error>({
    queryKey: ["interview-question", id],
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchInterviewQuestion(token!, id!),
  });
};

export const invalidateInterviewQuestionQueries = (queryClient: QueryClient, id?: string) => {
  queryClient.invalidateQueries({ queryKey: ["interview-questions"] });
  if (id) queryClient.invalidateQueries({ queryKey: ["interview-question", id] });

  // invalidate the timeline-item as well
  queryClient.invalidateQueries({ queryKey: ["timeline-item"] });
};

export const useDeleteInterviewQuestion = (queryClient: QueryClient, token?: string) => {
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => {
      if (!token) throw new Error("Missing token");
      return deleteInterviewQuestion(token, id);
    },
    onSuccess: (_, id) => invalidateInterviewQuestionQueries(queryClient, id),
  });
};
