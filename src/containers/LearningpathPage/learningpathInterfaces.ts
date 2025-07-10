/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export interface LearningpathFormValues {
  id?: number;
  language: string;
  title: Descendant[];
  description: Descendant[];
  supportedLanguages: string[];
}
