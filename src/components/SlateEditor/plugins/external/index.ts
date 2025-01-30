/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_EXTERNAL, TYPE_IFRAME } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

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

export const externalSerializer: SlateSerializer = {
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource === TYPE_EXTERNAL || embedAttributes.resource === TYPE_IFRAME) {
      return slatejsx("element", { type: embedAttributes.resource, data: embedAttributes }, { text: "" });
    }
  },
  serialize(node) {
    if (Element.isElement(node) && (node.type === TYPE_EXTERNAL || node.type === TYPE_IFRAME) && node.data) {
      const data = createDataAttributes(node.data);
      return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
    }
  },
};

export const externalPlugin = (disableNormalize?: boolean) => (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, isVoid: nextIsVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && (node.type === TYPE_EXTERNAL || node.type === TYPE_IFRAME)) {
      if (!disableNormalize && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element) => {
    return element.type === TYPE_EXTERNAL || element.type === TYPE_IFRAME ? true : nextIsVoid(element);
  };
  return editor;
};
