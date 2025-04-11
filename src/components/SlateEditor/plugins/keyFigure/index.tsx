/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  PARAGRAPH_ELEMENT_TYPE,
  parseElementAttributes,
} from "@ndla/editor";
import { EmbedData } from "@ndla/types-embed";
import { isKeyFigureElement } from "./queries";
import { KEY_FIGURE_ELEMENT_TYPE, KEY_FIGURE_PLUGIN } from "./types";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";

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

export const keyFigureSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes)) as EmbedData;
    if (embedAttributes.resource !== KEY_FIGURE_ELEMENT_TYPE) return;
    return slatejsx("element", {
      type: KEY_FIGURE_ELEMENT_TYPE,
      data: embedAttributes,
    });
  },
  serialize(node) {
    if (!isKeyFigureElement(node) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const keyFigurePlugin = createPlugin({
  name: KEY_FIGURE_PLUGIN,
  type: KEY_FIGURE_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (isKeyFigureElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
