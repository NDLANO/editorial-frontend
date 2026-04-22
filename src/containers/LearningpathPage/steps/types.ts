/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResourceType } from "@ndla/types-taxonomy";
import { Descendant } from "slate";

export interface ExternalFormValues {
  type: "EXTERNAL";
  title: string;
  introduction: string;
  url: string;
  shareable: boolean;
  description?: Descendant[];
  license?: string;
}

export interface TextFormValues {
  type: "TEXT";
  title: string;
  introduction: string;
  description?: Descendant[];
  license?: string;
}

export interface ResourceFormValues {
  type: "ARTICLE";
  embedUrl: string;
  title: string;
  articleId?: number;
  description?: Descendant[];
  license?: string;
}

export type LearningpathStepFormValues = TextFormValues | ExternalFormValues | ResourceFormValues;

export interface ResourceData {
  articleId: number;
  articleType: string;
  title: string;
  breadcrumbs?: string[];
  resourceTypes?: Pick<ResourceType, "id" | "name">[];
  relevanceId?: string;
}
