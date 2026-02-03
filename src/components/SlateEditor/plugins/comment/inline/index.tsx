/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  parseElementAttributes,
} from "@ndla/editor";
import { Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_NDLA_EMBED } from "../../embed/types";
import { isCommentInlineElement } from "./queries/commentInlineQueries";
import { COMMENT_INLINE_ELEMENT_TYPE, COMMENT_INLINE_PLUGIN } from "./types";

export const commentInlineSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource === "comment" && embedAttributes.type === "inline") {
      return slatejsx(
        "element",
        {
          type: COMMENT_INLINE_ELEMENT_TYPE,
          data: embedAttributes,
        },
        children,
      );
    }
  },
  serialize(node, children) {
    if (!isCommentInlineElement(node) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true, children });
  },
});

export const commentInlinePlugin = createPlugin({
  name: COMMENT_INLINE_PLUGIN,
  type: COMMENT_INLINE_ELEMENT_TYPE,
  isInline: true,
  normalize: (editor, node, path, logger) => {
    if (isCommentInlineElement(node) && Node.string(node) === "") {
      logger.log("Inline comment is empty, removing it");
      Transforms.removeNodes(editor, { at: path });
      return true;
    }
    return false;
  },
});
