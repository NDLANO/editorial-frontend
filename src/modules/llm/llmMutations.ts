/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DefaultError, UseMutationOptions, useMutation } from "@tanstack/react-query";
import { fetchAIGeneratedAnswer } from "./llmApi";
import {
  SummaryVariables,
  AlttextVariables,
  AlternativePhrasingVariables,
  MetaDescriptionVariables,
  ReflectionVariables,
} from "./llmApiTypes";

export const useGenerateSummary = (options?: UseMutationOptions<string, DefaultError, SummaryVariables>) =>
  useMutation<string, DefaultError, SummaryVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateAltText = (options?: UseMutationOptions<string, DefaultError, AlttextVariables>) =>
  useMutation<string, DefaultError, AlttextVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateAlternativePhrasing = (
  options?: UseMutationOptions<string, DefaultError, AlternativePhrasingVariables>,
) =>
  useMutation<string, DefaultError, AlternativePhrasingVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateMetaDescription = (
  options?: UseMutationOptions<string, DefaultError, MetaDescriptionVariables>,
) =>
  useMutation<string, DefaultError, MetaDescriptionVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateReflection = (options?: UseMutationOptions<string, DefaultError, ReflectionVariables>) =>
  useMutation<string, DefaultError, ReflectionVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });
