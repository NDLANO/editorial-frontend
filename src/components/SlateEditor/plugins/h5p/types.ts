/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { H5pEmbedData } from "@ndla/types-embed";

export const TYPE_H5P = "h5p";

export interface H5pElement {
  type: "h5p";
  data?: H5pEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}
