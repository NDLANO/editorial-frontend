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
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const attributes = parseElementAttributes(Array.from(el.attributes));
    if (attributes.resource !== SYMBOL_ELEMENT_TYPE) return;

    if (!el.hasChildNodes()) return;
    const symbol = el.firstChild?.textContent;
    if (!symbol) return;

    return slatejsx("element", { type: SYMBOL_ELEMENT_TYPE, symbol });
  },
  serialize(node) {
    if (!isSymbolElement(node) || !node.symbol) return;
    const data = createDataAttributes({ resource: SYMBOL_ELEMENT_TYPE });
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, children: node.symbol });
  },
});
