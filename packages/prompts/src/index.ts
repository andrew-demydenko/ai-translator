export * from "./constants";
import { TranslationRequest } from "@ai-translator/shared-types";
import { practiceSystemPrompt, practiceUserPrompt } from "./templates/practice";
import {
  translateSystemPrompt,
  translateUserPrompt,
} from "./templates/translate";

type PromptStrategy = {
  getSystem: (req: TranslationRequest) => string;
  getUser: (req: TranslationRequest) => string;
};

const strategies: Record<string, PromptStrategy> = {
  practice: {
    getSystem: practiceSystemPrompt,
    getUser: practiceUserPrompt,
  },
  translation: {
    getSystem: translateSystemPrompt,
    getUser: translateUserPrompt,
  },
};

export const getStrategyKey = (req: TranslationRequest): string => {
  return req.generationType;
};

export const getSystemPromptTemplate = (req: TranslationRequest): string => {
  const key = getStrategyKey(req);
  return strategies[key].getSystem(req);
};

export function buildPrompt(req: TranslationRequest): string {
  const key = getStrategyKey(req);
  return strategies[key].getUser(req);
}
