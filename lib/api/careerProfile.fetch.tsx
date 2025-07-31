import { CareerProfile, CareerProfileCreate, CareerProfileUpdate } from "@/supabase/functions/api/types/CareerProfile";
import { API_BASE_URL, defaultHeaders } from "./api";

export const fetchCareerProfiles = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/career-profiles`, {
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to fetch career profiles");
  return await res.json();
};

export const fetchCareerProfile = async (token: string, id: string) => {
  const res = await fetch(`${API_BASE_URL}/career-profiles/${id}`, {
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error(`Failed to fetch career profile ${id}`);
  return await res.json();
};

export const fetchSignedDownloadUrl = async (token?: string, id?: string) => {
  if (!token || !id) throw new Error(`fetchSignedDownloadUrl token or id are null`);

  const res = await fetch(`${API_BASE_URL}/career-profiles/${id}/download`, {
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error(`Failed to get signed URL for ${id}`);
  return await res.json(); // { signedUrl: string }
};

export const createCareerProfile = async (token: string, body: CareerProfileCreate): Promise<CareerProfile> => {
  const res = await fetch(`${API_BASE_URL}/career-profiles`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to create career profile");
  return await res.json();
};

export const updateCareerProfile = async (token: string, id: string, body: CareerProfileUpdate): Promise<CareerProfile> => {
  const res = await fetch(`${API_BASE_URL}/career-profiles/${id}`, {
    method: "PATCH",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Failed to update career profile ${id}`);
  return await res.json();
};

export const deleteCareerProfile = async (token: string, id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/career-profiles/${id}`, {
    method: "DELETE",
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error(`Failed to delete career profile ${id}`);
  return true; // Or res.status === 204
};
