/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createDataAttributes, createHtmlTag, createSerializer, parseElementAttributes } from "@ndla/editor";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { SYMBOL_ELEMENT_TYPE } from "./types";
import { jsx as slatejsx } from "slate-hyperscript";
import { isSymbolElement } from "./queries";

export const symbolSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const attributes = parseElementAttributes(Array.from(el.attributes));
    if (attributes.type !== SYMBOL_ELEMENT_TYPE) return;
    return slatejsx("element", { type: SYMBOL_ELEMENT_TYPE, symbol: attributes.symbol }, children);
  },
  serialize(node, children) {
    if (!isSymbolElement(node)) return;
    if (!node.symbol) return children;
    const data = createDataAttributes({ type: SYMBOL_ELEMENT_TYPE, symbol: node.symbol });
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, children });
  },
});
