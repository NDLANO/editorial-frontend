/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export interface SpanElement {
  type: "span";
  data: {
    lang?: string;
    dir?: string;
    "data-size"?: string;
  };
  children: Descendant[];
}

export const SPAN_ELEMENT_TYPE = "span";
export const SPAN_PLUGIN = "span";
