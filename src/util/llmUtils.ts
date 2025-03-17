/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

const CLAUDE_HAIKU_DEFAULTS = { top_p: 0.7, top_k: 100, temperature: 0.9 };

export interface Payload {
  prompt: string;
  image?: {
    base64: string;
    fileType: string;
  };
  max_tokens?: number;
}

const fetchAIGeneratedAnswer = async (payload: Payload): Promise<string> =>
  (
    await fetch("/generate-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign(payload, CLAUDE_HAIKU_DEFAULTS)),
    })
  ).text();

export const useAiGeneratedAnswer = (options?: UseMutationOptions<string, any, Payload>) =>
  useMutation<string, any, Payload>({
    mutationFn: fetchAIGeneratedAnswer,
    mutationKey: ["aigeneratedAnswer"],
    ...options,
  });

export const getTextFromHTML = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent || "";
