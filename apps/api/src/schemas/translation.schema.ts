import { z } from "zod";

export const TranslationRequestSchema = z.object({
  text: z.string().min(1).max(5000),
  sourceLang: z.string().min(2),
  targetLang: z.string().min(2),
  generationType: z.literal("translation"),
  mode: z
    .enum(["standard", "formal", "informal", "technical"])
    .default("standard"),
  contextLanguage: z.string().min(2).default("English"),
});

export type TranslationRequestDTO = z.infer<typeof TranslationRequestSchema>;
