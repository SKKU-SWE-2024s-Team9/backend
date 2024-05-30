import { ZodType, z } from "zod";

export function regexCount(regex: RegExp, text: string): number {
  return text.match(regex)?.length ?? 0;
}

type ZodRefinement<T> = Parameters<ZodType<T>["superRefine"]>[0];
export const passwordRefinement: ZodRefinement<string> = async (
  password,
  ctx
) => {
  const upperCount = regexCount(/[A-Z]/g, password);
  const lowerCount = regexCount(/[a-z]/g, password);
  const numberCount = regexCount(/[0-9]/g, password);
  const othersCount = password.length - upperCount - lowerCount - numberCount;
  if (upperCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one uppercase letter(A~Z) is required.",
    });
  }
  if (lowerCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one lowercase letter(a~z) is required.",
    });
  }
  if (numberCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one digit(0~9) is required.",
    });
  }
  if (othersCount === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "At least one special character(!@#...) is required.",
    });
  }
};
