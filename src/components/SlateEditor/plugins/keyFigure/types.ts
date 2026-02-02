/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyFigureEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface KeyFigureElement {
  type: "key-figure";
  data: KeyFigureEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}

export const KEY_FIGURE_ELEMENT_TYPE = "key-figure";
export const KEY_FIGURE_PLUGIN = "key-figure";
