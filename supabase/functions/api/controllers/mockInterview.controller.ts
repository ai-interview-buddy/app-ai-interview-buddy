import { Request, Response } from "express";
import { analyseMockInterview, createMockInterviewSession } from "../services/mockInterview.service.ts";
import { MockInterviewAnalyseRequest, MockInterviewRequest } from "../types/MockInterview.ts";

export const create = async (req: Request, res: Response) => {
  const payload = req.body as MockInterviewRequest;
  const { data, error } = await createMockInterviewSession(req.supabase, req.user, payload);

  if (error) {
    return res.status(400).json({ error: error.message, details: error.details });
  }

  res.status(200).json(data);
};

export const analyse = async (req: Request, res: Response) => {
  const payload = req.body as MockInterviewAnalyseRequest;
  const { data, error } = await analyseMockInterview(req.supabase, req.user, payload);

  if (error) {
    return res.status(400).json({ error: error.message, details: error.details });
  }

  res.status(200).json(data);
};
