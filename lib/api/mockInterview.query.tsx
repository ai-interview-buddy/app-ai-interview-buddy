import { MockInterviewRequest, MockInterviewResponse } from "@/supabase/functions/api/types/MockInterview";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createMockInterviewSession } from "./mockInterview.fetch";
import { invalidateTimelineQueries } from "./timelineItem.query";

export const useCreateMockInterview = (queryClient: QueryClient, token?: string) => {
  return useMutation<MockInterviewResponse, Error, MockInterviewRequest>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createMockInterviewSession(token, data);
    },
    onSuccess: (record) => invalidateTimelineQueries(queryClient),
  });
};
