import { createClient } from "@supabase/supabase-js";
import { NextFunction, Request, Response } from "express";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
export const isLocal = supabaseUrl.startsWith("http://kong:");

export const supabaseContext = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const options = { global: { headers: { Authorization: authHeader } } };
  const supabase = createClient(supabaseUrl, supabaseAnonKey, options);
  req.supabase = supabase;

  next();
};
