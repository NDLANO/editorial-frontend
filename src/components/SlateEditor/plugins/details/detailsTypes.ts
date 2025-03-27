/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const DETAILS_ELEMENT_TYPE = "details";
export const DETAILS_PLUGIN = "details";

export interface DetailsElement {
  type: "details";
  children: Descendant[];
}
