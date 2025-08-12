import { Request, Response } from "express";
import * as service from "../services/interviewQuestion.service.ts";
import { InterviewQuestionFilter, QuestionType } from "../types/InterviewQuestion.ts";

export const getAll = async (req: Request, res: Response) => {
  const params: InterviewQuestionFilter = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
    size: req.query.size ? parseInt(req.query.size as string, 10) : undefined,
    unpaged: req.query.unpaged === "true",
    timelineItemId: req.query.timelineItemId as string | undefined,
    questionType: req.query.questionType as QuestionType | undefined,
  };

  const { data, error } = await service.getAll(req.supabase, params);

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await service.getById(req.supabase, id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await service.remove(req.supabase, id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};
