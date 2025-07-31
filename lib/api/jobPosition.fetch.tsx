import {
    JobPosition,
    JobPositionCreateByDescription,
    JobPositionCreateByUrl,
    JobPositionUpdate,
} from "@/supabase/functions/api/types/JobPosition";
import { API_BASE_URL, defaultHeaders } from "./api";

export const fetchJobPositions = async (token: string): Promise<JobPosition[]> => {
  const res = await fetch(`${API_BASE_URL}/job-positions`, {
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error("Failed to fetch job positions");
  return await res.json();
};

export const fetchJobPosition = async (token: string, id: string): Promise<JobPosition> => {
  const res = await fetch(`${API_BASE_URL}/job-positions/${id}`, {
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error(`Failed to fetch job position ${id}`);
  return await res.json();
};

export const createJobPositionByUrl = async (token: string, body: JobPositionCreateByUrl): Promise<JobPosition> => {
  const res = await fetch(`${API_BASE_URL}/job-positions/by-url`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to create job position by URL");
  return await res.json();
};

export const createJobPositionByDescription = async (token: string, body: JobPositionCreateByDescription): Promise<JobPosition> => {
  const res = await fetch(`${API_BASE_URL}/job-positions/by-description`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error("Failed to create job position by description");
  return await res.json();
};

export const updateJobPosition = async (token: string, id: string, body: JobPositionUpdate): Promise<JobPosition> => {
  const res = await fetch(`${API_BASE_URL}/job-positions/${id}`, {
    method: "PATCH",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Failed to update job position ${id}`);
  return await res.json();
};

export const deleteJobPosition = async (token: string, id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/job-positions/${id}`, {
    method: "DELETE",
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error(`Failed to delete job position ${id}`);
  return true;
};
