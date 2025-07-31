import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import camelcaseKeys from "npm:camelcase-keys";
import snakecaseKeys from "npm:snakecase-keys";
import { ServiceResponse } from "../types/ServiceResponse.ts";
import { convertPostgrestError } from "./error.utils.ts";

export const convertOne = <T>(query: PostgrestSingleResponse<Record<string, unknown>>): ServiceResponse<T> => {
  if (query.error) return convertPostgrestError(query);

  const data = camelcaseKeys(query.data, { deep: false }) as T;
  return { ...query, data };
};

export const convertMany = <T>(query: PostgrestSingleResponse<Record<string, unknown>[]>): ServiceResponse<T[]> => {
  if (query.error) return convertPostgrestError(query);

  const data = query.data?.map((el) => camelcaseKeys(el, { deep: false }) as T);
  return { ...query, data };
};

export const oneToDbCase = (obj: Record<string, unknown>) => {
  return snakecaseKeys(obj);
};

export const safeErrorLog = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else {
    return String(error);
  }
};
