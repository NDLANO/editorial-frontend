/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_EMBED_BRIGHTCOVE } from "./types";
import { createEmbedTagV2, reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
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

export const embedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    if (embedAttributes.resource !== TYPE_EMBED_BRIGHTCOVE) return;
    return slatejsx("element", { type: TYPE_EMBED_BRIGHTCOVE, data: embedAttributes }, { text: "" });
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_EMBED_BRIGHTCOVE || !node.data) return;
    return createEmbedTagV2(node.data);
  },
};

export const videoPlugin = (disableNormalize?: boolean) => (editor: Editor) => {
  const { isVoid: nextIsVoid, normalizeNode: nextNormalizeNode } = editor;

  editor.isVoid = (element: Element) => {
    return element.type === TYPE_EMBED_BRIGHTCOVE ? true : nextIsVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_EMBED_BRIGHTCOVE) {
      if (!disableNormalize && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }

    nextNormalizeNode?.(entry);
  };

  return editor;
};
