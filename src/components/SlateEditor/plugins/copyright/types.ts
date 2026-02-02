/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CopyrightEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface CopyrightElement {
  type: "copyright";
  isFirstEdit?: boolean;
  data: CopyrightEmbedData;
  children: Descendant[];
}

export const COPYRIGHT_ELEMENT_TYPE = "copyright";
export const COPYRIGHT_PLUGIN = "copyright";
