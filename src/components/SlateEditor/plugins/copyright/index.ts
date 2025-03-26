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
  PARAGRAPH_ELEMENT_TYPE,
  parseElementAttributes,
} from "@ndla/editor";
import { COPYRIGHT_ELEMENT_TYPE, COPYRIGHT_PLUGIN } from "./types";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import {
  afterOrBeforeTextBlockElement,
  firstTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { isCopyrightElement } from "./queries";

export const copyrightSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== COPYRIGHT_ELEMENT_TYPE) return;
    return slatejsx(
      "element",
      { type: COPYRIGHT_ELEMENT_TYPE, data: { ...embedAttributes, copyright: JSON.parse(embedAttributes.copyright) } },
      children,
    );
  },
  serialize(node, children) {
    if (!isCopyrightElement(node) || !node.data) return;
    // TODO: Create global replace method to handle stringified objects
    const data = createDataAttributes({
      ...node.data,
      copyright: JSON.stringify(node.data.copyright),
    });

    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true, children });
  },
});

const normalizerConfig: NormalizerConfig = {
  nodes: {
    allowed: textBlockElements,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  firstNode: {
    allowed: firstTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  lastNode: {
    allowed: lastTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const copyrightPlugin = createPlugin({
  name: COPYRIGHT_PLUGIN,
  type: COPYRIGHT_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (isCopyrightElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
