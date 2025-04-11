/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { createPlugin, createSerializer } from "@ndla/editor";
import { isFootnoteElement } from "./queries";
import { FOOTNOTE_ELEMENT_TYPE, FOOTNOTE_PLUGIN } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";

export const footnoteSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== "footnote") return;
    return slatejsx(
      "element",
      {
        type: FOOTNOTE_ELEMENT_TYPE,
        data: {
          ...embedAttributes,
          authors: embedAttributes.authors ? embedAttributes.authors.split(";") : [],
        },
      },
      [{ text: "[#]" }],
    );
  },
  serialize(node: Descendant) {
    if (!isFootnoteElement(node)) return;
    const data = createDataAttributes({
      ...node.data,
      authors: node.data.authors ? node.data.authors.join(";") : "",
    });

    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const footnotePlugin = createPlugin({
  name: FOOTNOTE_PLUGIN,
  type: FOOTNOTE_ELEMENT_TYPE,
  isInline: true,
  isVoid: true,
});
