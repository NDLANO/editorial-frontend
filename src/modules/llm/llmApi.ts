/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PromptVariables, PromptPayload, PromptType, DefaultPrompts, LlmReponse } from "../../interfaces";
import { fetchAuthorized } from "../../util/apiHelpers";
import { resolveJsonOrRejectWithError } from "../../util/resolveJsonOrRejectWithError";

export const fetchAIGeneratedAnswer = async <TVariables extends PromptVariables>(
  payload: PromptPayload<TVariables>,
): Promise<LlmReponse> =>
  fetchAuthorized("/generate-ai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  }).then((res) => resolveJsonOrRejectWithError(res));

export const fetchDefaultAiPrompts = async (type: PromptType, language: string): Promise<DefaultPrompts> =>
  fetchAuthorized(`/default-ai-prompts?type=${type}&language=${language}`).then((res) =>
    resolveJsonOrRejectWithError(res),
  );
