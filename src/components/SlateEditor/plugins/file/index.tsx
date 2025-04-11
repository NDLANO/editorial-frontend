/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  PARAGRAPH_ELEMENT_TYPE,
} from "@ndla/editor";
import { isFileElement } from "./queries";
import { FILE_ELEMENT_TYPE, FILE_PLUGIN } from "./types";
import { defaultFileBlock } from "./utils";
import { File } from "../../../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";

export interface FileElement {
  type: "file";
  data: File[];
  children: Descendant[];
}

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

export const fileSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== "div") return;
    if (el.dataset.type !== FILE_ELEMENT_TYPE) return;

    const children: DOMStringMap[] = [];
    el.childNodes.forEach((node) => {
      children.push((node as HTMLEmbedElement).dataset);
    });
    return defaultFileBlock(children);
  },
  serialize(node) {
    if (!isFileElement(node)) return;
    const children = node.data
      .map(({ formats: _, ...file }) => {
        const data = createDataAttributes(file);
        return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
      })
      .join("");
    return createHtmlTag({ tag: "div", data: { "data-type": FILE_ELEMENT_TYPE }, children });
  },
});

export const filePlugin = createPlugin({
  name: FILE_PLUGIN,
  type: FILE_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (isFileElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
