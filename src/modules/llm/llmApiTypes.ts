/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type Payload =
  | SummaryVariables
  | AltTextVariables
  | AlternativePhrasingVariables
  | MetaDescriptionVariables
  | ReflectionVariables;

interface BaseVariables {
  language: string;
  max_tokens?: number;
}

export interface AlternativePhrasingVariables extends BaseVariables {
  type: "alternativePhrasing";
  text: string;
  excerpt: string;
}

export interface ReflectionVariables extends BaseVariables {
  type: "reflection";
  text: string;
}

export interface MetaDescriptionVariables extends BaseVariables {
  type: "metaDescription";
  text: string;
  title: string;
}

export interface AltTextVariables extends BaseVariables {
  type: "alttext";
  image: {
    fileType: string;
    base64: string;
  };
}

export interface SummaryVariables extends BaseVariables {
  type: "summary";
  text: string;
  title: string;
}
