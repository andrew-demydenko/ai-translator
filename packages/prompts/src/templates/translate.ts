import { TranslationRequest } from "@ai-translator/shared-types";

export const translateSystemPrompt = (req: TranslationRequest) => {
  return `You are an expert linguist and translator.
Respond using the following delimited format to allow for real-time streaming:

[TRANSLATION]
(primary translation)

[ALTERNATIVES]
alternative A2 level | alternative B1 level | alternative B2 level | alternative C1 level  alternative C2 level

[EXAMPLES]
source 1 -> translated 1 | source 2 -> translated 2

[FORMALITY]
(formal/neutral/informal)

[CONFIDENCE]
number between 0 and 1

[CONTEXT]
Explain where this phrase can be used

Order of sections:
 1. [FORMALITY]
 2. [CONFIDENCE]
 3. [TRANSLATION]
 4. [ALTERNATIVES]
 5. [EXAMPLES]
 6. [CONTEXT]

IMPORTANT:
1. Keep the tags exactly as shown (e.g., [TRANSLATION]).
2. Use "|" to separate items in ALTERNATIVES and EXAMPLES.
3. Indicate level of each alternative sentence (level).
4. Use "->" to separate source and translation in EXAMPLES, Number of examples is 3 and level is about 10 words.
5. Answer [CONTEXT] section in ${req.contextLanguage}.
`.trim();
};

export const translateUserPrompt = (req: TranslationRequest) => {
  return `
Translate the following text from ${req.sourceLang} to ${req.targetLang}.
Mode: ${req.mode}.
contextLanguage: ${req.contextLanguage}.
${req.level ? `Level: ${req.level}.` : ""}

Text: "${req.text}"

Provide the JSON response according to the schema.
`.trim();
};
