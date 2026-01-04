import { PostgrestResponseFailure } from "@supabase/postgrest-js";
import { StorageError } from "@supabase/storage-js";
import { ServiceError, ServiceResponseFailure } from "../types/ServiceResponse.ts";

export const genericError = (message: string, details?: string): ServiceResponseFailure => {
  const error = new ServiceError({
    message: message,
    details: details,
    hint: undefined,
    code: undefined,
  });

  console.error(message);

  return { error, data: null, count: null };
};

export const convertPostgrestError = (query: PostgrestResponseFailure): ServiceResponseFailure => {
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
