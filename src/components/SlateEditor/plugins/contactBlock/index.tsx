/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ContactBlockEmbedData } from "@ndla/types-embed";
import { TYPE_CONTACT_BLOCK } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface ContactBlockElement {
  type: "contact-block";
  data?: ContactBlockEmbedData;
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

export const contactBlockSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== TYPE_CONTACT_BLOCK) return;
    return slatejsx("element", { type: TYPE_CONTACT_BLOCK, data: embedAttributes }, { text: "" });
  },
  serialize(node) {
    if (!Element.isElement(node) || node.type !== TYPE_CONTACT_BLOCK || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
};

export const contactBlockPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, isVoid: nextIsVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === TYPE_CONTACT_BLOCK) {
      if (defaultBlockNormalizer(editor, node, path, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element) => (element.type === TYPE_CONTACT_BLOCK ? true : nextIsVoid(element));

  return editor;
};
