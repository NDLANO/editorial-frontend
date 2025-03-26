/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { createHtmlTag, createSerializer } from "@ndla/editor";
import { DETAILS_ELEMENT_TYPE } from "./detailsTypes";
import { isDetailsElement } from "./queries/detailsQueries";

export const detailsSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "details") return;
    return slatejsx("element", { type: DETAILS_ELEMENT_TYPE }, children);
  },
  serialize: (node, children) => {
    if (!isDetailsElement(node)) return;
    return createHtmlTag({ tag: DETAILS_ELEMENT_TYPE, children });
  },
});
