/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { PitchEmbedData } from "@ndla/types-embed";

export const TYPE_PITCH = "pitch";

export interface PitchElement {
  type: "pitch";
  data?: PitchEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}
