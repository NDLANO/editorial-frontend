/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const DIV_ELEMENT_TYPE = "div" as const;
export const DIV_PLUGIN = "div" as const;

export interface DivElement {
  type: "div";
  data?: {
    align?: string;
  };
  children: Descendant[];
}
