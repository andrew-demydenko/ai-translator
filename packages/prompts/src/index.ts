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
  translate: {
    getSystem: translateSystemPrompt,
    getUser: translateUserPrompt,
  },
};

const getStrategyKey = (req: TranslationRequest): string => {
  return req.text.startsWith("GENERATE_TOPIC:") ? "practice" : "translate";
};

export const getSystemPromptTemplate = (req: TranslationRequest): string => {
  const key = getStrategyKey(req);
  return strategies[key].getSystem(req);
};

export function buildTranslatePrompt(req: TranslationRequest): string {
  const key = getStrategyKey(req);
  return strategies[key].getUser(req);
}
