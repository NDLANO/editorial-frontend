/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { createDataAttributes, createHtmlTag, SlateSerializer } from "@ndla/editor";
import { ASIDE_ELEMENT_TYPE } from "./asideTypes";
import { isAsideElement } from "./queries/asideQueries";

export const asideSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== "aside") return;
    return slatejsx("element", { type: ASIDE_ELEMENT_TYPE, data: { type: "factAside" } }, children);
  },
  serialize(node, children) {
    if (!isAsideElement(node)) return;
    const data = createDataAttributes({ type: node.data.type });
    return createHtmlTag({ tag: "aside", data, children });
  },
};
