/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_DISCLAIMER } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement, firstTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export const disclaimerSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== TYPE_DISCLAIMER) return;
    return slatejsx("element", { type: TYPE_DISCLAIMER, data: embedAttributes }, children);
  },
  serialize(node, children) {
    if (!Element.isElement(node) || node.type !== TYPE_DISCLAIMER || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, children, bailOnEmpty: true });
  },
};

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  firstNode: {
    allowed: firstTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

export const disclaimerPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_DISCLAIMER) {
      if (!defaultBlockNormalizer(editor, node, path, normalizerConfig)) {
        return nextNormalizeNode(entry);
      }
    } else {
      nextNormalizeNode(entry);
    }
  };

  return editor;
};
