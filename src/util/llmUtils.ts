/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMutation, UseMutationOptions } from "@tanstack/react-query";

interface BaseVariables {
  language: string;
  max_tokens?: number;
}

type Payload =
  | SummaryVariables
  | AlttextVariables
  | AlternativePhrasingVariables
  | MetaDescriptionVariables
  | ReflectionVariables;

const fetchAIGeneratedAnswer = async (payload: Payload): Promise<string> =>
  (
    await fetch("/generate-ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  ).text();

interface SummaryVariables extends BaseVariables {
  type: "summary";
  text: string;
  title: string;
}

export const useGenerateSummary = (options?: UseMutationOptions<string, any, SummaryVariables>) =>
  useMutation<string, any, SummaryVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    mutationKey: ["summary"],
    ...options,
  });

interface AlttextVariables extends BaseVariables {
  type: "alttext";
  image: {
    fileType: string;
    base64: string;
  };
}
export const useGenerateAlttext = (options?: UseMutationOptions<string, any, AlttextVariables>) =>
  useMutation<string, any, AlttextVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    mutationKey: ["alttext"],
    ...options,
  });

interface AlternativePhrasingVariables extends BaseVariables {
  type: "alternativePhrasing";
  text: string;
  excerpt: string;
}
export const useGenerateAlternativePhrasing = (
  options?: UseMutationOptions<string, any, AlternativePhrasingVariables>,
) =>
  useMutation<string, any, AlternativePhrasingVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    mutationKey: ["alternativePhrasing"],
    ...options,
  });

interface MetaDescriptionVariables extends BaseVariables {
  type: "metaDescription";
  text: string;
  title: string;
}

export const useGenerateMetaDescription = (options?: UseMutationOptions<string, any, MetaDescriptionVariables>) =>
  useMutation<string, any, MetaDescriptionVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    mutationKey: ["metadescription"],
    ...options,
  });

interface ReflectionVariables extends BaseVariables {
  type: "reflection";
  text: string;
}

export const useGenerateReflection = (options?: UseMutationOptions<string, any, ReflectionVariables>) =>
  useMutation<string, any, ReflectionVariables>({
    mutationFn: fetchAIGeneratedAnswer,
    mutationKey: ["reflection"],
    ...options,
  });

export const getTextFromHTML = (html: string) =>
  new DOMParser().parseFromString(html, "text/html").body.textContent || "";
