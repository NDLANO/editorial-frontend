/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { EmbedData, KeyFigureEmbedData } from "@ndla/types-embed";
import { TYPE_KEY_FIGURE } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface KeyFigureElement {
  type: "key-figure";
  data: KeyFigureEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}

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

export const keyFigureSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes)) as EmbedData;
    if (embedAttributes.resource !== TYPE_KEY_FIGURE) return;
    return slatejsx("element", {
      type: TYPE_KEY_FIGURE,
      data: embedAttributes,
    });
  },
  serialize(node) {
    if (!Element.isElement(node) || node.type !== TYPE_KEY_FIGURE || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
};

export const keyFigurePlugin = (editor: Editor) => {
  const { normalizeNode, isVoid: nextIsVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === TYPE_KEY_FIGURE) {
      if (!defaultBlockNormalizer(editor, node, path, normalizerConfig)) {
        return normalizeNode(entry);
      }
    } else {
      normalizeNode(entry);
    }
  };

  editor.isVoid = (element) => (element.type === TYPE_KEY_FIGURE ? true : nextIsVoid(element));

  return editor;
};
