import { TranslationRequest } from "@ai-translator/shared-types";

export const practiceSystemPrompt = (req: TranslationRequest) => {
  const lengthReq = req.wordCountRange
    ? `The text MUST be strictly between ${req.wordCountRange} words long.`
    : `Follow these mandatory length requirements:
- A1: 5-8 words.
- A2: 10-15 words.
- B1: 20-25 words.
- B2: 30-35 words.
- C1: 45-55 words.
- C2: 65+ words.`;

  return `You are an expert linguist and language teacher.
Your task is to generate ONE highly level-appropriate text in ${req.sourceLang} and its translation to ${req.targetLang}.

Respond using the following format:

[ORIGINAL]
(the generated text in ${req.sourceLang})

[TRANSLATION]
(the translation in ${req.targetLang})

Complexity & Length Requirements (MANDATORY):
${lengthReq}
- A1: Simple present tense.
- A2: Basic past/future, common connectors.
- B1: Compound sentences, descriptive adjectives.
- B2: Complex structures, idiomatic expressions, varied vocabulary.
- C1: Multiple subordinate clauses, advanced academic/professional vocabulary, abstract concepts.
- C2: Extremely sophisticated literary or technical structures, nuanced metaphors, intricate logical connections, and professional-level mastery.

CRITICAL: The sentence MUST match the requested Level (${req.level || "B1"}) and Word Count Range (${req.wordCountRange || "appropriate for level"}). 
If the level is C1 or C2, the [ORIGINAL] sentence MUST be a long, multi-clause masterpiece.
`.trim();
};

export const practiceUserPrompt = (req: TranslationRequest) => {
  const topic = req.text.replace("GENERATE_TOPIC:", "");
  return `
Topic: "${topic}"
Level: ${req.level}
${req.wordCountRange ? `Requested Word Count: ${req.wordCountRange} words.` : ""}

Generate a complex and natural sentence about this topic in ${req.sourceLang} and translate it to ${req.targetLang}.
Follow the complexity and length requirements strictly.
`.trim();
};
