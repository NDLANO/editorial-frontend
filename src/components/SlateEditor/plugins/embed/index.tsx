/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Descendant, Element } from "slate";
import { TYPE_EMBED_ERROR, TYPE_NDLA_EMBED } from "./types";
import { defaultEmbedBlock, isSlateEmbed, isSlateEmbedElement } from "./utils";
import { Embed, ErrorEmbed } from "../../../../interfaces";
import { createDataAttributes, createHtmlTag, parseEmbedTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { AudioElement } from "../audio/audioTypes";
import { H5pElement } from "../h5p/types";
import { ImageElement } from "../image/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { BrightcoveEmbedElement } from "../video/types";

export interface ErrorEmbedElement {
  type: "error-embed";
  data: ErrorEmbed;
  children: Descendant[];
}

export type EmbedElements = ImageElement | H5pElement | BrightcoveEmbedElement | ErrorEmbedElement | AudioElement;

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
    return defaultEmbedBlock(parseEmbedTag(el.outerHTML) as Embed);
  },
  serialize(node) {
    if (!Element.isElement(node) || node.type !== TYPE_EMBED_ERROR) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data });
  },
};

export const embedPlugin = (disableNormalize?: boolean) => (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, isVoid: nextIsVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    if (isSlateEmbed(node)) {
      if (!disableNormalize && defaultBlockNormalizer(editor, node, path, normalizerConfig)) {
        return;
      }
      return undefined;
    }

    nextNormalizeNode(entry);
  };

  editor.isVoid = (element: Element) => {
    if (isSlateEmbedElement(element)) {
      return true;
    }
    return nextIsVoid(element);
  };

  return editor;
};
