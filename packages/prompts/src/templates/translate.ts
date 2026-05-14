import { TranslationRequest } from "@ai-translator/shared-types";
import { TRANSLATION_FIELDS } from "../constants";

export const translateSystemPrompt = (req: TranslationRequest) => {
  const sectionsList = TRANSLATION_FIELDS.map(
    (f, i) => ` ${i + 1}. ${f.tag}`,
  ).join("\n");

  return `You are an expert linguist and translator.
Respond using the following delimited format to allow for real-time streaming:

[TRANSLATION]
(primary translation)

[ALTERNATIVES]
alternative A2 level | alternative B1 level | alternative B2 level | alternative C1 level | alternative C2 level

[SYNONYMS]
synonym1 | synonym2 | synonym3 | synonym4 | ...


[EXAMPLES]
source 1 -> translated 1 | source 2 -> translated 2 | source 3 -> translated 3

[FORMALITY]
(formal/neutral/informal)

[CONFIDENCE]
number between 0 and 1

[CONTEXT]
(usage context, exceptions, and special notes)

Order of sections:
${sectionsList}

IMPORTANT:
1. Keep the tags exactly as shown (e.g., [TRANSLATION]).
2. Use "|" to separate items in ALTERNATIVES, SYNONYMS and EXAMPLES.
3. Indicate level of each alternative sentence (level).
4. Use "->" to separate source and translation in EXAMPLES. Number of examples is 3, each about 14 words.
5. [SYNONYMS] section: only include if the input is a single word or short phrase (number of synonyms as max as possible). List synonyms in the ${req.targetLang} language. If input is looks like a sentence, write empty.
6. [CONTEXT] section: explain where and when this word/phrase is used (formal speech, slang, regional usage, specific domains). Include any exceptions, irregular forms, common mistakes, or interesting linguistic notes. Answer in ${req.contextLanguage}.
`.trim();
};

export const translateUserPrompt = (req: TranslationRequest) => {
  const isShortInput = req.text.trim().split(/\s+/).length <= 4;

  return `
Translate the following text from ${req.sourceLang} to ${req.targetLang}.
Mode: ${req.mode}.
Context language: ${req.contextLanguage}.
${req.level ? `Level: ${req.level}.` : ""}
Input type: ${isShortInput ? "single word or short phrase — provide SYNONYMS" : "sentence or paragraph — set SYNONYMS to empty"}.

Text: "${req.text}"
`.trim();
};
