import { Request, Response } from "express";
import * as service from "../services/jobPosition.service.ts";
import { JobPositionCreateByDescription, JobPositionCreateByUrl } from "../types/JobPosition.ts";
import { fetchJobPositionUrl } from "../agents/tools/fetchCleanText.ts";

export const getAll = async (req: Request, res: Response) => {
  const { data, error } = await service.getAll(req.supabase);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

export const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await service.getById(req.supabase, id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

export const createByUrl = async (req: Request, res: Response) => {
  const payload = req.body as JobPositionCreateByUrl;
  const { data, error } = await service.createByUrl(req.supabase, req.user, payload);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const createByDescription = async (req: Request, res: Response) => {
  const payload = req.body as JobPositionCreateByDescription;
  const { data, error } = await service.createByDescription(req.supabase, req.user, payload);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await service.update(req.supabase, id, req.body);
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = await service.remove(req.supabase, id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};

export const archiveMany = async (req: Request, res: Response) => {
  const ids = req.body as string[];
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "Request body must be a non-empty array of IDs" });

  const { error } = await service.archiveMany(req.supabase, ids);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
};

export const markOfferReceived = async (req: Request, res: Response) => {
  const ids = req.body as string[];
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "Request body must be a non-empty array of IDs" });

  const { error } = await service.markOfferReceived(req.supabase, ids);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
};

export const fetch = async (req: Request, res: Response) => {
  const url  = req.query.url as string;
  try {
    console.log('here', url)
    const html = await fetchJobPositionUrl(url);
    res.json({ html });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }
  }
};
