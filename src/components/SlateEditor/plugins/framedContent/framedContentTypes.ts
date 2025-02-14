/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";

export const FRAMED_CONTENT_ELEMENT_TYPE = "framed-content";
export const FRAMED_CONTENT_PLUGIN = "framed-content";

export interface FramedContentElement {
  type: "framed-content";
  children: Descendant[];
  data?: {
    variant: "neutral" | "colored";
  };
}
