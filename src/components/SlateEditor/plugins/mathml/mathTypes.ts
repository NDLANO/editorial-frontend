/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const MATH_ELEMENT_TYPE = "mathml";
export const MATH_PLUGIN = "math";

export interface MathmlElement {
  type: "mathml";
  data: { [key: string]: string };
  children: Descendant[];
  isFirstEdit?: boolean;
}
