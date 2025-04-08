/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  parseElementAttributes,
} from "@ndla/editor";
import { isCommentBlockElement } from "./queries/commentBlockQueries";
import { COMMENT_BLOCK_ELEMENT_TYPE, COMMENT_BLOCK_PLUGIN } from "./types";
import { NormalizerConfig, defaultBlockNormalizer } from "../../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../../embed/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

export const commentBlockSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource === "comment" && embedAttributes.type === "block") {
      return slatejsx("element", { type: COMMENT_BLOCK_ELEMENT_TYPE, data: embedAttributes }, [{ text: "" }]);
    }
  },
  serialize(node) {
    if (!isCommentBlockElement(node) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const commentBlockPlugin = createPlugin({
  name: COMMENT_BLOCK_PLUGIN,
  type: COMMENT_BLOCK_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (isCommentBlockElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
