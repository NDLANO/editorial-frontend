/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { ImageEmbedData } from "@ndla/types-embed";

export const TYPE_IMAGE = "image";

export interface ImageElement {
  type: "image";
  data?: ImageEmbedData;
  children: Descendant[];
}
