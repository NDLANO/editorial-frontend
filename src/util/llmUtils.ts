/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const LLM_ANSWER_REGEX = /(?<=<answer>\s*).*?(?=\s*<\/answer>)/g;

const CLAUDE_HAIKU_DEFAULTS = { top_p: 0.7, top_k: 100, temperature: 0.9 };

interface Payload {
  prompt: string;
  image?: {
    base64: string;
    fileType: string;
  };
  max_tokens?: number;
}

export const fetchAIGeneratedAnswer = async (payload: Payload): Promise<string | undefined> => {
  if (!payload.prompt) {
    return undefined;
  }

  const response = await fetch("/invoke-model", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.assign(payload, CLAUDE_HAIKU_DEFAULTS)),
  });

  const responseBody = await response.json();
  return responseBody.content[0].text.match(LLM_ANSWER_REGEX);
};

export const getTextFromHTML = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent || "";
