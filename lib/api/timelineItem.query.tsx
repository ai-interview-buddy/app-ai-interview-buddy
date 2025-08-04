import { TimelineCoverLetter, TimelineCreateText, TimelineItem, TimelineType } from "@/supabase/functions/api/types/TimelineItem";
import { QueryClient, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  createTimelineCoverLetter,
  createTimelineNote,
  deleteTimelineItem,
  fetchTimelineItem,
  fetchTimelineItems,
} from "./timelineItem.fetch";

export const useTimelineItems = (
  token?: string,
  params?: {
    page?: number;
    size?: number;
    unpaged?: boolean;
    jobPositionId?: string;
    type?: TimelineType;
  }
): UseQueryResult<TimelineItem[], Error> => {
  return useQuery<TimelineItem[], Error>({
    queryKey: ["timeline-items", params],
    enabled: !!token && !!params && (params.unpaged || (params.page !== undefined && params.size !== undefined)),
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchTimelineItems(token!, params!),
  });
};

export const useTimelineItem = (token?: string, id?: string): UseQueryResult<TimelineItem, Error> => {
  return useQuery<TimelineItem, Error>({
    queryKey: ["timeline-item", id],
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchTimelineItem(token!, id!),
  });
};

const invalidateTimelineQueries = (queryClient: QueryClient, id?: string) => {
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

export const useDeleteTimelineItem = (queryClient: QueryClient, token?: string) => {
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => {
      if (!token) throw new Error("Missing token");
      return deleteTimelineItem(token, id);
    },
    onSuccess: (_, id) => invalidateTimelineQueries(queryClient, id),
  });
};
