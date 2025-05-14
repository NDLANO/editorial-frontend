/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type PromptType = PromptVariables["type"];

export type PromptVariables =
  | SummaryVariables
  | AltTextVariables
  | AlternativePhrasingVariables
  | MetaDescriptionVariables
  | ReflectionVariables;

export interface SummaryVariables {
  type: "summary";
  text: string;
  title: string;
}

export interface AltTextVariables {
  type: "altText";
  image: {
    fileType: string;
    base64: string;
  };
}

export interface AlternativePhrasingVariables {
  type: "alternativePhrasing";
  text: string;
  excerpt: string;
}

export interface MetaDescriptionVariables {
  type: "metaDescription";
  text: string;
  title: string;
}

export interface ReflectionVariables {
  type: "reflection";
  text: string;
}

export type Payload<T extends PromptVariables> = T & {
  language: string;
  role?: string;
  instructions?: string;
  max_tokens?: number;
};

export type LanguageCode = "nb" | "nn" | "en";

export const isLanguageCode = (lang: string): lang is LanguageCode => lang === "nb" || lang === "nn" || lang === "en";
