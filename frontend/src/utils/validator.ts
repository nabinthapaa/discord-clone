import { ZodSchema, z, ZodError } from "zod";
import { ValidationErrors } from "../types/errors";

export function validate(
  Schema: ZodSchema,
  data: z.infer<typeof Schema>,
): ValidationErrors {
  try {
    Schema.parse(data);
    return { success: true, errors: null };
  } catch (e) {
    if (e instanceof ZodError) {
      return {
        success: false,
        errors: e.errors.flat().map((err) => {
          return {
            error: err.path[0],
            message: err.message,
          };
        }),
      };
    }
    return { success: false, errors: null };
  }
}
