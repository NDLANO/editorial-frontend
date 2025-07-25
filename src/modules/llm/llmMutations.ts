/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DefaultError, UseMutationOptions, useMutation } from "@tanstack/react-query";
import { fetchAIGeneratedAnswer } from "./llmApi";
import { PromptVariables, PromptPayload, LlmResponse } from "../../interfaces";

export const useGenerateAIMutation = <TVariables extends PromptVariables>(
  options?: UseMutationOptions<LlmResponse, DefaultError, PromptPayload<TVariables>>,
) =>
  useMutation({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });
