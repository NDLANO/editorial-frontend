/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export interface ExternalFormValues {
  type: "external";
  title: string;
  introduction: string;
  url: string;
  shareable: boolean;
}

export interface FolderFormValues {
  type: "folder";
  embedUrl: string;
  title: string;
}

export interface TextFormValues {
  type: "text";
  title: string;
  introduction: string;
  description: Descendant[];
}

export interface ResourceFormValues {
  type: "resource";
  embedUrl: string;
  title: string;
}

export type LearningpathStepFormValues = TextFormValues | ExternalFormValues | ResourceFormValues | FolderFormValues;
