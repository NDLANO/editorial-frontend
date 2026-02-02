/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  defaultNormalizer,
  NormalizerConfig,
  PARAGRAPH_ELEMENT_TYPE,
  parseElementAttributes,
} from "@ndla/editor";
import { jsx as slatejsx } from "slate-hyperscript";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { isImageElement } from "./queries";
import { IMAGE_ELEMENT_TYPE, IMAGE_PLUGIN, ImagePluginOptions } from "./types";

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const imageSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== IMAGE_ELEMENT_TYPE) return;
    return slatejsx("element", { type: IMAGE_ELEMENT_TYPE, data: embedAttributes }, { text: "" });
  },
  serialize(node) {
    if (!isImageElement(node) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const imagePlugin = createPlugin<typeof IMAGE_ELEMENT_TYPE, ImagePluginOptions>({
  name: IMAGE_PLUGIN,
  type: IMAGE_ELEMENT_TYPE,
  isVoid: true,
  options: {
    disableNormalization: false,
  },
  normalize: (editor, node, path, logger, options) => {
    if (isImageElement(node) && !options.disableNormalization) {
      return defaultNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
  transform: (editor) => {
    const { isDragDisabled } = editor;
    editor.isDragDisabled = (element) => {
      if (isImageElement(element)) {
        return !!element.data?.align && ["left", "right"].includes(element.data.align);
      }
      return isDragDisabled?.(element);
    };
    return editor;
  },
});
