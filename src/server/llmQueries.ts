/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isLanguageCode, LanguageCode, Payload, PromptType, PromptVariables } from "../modules/llm/llmApiTypes";
import { unreachable } from "../util/guards";
import { DEBUG_INSTRUCTION, ERROR_INSTRUCTION, Prompt, PROMPTS } from "./llmPrompts";

type LlmQuery<T extends PromptVariables> = {
  components: (variables: T) => string;
  promptSelector: (lang: LanguageCode) => Prompt;
};

type ExtractVariables<T extends PromptType> = Extract<PromptVariables, { type: T }>;

const createQuery = <T extends PromptType>(
  type: T,
  componentSelectors: Record<string, keyof ExtractVariables<T>> = {},
): LlmQuery<ExtractVariables<T>> => {
  const components = (variables: ExtractVariables<T>) =>
    Object.entries(componentSelectors)
      .map(([tag, variableKey]) => `<${tag}>${variables[variableKey]}</${tag}>`)
      .join("\n");

  const promptSelector = (lang: LanguageCode) => PROMPTS[lang][type];

  return {
    promptSelector,
    components,
  };
};

const ARTICLE_SUMMARY_QUERY = createQuery("summary", {
  draft: "text",
});

const META_DESCRIPTION_QUERY = createQuery("metaDescription", {
  draft: "text",
});

const ALTERNATIVE_PRHASING_QUERY = createQuery("alternativePhrasing", {
  excerpt: "excerpt",
  draft: "text",
});

const ALT_TEXT_QUERY = createQuery("altText");

const REFLECTION_QUESTION_QUERY = createQuery("reflection", {
  draft: "text",
});

const getLlmQuery = <T extends PromptVariables>(type: T["type"]): LlmQuery<T> => {
  switch (type) {
    case "summary":
      return ARTICLE_SUMMARY_QUERY as LlmQuery<T>;
    case "metaDescription":
      return META_DESCRIPTION_QUERY as LlmQuery<T>;
    case "alternativePhrasing":
      return ALTERNATIVE_PRHASING_QUERY as LlmQuery<T>;
    case "altText":
      return ALT_TEXT_QUERY as LlmQuery<T>;
    case "reflection":
      return REFLECTION_QUESTION_QUERY as LlmQuery<T>;
    default:
      return unreachable(type);
  }
};

export const llmQueryText = (payload: Payload<PromptVariables>, language: string) => {
  const lang = isLanguageCode(language) ? language : "nb";
  const { components, promptSelector } = getLlmQuery(payload.type);
  const prompt = promptSelector(lang);
  const role = payload.role ?? prompt.role;
  const generalInstructions = payload.instructions ?? prompt.generalInstructions;

  return {
    role,
    message: `
      ${components(payload)}
      <instructions>
      ${generalInstructions}
      ${prompt.formatInstructions}
      ${DEBUG_INSTRUCTION[lang]}
      ${ERROR_INSTRUCTION[lang]}
      </instructions>`,
  };
};
