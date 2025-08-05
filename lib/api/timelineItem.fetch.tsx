import {
  TimelineCoverLetter,
  TimelineCreateText,
  TimelineCustomInstructionsUpdate,
  TimelineItem,
  TimelineLinkedinIntro,
  TimelineReplyEmail,
  TimelineType,
} from "@/supabase/functions/api/types/TimelineItem";
import { API_BASE_URL, defaultHeaders } from "./api";

export const fetchTimelineItems = async (
  token: string,
  params: {
    page?: number;
    size?: number;
    unpaged?: boolean;
    jobPositionId?: string;
    type?: TimelineType;
  }
): Promise<TimelineItem[]> => {
  const query = new URLSearchParams();

  if (params.unpaged) {
    query.append("unpaged", "true");
  } else if (params.page !== undefined && params.size !== undefined) {
    query.append("page", params.page.toString());
    query.append("size", params.size.toString());
  } else {
    throw new Error("Must provide either page & size, or unpaged=true");
  }

  if (params.jobPositionId) {
    query.append("jobPositionId", params.jobPositionId);
  }
  if (params.type) {
    query.append("type", params.type);
  }

  const res = await fetch(`${API_BASE_URL}/timeline-items?${query.toString()}`, {
    headers: defaultHeaders(token),
  });
  if (!res.ok) throw new Error("Failed to fetch timeline items");
  return await res.json();
};

export const fetchTimelineItem = async (token: string, id: string): Promise<TimelineItem> => {
  const res = await fetch(`${API_BASE_URL}/timeline-items/${id}`, {
    headers: defaultHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to fetch timeline item ${id}`);
  return await res.json();
};

export const createTimelineNote = async (token: string, body: TimelineCreateText): Promise<TimelineItem> => {
  const res = await fetch(`${API_BASE_URL}/timeline-items/note`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create timeline note");
  return await res.json();
};

export const createTimelineCoverLetter = async (token: string, body: TimelineCoverLetter): Promise<TimelineItem> => {
  const res = await fetch(`${API_BASE_URL}/timeline-items/cover-letter`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create timeline cover letter");
  return await res.json();
};

export const createTimelineLinkedinIntro = async (token: string, body: TimelineLinkedinIntro): Promise<TimelineItem> => {
  const res = await fetch(`${API_BASE_URL}/timeline-items/linkedin-intro`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create timeline linkedin intro");
  return await res.json();
};

export const createTimelineReplyEmail = async (token: string, body: TimelineReplyEmail): Promise<TimelineItem> => {
  const res = await fetch(`${API_BASE_URL}/timeline-items/reply-email`, {
    method: "POST",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to create timeline reply email");
  return await res.json();
};

export const updateCustomInstructions = async (token: string, id: string, body: TimelineCustomInstructionsUpdate): Promise<TimelineItem> => {
  const res = await fetch(`${API_BASE_URL}/timeline-items/${id}/custom-instructions`, {
    method: "PATCH",
    headers: defaultHeaders(token),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Failed to update job position ${id}`);
  return await res.json();
};

export const deleteTimelineItem = async (token: string, id: string): Promise<boolean> => {
  const res = await fetch(`${API_BASE_URL}/timeline-items/${id}`, {
    method: "DELETE",
    headers: defaultHeaders(token),
  });
  if (!res.ok) throw new Error(`Failed to delete timeline item ${id}`);
  return true;
};
