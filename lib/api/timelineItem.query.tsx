import {
  SignedUrl,
  TimelineCoverLetter,
  TimelineCreateText,
  TimelineCustomInstructionsUpdate,
  TimelineFilter,
  TimelineInterviewAnalyse,
  TimelineItem,
  TimelineLinkedinIntro,
  TimelineReplyEmail,
} from "@/supabase/functions/api/types/TimelineItem";
import { QueryClient, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  createTimelineCoverLetter,
  createTimelineInterviewAnalyse,
  createTimelineLinkedinIntro,
  createTimelineNote,
  createTimelineReplyEmail,
  deleteTimelineItem,
  fetchTimelineItem,
  fetchTimelineItemInterviewUrl,
  fetchTimelineItems,
  updateCustomInstructions,
} from "./timelineItem.fetch";

export const useTimelineItems = (token?: string, params?: TimelineFilter): UseQueryResult<TimelineItem[], Error> => {
  return useQuery<TimelineItem[], Error>({
    queryKey: ["timeline-items", params],
    enabled: !!token && !!params && (params.unpaged || (params.page !== undefined && params.size !== undefined)),
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchTimelineItems(token!, params!),
  });
};

export const useTimelineItem = (
  token?: string,
  id?: string,
  options?: { refetchInterval?: number | false }
): UseQueryResult<TimelineItem, Error> => {
  return useQuery<TimelineItem, Error>({
    queryKey: ["timeline-item", id],
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    refetchInterval: options?.refetchInterval ?? false,
    queryFn: () => fetchTimelineItem(token!, id!),
  });
};

export const useTimelineItemInterviewUrl = (token?: string, id?: string): UseQueryResult<SignedUrl, Error> => {
  return useQuery<SignedUrl, Error>({
    queryKey: ["timeline-item-url", id],
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchTimelineItemInterviewUrl(token!, id!),
  });
};

export const invalidateTimelineQueries = (queryClient: QueryClient, id?: string) => {
  queryClient.invalidateQueries({ queryKey: ["timeline-items"] });
  if (id) queryClient.invalidateQueries({ queryKey: ["timeline-item", id] });
};

export const useCreateTimelineNote = (queryClient: QueryClient, token?: string) => {
  return useMutation<TimelineItem, Error, TimelineCreateText>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createTimelineNote(token, data);
    },
    onSuccess: (record) => invalidateTimelineQueries(queryClient, record.id),
  });
};

export const useCreateTimelineCoverLetter = (queryClient: QueryClient, token?: string) => {
  return useMutation<TimelineItem, Error, TimelineCoverLetter>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createTimelineCoverLetter(token, data);
    },
    onSuccess: (record) => invalidateTimelineQueries(queryClient, record.id),
  });
};

export const useCreateTimelineLinkedinIntro = (queryClient: QueryClient, token?: string) => {
  return useMutation<TimelineItem, Error, TimelineLinkedinIntro>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createTimelineLinkedinIntro(token, data);
    },
    onSuccess: (record) => invalidateTimelineQueries(queryClient, record.id),
  });
};

export const useCreateTimelineReplyEmail = (queryClient: QueryClient, token?: string) => {
  return useMutation<TimelineItem, Error, TimelineReplyEmail>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createTimelineReplyEmail(token, data);
    },
    onSuccess: (record) => invalidateTimelineQueries(queryClient, record.id),
  });
};

export const useCreateTimelineInterviewAnalyse = (queryClient: QueryClient, token?: string) => {
  return useMutation<TimelineItem, Error, TimelineInterviewAnalyse>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createTimelineInterviewAnalyse(token, data);
    },
    onSuccess: (record) => invalidateTimelineQueries(queryClient, record.id),
  });
};

export const useUpdateCustomInstructions = (queryClient: QueryClient, id?: string, token?: string) => {
  return useMutation<TimelineItem, Error, TimelineCustomInstructionsUpdate>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      if (!id) throw new Error("Missing id");
      return updateCustomInstructions(token, id, data);
    },
    onSuccess: (record) => invalidateTimelineQueries(queryClient, record.id),
  });
};

export const useDeleteTimelineItem = (queryClient: QueryClient, token?: string) => {
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => {
      if (!token) throw new Error("Missing token");
      return deleteTimelineItem(token, id);
    },
    onSuccess: (_, id) => invalidateTimelineQueries(queryClient, id),
  });
};
