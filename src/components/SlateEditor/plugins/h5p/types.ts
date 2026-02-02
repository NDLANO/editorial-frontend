/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { H5pEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface H5pElement {
  type: "h5p";
  data?: H5pEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export interface H5pPluginOptions {
  disableNormalize?: boolean;
}

export const H5P_ELEMENT_TYPE = "h5p";
export const H5P_PLUGIN = "h5p";
