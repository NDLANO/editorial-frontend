/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CodeEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface CodeBlockElement {
  type: "code-block";
  data: CodeEmbedData;
  isFirstEdit: boolean;
  children: Descendant[];
}

export const CODE_BLOCK_ELEMENT_TYPE = "code-block";
export const CODE_BLOCK_PLUGIN = "code-block";
