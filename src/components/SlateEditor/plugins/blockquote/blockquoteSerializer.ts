/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { createDataAttributes, createHtmlTag, createSerializer, parseElementAttributes } from "@ndla/editor";
import { BLOCK_QUOTE_ELEMENT_TYPE } from "./blockquoteTypes";
import { isBlockQuoteElement } from "./queries/blockquoteQueries";

export const blockQuoteSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== "blockquote") return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    return slatejsx(
      "element",
      { type: BLOCK_QUOTE_ELEMENT_TYPE, data: Object.keys(embedAttributes).length ? embedAttributes : undefined },
      children,
    );
  },
  serialize(node, children) {
    if (!isBlockQuoteElement(node)) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: "blockquote", data, children });
  },
});
