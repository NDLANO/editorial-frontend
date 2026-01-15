/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Node } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { createHtmlTag, createSerializer, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { SPAN_ELEMENT_TYPE } from "../span/types";
import { isSummaryElement } from "./queries/detailsQueries";
import { SUMMARY_ELEMENT_TYPE } from "./summaryTypes";

export const summarySerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "summary") return;
    const wrappedChildren =
      !Node.isElement(children?.[0]) || children?.[0].type === SPAN_ELEMENT_TYPE
        ? slatejsx("element", { type: PARAGRAPH_ELEMENT_TYPE, serializeAsText: true }, children)
        : children;
    return slatejsx("element", { type: SUMMARY_ELEMENT_TYPE }, wrappedChildren);
  },
  serialize: (node, children) => {
    if (!isSummaryElement(node)) return;
    return createHtmlTag({ tag: SUMMARY_ELEMENT_TYPE, children });
  },
});
