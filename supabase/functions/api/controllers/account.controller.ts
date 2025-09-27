import { Request, Response } from "express";
import * as service from "../services/account.service.ts";

export const remove = async (req: Request, res: Response) => {
  const { error } = await service.remove(req.supabase, req.user);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).send();
};
