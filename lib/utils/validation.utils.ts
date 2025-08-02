import z from "zod";

const getShape = <S extends z.ZodObject<any>>(schema: S) =>
  ("shape" in (schema as any) ? (schema as any).shape : (schema as any)._def.shape()) as ReturnType<S["_def"]["shape"]>;

const unwrap = (t: z.ZodTypeAny): z.ZodTypeAny => {
  const def: any = (t as any)._def;
  if (t instanceof z.ZodEffects || t instanceof z.ZodPipeline || t instanceof z.ZodBranded || t instanceof z.ZodReadonly) {
    return unwrap(def.schema);
  }
  if (t instanceof z.ZodNullable) return unwrap(def.innerType);
  return t;
};

const isOptionalLike = (t: z.ZodTypeAny): boolean => {
  const s = unwrap(t);
  if (s instanceof z.ZodOptional) return true;
  if (s instanceof z.ZodDefault) return true;
  if (s instanceof z.ZodUnion) {
    return (s as any)._def.options.some((opt: z.ZodTypeAny) => isOptionalLike(opt) || unwrap(opt) instanceof z.ZodUndefined);
  }
  return s instanceof z.ZodUndefined;
};

export const isFieldRequired = <S extends z.ZodObject<any>, K extends keyof ReturnType<S["_def"]["shape"]>>(schema: S, key: K): boolean => {
  const shape = getShape(schema);
  const zodType = shape[key as string];
  if (zodType === undefined) {
    // TODO: review this, it maybe just return false, however, for now I want to be explicity
    throw Error(`Invalid configuration: zodSchema doesn't have the key ${key as string}`);
  }

  return !isOptionalLike(zodType);
};

export const isFormFieldInvalid = (form: any, field: any) => {
  const shouldShowError = form.state.submissionAttempts > 0 || !field.state.meta.isDefaultValue;
  return shouldShowError && !field.state.meta.isValid;
};
