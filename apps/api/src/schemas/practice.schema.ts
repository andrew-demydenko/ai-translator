import { z } from "zod";

export const PracticeRequestSchema = z.object({
  generationType: z.literal("practice"),
  sourceLang: z.string().min(2),
  targetLang: z.string().min(2),
  text: z.string(),
  level: z.string().optional(),
  wordCountRange: z.string().optional(),
});

export type PracticeRequestDTO = z.infer<typeof PracticeRequestSchema>;
