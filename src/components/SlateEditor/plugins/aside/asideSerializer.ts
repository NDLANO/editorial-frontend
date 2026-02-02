/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createDataAttributes, createHtmlTag, createSerializer } from "@ndla/editor";
import { jsx as slatejsx } from "slate-hyperscript";
import { ASIDE_ELEMENT_TYPE } from "./asideTypes";
import { isAsideElement } from "./queries/asideQueries";

export const asideSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== "aside") return;
    return slatejsx("element", { type: ASIDE_ELEMENT_TYPE, data: { type: "factAside" } }, children);
  },
  serialize(node, children) {
    if (!isAsideElement(node)) return;
    const data = createDataAttributes({ type: node.data.type });
    return createHtmlTag({ tag: "aside", data, children });
  },
});
