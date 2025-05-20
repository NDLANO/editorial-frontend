/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PromptVariables, Payload, PromptType, DefaultPrompts } from "../../server/llmApiTypes";
import { fetchAuthorized } from "../../util/apiHelpers";
import { resolveJsonOrRejectWithError, resolveTextOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";

export const fetchAIGeneratedAnswer = async <TVariables extends PromptVariables>(
  payload: Payload<TVariables>,
): Promise<string> =>
  fetchAuthorized("/generate-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => resolveTextOrRejectWithError(res));

export const fetchDefaultAiPrompts = async (type: PromptType, language: string): Promise<DefaultPrompts> =>
  fetchAuthorized(`/default-ai-prompts?type=${type}&language=${language}`).then((res) =>
    resolveJsonOrRejectWithError(res),
  );
