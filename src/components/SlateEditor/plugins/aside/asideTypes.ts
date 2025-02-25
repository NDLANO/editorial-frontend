/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const ASIDE_ELEMENT_TYPE = "aside";
export const ASIDE_PLUGIN = "aside";

export interface AsideElement {
  type: "aside";
  children: Descendant[];
  data: {
    type: "factAside";
  };
}
