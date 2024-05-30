import { z } from "zod";
import { passwordRefinement } from "../../util/validation";

export const passwordSchema = z
  .string()
  .min(8)
  .max(16)
  .superRefine(passwordRefinement);

export const authLoginRequestSchema = z.object({
  username: z.string(),
  password: passwordSchema,
});
