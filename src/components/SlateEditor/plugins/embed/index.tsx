/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Descendant } from "slate";
import { TYPE_NDLA_EMBED } from "./types";
import { defaultEmbedBlock, isSlateEmbed } from "./utils";
import { Embed, ErrorEmbed } from "../../../../interfaces";
import { parseEmbedTag } from "../../../../util/embedTagHelpers";
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
  serialize() {
    return undefined;
  },
};

export const embedPlugin = (disableNormalize?: boolean) => (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode } = editor;

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

  return editor;
};
