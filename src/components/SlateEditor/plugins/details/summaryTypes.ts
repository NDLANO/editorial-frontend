/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const SUMMARY_ELEMENT_TYPE = "summary";
export const SUMMARY_PLUGIN = "summary";

export interface SummaryElement {
  type: "summary";
  children: Descendant[];
}
