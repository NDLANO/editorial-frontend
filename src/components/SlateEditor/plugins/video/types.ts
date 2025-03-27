/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { BrightcoveEmbedData } from "@ndla/types-embed";

export interface BrightcoveEmbedElement {
  type: "brightcove-embed";
  data?: BrightcoveEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export interface BrightcovePluginOptions {
  disableNormalization?: boolean;
}

export const BRIGHTCOVE_ELEMENT_TYPE = "brightcove-embed";
export const BRIGHTCOVE_PLUGIN = "brightcove-embed";
