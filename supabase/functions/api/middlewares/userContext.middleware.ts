import { NextFunction, Request, Response } from "express";

export const userContext = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.supabase) {
    throw new Error("Invalid configuration, you should use `supabaseContext` before `userContext`");
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    throw new Error("trying to apply userContext without header authorization");
  }

  const jwt = authHeader.replace("Bearer ", "");
  const { data, error } = await req.supabase.auth.getUser(jwt);
  const user = data.user;
  if (error || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.user = user;

  next();
};
