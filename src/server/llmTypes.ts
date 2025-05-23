/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type Prompt = {
  role: string;
  generalInstructions: string;
  formatInstructions: string;
};

export type LlmLanguageCode = "nb" | "nn" | "en";

export const isLlmLanguageCode = (lang: string): lang is LlmLanguageCode =>
  lang === "nb" || lang === "nn" || lang === "en";
