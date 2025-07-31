import { CareerProfile, CareerProfileCreate, CareerProfileUpdate } from "@/supabase/functions/api/types/CareerProfile";
import { QueryClient, useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import {
  createCareerProfile,
  deleteCareerProfile,
  fetchCareerProfile,
  fetchCareerProfiles,
  updateCareerProfile,
} from "./careerProfile.fetch";

export const useCareerProfiles = (token?: string) => {
  return useQuery<CareerProfile[]>({
    queryKey: ["career-profiles"],
    enabled: !!token,
    staleTime: 1000 * 60 * 5,

    queryFn: () => fetchCareerProfiles(token!),
  });
};

export const useCareerProfile = (token?: string, id?: string): UseQueryResult<CareerProfile, Error> => {
  return useQuery<CareerProfile, Error>({
    queryKey: ["career-profile", id],
    enabled: !!token && !!id,
    staleTime: 1000 * 60 * 5,
    queryFn: () => fetchCareerProfile(token!, id!),
  });
};

const invalidateQueries = (queryClient: QueryClient, id: string) => {
  // revalide useCareerProfiles
  queryClient.invalidateQueries({ queryKey: ["career-profiles"] });

  // revalide useCareerProfile
  queryClient.invalidateQueries({ queryKey: ["career-profile", id] });
};

export const useCreateCareerProfile = (queryClient: QueryClient, token?: string) => {
  return useMutation<CareerProfile, Error, CareerProfileCreate>({
    mutationFn: (data) => {
      if (!token) throw new Error("Missing token");
      return createCareerProfile(token, data);
    },
    onSuccess: (record) => invalidateQueries(queryClient, record.id || ""),
  });
};

export const useUpdateCareerProfile = (queryClient: QueryClient, token?: string) => {
  return useMutation<CareerProfile, Error, { id: string | undefined; data: CareerProfileUpdate }>({
    mutationFn: ({ id, data }) => {
      if (!token) throw new Error("Missing token");
      if (!id) throw new Error("Missing id");
      return updateCareerProfile(token, id, data);
    },
    onSuccess: (record) => invalidateQueries(queryClient, record.id || ""),
  });
};

export const useDeleteCareerProfile = (queryClient: QueryClient, token?: string) => {
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => {
      if (!token) throw new Error("Missing token");
      return deleteCareerProfile(token, id);
    },
    onSuccess: (_, id) => invalidateQueries(queryClient, id),
  });
};
