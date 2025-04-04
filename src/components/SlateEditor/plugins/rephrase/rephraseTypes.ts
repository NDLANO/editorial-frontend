/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export interface RephraseElement {
  type: "rephrase";
  children: Descendant[];
}

export const REPHRASE_ELEMENT_TYPE = "rephrase";
export const REPHRASE_PLUGIN = "rephrase";
