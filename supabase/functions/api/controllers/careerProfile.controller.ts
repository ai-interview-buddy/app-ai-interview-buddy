import { Request, Response } from "express";
import * as service from "../services/careerProfile.service.ts";

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

export const getSignedUrlById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { data, error } = await service.getSignedUrlById(req.supabase, id);
  if (error) return res.status(404).json({ error: error.message });
  res.json(data);
};

export const create = async (req: Request, res: Response) => {
  const { data, error } = await service.create(req.supabase, req.user, req.body);
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
