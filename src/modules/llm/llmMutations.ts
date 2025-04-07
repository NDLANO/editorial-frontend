/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DefaultError, UseMutationOptions, useMutation } from "@tanstack/react-query";
import { fetchAIGeneratedAnswer } from "./llmApi";
import { Payload } from "./llmApiTypes";

export const useGenerateAIMutation = <TVariables extends Payload>(
  options?: UseMutationOptions<string, DefaultError, TVariables>,
) =>
  useMutation<string, DefaultError, TVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });
