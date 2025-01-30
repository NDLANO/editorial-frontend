/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_H5P } from "./types";
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

export const h5pSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== TYPE_H5P) return;
    return slatejsx("element", { type: TYPE_H5P, data: embedAttributes }, { text: "" });
  },
  serialize(node) {
    if (!Element.isElement(node) || node.type !== TYPE_H5P || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
};

export const h5pPlugin = (disableNormalize?: boolean) => (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, isVoid: nextIsVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_H5P) {
      if (!disableNormalize && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element: Element) => {
    return element.type === TYPE_H5P ? true : nextIsVoid(element);
  };

  return editor;
};
