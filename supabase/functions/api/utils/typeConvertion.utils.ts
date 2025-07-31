import type { PostgrestSingleResponse } from "@supabase/supabase-js";
import camelcaseKeys from "npm:camelcase-keys";
import snakecaseKeys from "npm:snakecase-keys";
import { ServiceResponse, ServiceResponseFailure, ServiceError } from "../types/ServiceResponse.ts";
import { PostgrestResponseFailure } from "npm:@supabase/postgrest-js@1.19.4";
import { StorageError } from "npm:@supabase/storage-js@2.7.1";

const convertPostgrestError = <T>(query: PostgrestResponseFailure): ServiceResponseFailure => {
  const error = new ServiceError({
    message: query.error.message,
    details: query.error.details,
    hint: query.error.hint,
    code: query.error.code,
  });

  return { error, data: null, count: null };
};

export const convertStorageError = (error: StorageError): ServiceResponseFailure => {
  const serviceError = new ServiceError({
    message: error.message,
    details: error.cause,
    hint: undefined,
    code: undefined,
  });

  return { error: serviceError, data: null, count: null };
};

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
