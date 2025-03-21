/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { fetchAIGeneratedAnswer } from "./llmApi";
import {
  SummaryVariables,
  AlttextVariables,
  AlternativePhrasingVariables,
  MetaDescriptionVariables,
  ReflectionVariables,
} from "./llmApiTypes";

export const useGenerateSummary = (options?: UseMutationOptions<string, any, SummaryVariables>) =>
  useMutation<string, any, SummaryVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateAlttext = (options?: UseMutationOptions<string, any, AlttextVariables>) =>
  useMutation<string, any, AlttextVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateAlternativePhrasing = (
  options?: UseMutationOptions<string, any, AlternativePhrasingVariables>,
) =>
  useMutation<string, any, AlternativePhrasingVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateMetaDescription = (options?: UseMutationOptions<string, any, MetaDescriptionVariables>) =>
  useMutation<string, any, MetaDescriptionVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });

export const useGenerateReflection = (options?: UseMutationOptions<string, any, ReflectionVariables>) =>
  useMutation<string, any, ReflectionVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    ...options,
  });
