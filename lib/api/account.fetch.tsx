import { API_BASE_URL, defaultHeaders } from "./api";

export const deleteAccount = async (token: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/account`, {
    method: "DELETE",
    headers: defaultHeaders(token),
  });

  if (!res.ok) throw new Error(`Failed to delete account`);
  return true; // Or res.status === 204
};
