export declare type ServiceResponse<T> = ServiceResponseSuccess<T> | ServiceResponseFailure;

export type ServiceResponseSuccess<T> = {
  error: null;
  data: T;
  count: number | null;
};

export type ServiceResponseFailure = {
  error: ServiceError;
  data: null;
  count: null;
};

export class ServiceError extends Error {
  details?: string | unknown | undefined;
  hint?: string;
  code?: string;

  constructor(context: { message: string; details?: string | unknown | undefined; hint?: string; code?: string }) {
    super(context.message);
    this.name = "ServiceError";

    this.details = context.details;
    this.hint = context.hint;
    this.code = context.code;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
  }
}
