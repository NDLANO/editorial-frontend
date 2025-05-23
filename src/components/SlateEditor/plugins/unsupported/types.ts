/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Element } from "slate";

export const UNSUPPORTED_ELEMENT_TYPE = "unsupported" as const;
export const UNSUPPORTED_PLUGIN = "unsupported" as const;

export interface UnsupportedElement {
  type: typeof UNSUPPORTED_ELEMENT_TYPE;
  data: {
    originalElement: Element;
    serializedOriginalElement: string | undefined;
  };
  children: Descendant[];
}
