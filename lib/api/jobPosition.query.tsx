import {
  JobPosition,
  JobPositionCreateByDescription,
  JobPositionCreateByUrl,
  JobPositionUpdate,
} from "@/supabase/functions/api/types/JobPosition";
import { Query, QueryClient, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  archiveJobPosition,
  createJobPositionByDescription,
  createJobPositionByUrl,
  deleteJobPosition,
  fetchJobPosition,
  fetchJobPositions,
  markJobPositionOfferReceived,
  updateJobPosition,
} from "./jobPosition.fetch";

export const useJobPositions = (token?: string) => {
  return useQuery<JobPosition[]>({
    queryKey: ["job-positions"],
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchJobPositions(token!),
  });
};

export const useJobPosition = (
  token?: string,
  id?: string,
  options?: { refetchInterval?: number | false | ((query: Query<JobPosition, Error>) => number | false | undefined) }
): UseQueryResult<JobPosition, Error> => {
  return useQuery<JobPosition, Error>({
    queryKey: ["job-position", id],
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    refetchInterval: options?.refetchInterval ?? false,
    queryFn: () => fetchJobPosition(token!, id!),
  });
};

const invalidateJobQueries = (queryClient: QueryClient, id: string) => {
  // JobPosition
  queryClient.invalidateQueries({ queryKey: ["job-positions"] });
  queryClient.invalidateQueries({ queryKey: ["job-position", id] });
};

export const useCreateJobPositionByUrl = (queryClient: QueryClient, token?: string) => {
  return useMutation<JobPosition, Error, JobPositionCreateByUrl>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createJobPositionByUrl(token, data);
    },
    onSuccess: (record) => invalidateJobQueries(queryClient, record.id),
  });
};

export const useCreateJobPositionByDescription = (queryClient: QueryClient, token?: string) => {
  return useMutation<JobPosition, Error, JobPositionCreateByDescription>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createJobPositionByDescription(token, data);
    },
    onSuccess: (record) => invalidateJobQueries(queryClient, record.id),
  });
};

export const useUpdateJobPosition = (queryClient: QueryClient, token?: string) => {
  return useMutation<JobPosition, Error, { id?: string; data: JobPositionUpdate }>({
    mutationFn: ({ id, data }) => {
      if (!token) throw new Error("Missing token");
      if (!id) throw new Error("Missing id");
      return updateJobPosition(token, id, data);
    },
    onSuccess: (record) => invalidateJobQueries(queryClient, record.id),
  });
};

export const useDeleteJobPosition = (queryClient: QueryClient, token?: string) => {
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => {
      if (!token) throw new Error("Missing token");
      return deleteJobPosition(token, id);
    },
    onSuccess: (_, id) => invalidateJobQueries(queryClient, id),
  });
};

export const useArchiveJobPosition = (queryClient: QueryClient, token?: string) => {
  return useMutation<boolean, Error, string[]>({
    mutationFn: (ids: string[]) => {
      if (!token) throw new Error("Missing token");
      return archiveJobPosition(token, ids);
    },
    onSuccess: (_, ids: string[]) => {
      ids.forEach(id => invalidateJobQueries(queryClient, id));
    },
  });
};

export const useMarkJobPositionOfferReceived = (queryClient: QueryClient, token?: string) => {
  return useMutation<boolean, Error, string[]>({
    mutationFn: (ids: string[]) => {
      if (!token) throw new Error("Missing token");
      return markJobPositionOfferReceived(token, ids);
    },
    onSuccess: (_, ids: string[]) => {
      ids.forEach(id => invalidateJobQueries(queryClient, id));
    },
  });
};
