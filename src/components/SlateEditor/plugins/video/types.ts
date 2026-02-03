/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { BrightcoveEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface BrightcoveEmbedElement {
  type: "brightcove";
  data?: BrightcoveEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export interface BrightcovePluginOptions {
  disableNormalization?: boolean;
}

export const BRIGHTCOVE_ELEMENT_TYPE = "brightcove";
export const BRIGHTCOVE_PLUGIN = "brightcove";
