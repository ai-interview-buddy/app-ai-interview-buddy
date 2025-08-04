import { Request, Response } from "express";
import * as service from "../services/timelineItem.service.ts";
import { TimelineCoverLetter, TimelineCreateText } from "../types/TimelineItem.ts";
import { TimelineFilter } from "../types/TimelineItem.ts";

export const getAll = async (req: Request, res: Response) => {
  const params: TimelineFilter = {
    page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
    size: req.query.size ? parseInt(req.query.size as string, 10) : undefined,
    unpaged: req.query.unpaged === "true",
    jobPositionId: req.query.jobPositionId as string | undefined,
    type: req.query.type as string | undefined,
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

export const createNote = async (req: Request, res: Response) => {
  const payload = req.body as TimelineCreateText;
  const { data, error } = await service.createNote(req.supabase, req.user, payload);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const createCoverLetter = async (req: Request, res: Response) => {
  const payload = req.body as TimelineCoverLetter;
  const { data, error } = await service.createCoverLetter(req.supabase, req.user, payload);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await service.remove(req.supabase, id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};
