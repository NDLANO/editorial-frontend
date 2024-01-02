/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Descendant, Element } from "slate";
import { TYPE_NDLA_EMBED } from "./types";
import { defaultEmbedBlock, isSlateEmbed, isSlateEmbedElement } from "./utils";
import { Embed, ImageEmbed, BrightcoveEmbed, ErrorEmbed, ExternalEmbed } from "../../../../interfaces";
import { createEmbedTag, parseEmbedTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { AudioElement } from "../audio/types";
import { H5pElement } from "../h5p/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface ImageEmbedElement {
  type: "image-embed";
  data: ImageEmbed;
  children: Descendant[];
}

export interface BrightcoveEmbedElement {
  type: "brightcove-embed";
  data: BrightcoveEmbed;
  children: Descendant[];
}

export interface ErrorEmbedElement {
  type: "error-embed";
  data: ErrorEmbed;
  children: Descendant[];
}

export interface ExternalEmbedElement {
  type: "external-embed";
  data: ExternalEmbed;
  children: Descendant[];
}

export type EmbedElements =
  | ImageEmbedElement
  | H5pElement
  | BrightcoveEmbedElement
  | ErrorEmbedElement
  | ExternalEmbedElement
  | AudioElement;

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
  serialize(node: Descendant) {
    if (!Element.isElement(node) || !isSlateEmbed(node)) return;
    return createEmbedTag(node.data);
  },
};

export const embedPlugin = (disableNormalize?: boolean) => (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, isVoid: nextIsVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (isSlateEmbed(node)) {
      if (!disableNormalize && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
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
