/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSerializer } from "@ndla/editor";
import { isUnsupportedElement } from "./queries";
import { REPLACE_UNSUPPORTED_CONTENT_CHILDREN } from "./utils";

export const unsupportedElementSerializer = createSerializer({
  deserialize() {
    return undefined;
  },
  serialize(node, children) {
    if (isUnsupportedElement(node) && node.data.serializedOriginalElement?.length) {
      return node.data.serializedOriginalElement.replace(REPLACE_UNSUPPORTED_CONTENT_CHILDREN, children ?? "");
    }
  },
});
