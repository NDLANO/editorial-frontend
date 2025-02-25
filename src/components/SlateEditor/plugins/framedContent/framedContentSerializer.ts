/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { createDataAttributes, createHtmlTag, createSerializer, parseElementAttributes } from "@ndla/editor";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "./framedContentTypes";
import { isFramedContentElement } from "./queries/framedContentQueries";

export const framedContentSerializer = createSerializer({
  deserialize: (el, children) => {
    if (el.tagName.toLowerCase() !== "div") return;
    if (el.className === "c-bodybox" || el.attributes.getNamedItem("data-type")?.value === "framed-content") {
      const { type: _, class: __, ...embedAttributes } = parseElementAttributes(Array.from(el.attributes));
      return slatejsx(
        "element",
        { type: FRAMED_CONTENT_ELEMENT_TYPE, data: Object.keys(embedAttributes).length ? embedAttributes : undefined },
        children,
      );
    }
  },
  serialize: (node, children) => {
    if (!isFramedContentElement(node)) return;
    const data = createDataAttributes({ ...node.data, type: FRAMED_CONTENT_ELEMENT_TYPE });
    return createHtmlTag({ tag: "div", data, children });
  },
});
