import { Request, Response } from "express";
import { createMockInterviewSession } from "../services/mockInterview.service.ts";
import { MockInterviewRequest } from "../types/MockInterview.ts";

export const create = async (req: Request, res: Response) => {
  const payload = req.body as MockInterviewRequest;
  const { data, error } = await createMockInterviewSession(req.supabase, req.user, payload);

  if (error) {
    return res.status(400).json({ error: error.message, details: error.details });
  }

  res.status(200).json(data);
};
