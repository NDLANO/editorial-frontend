/**
 * Copyright (c) 2023-present, NDLA.
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
import { isLinkBlockListElement } from "./queries";
import { LINK_BLOCK_LIST_ELEMENT_TYPE, LINK_BLOCK_LIST_PLUGIN } from "./types";

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

export const defaultLinkBlockList = () =>
  slatejsx("element", { type: LINK_BLOCK_LIST_ELEMENT_TYPE, data: [], isFirstEdit: true }, { text: "" });

export const linkBlockListSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== "nav" || el.dataset.type !== LINK_BLOCK_LIST_ELEMENT_TYPE) return;

    return slatejsx(
      "element",
      {
        type: LINK_BLOCK_LIST_ELEMENT_TYPE,
        data: Array.from(el.children ?? []).map((el) => parseElementAttributes(Array.from(el.attributes))),
      },
      [{ text: "" }],
    );
  },
  serialize(node) {
    if (!isLinkBlockListElement(node)) return;
    const data = createDataAttributes({ type: LINK_BLOCK_LIST_ELEMENT_TYPE });
    const children = node.data
      ?.map((child) => createHtmlTag({ tag: TYPE_NDLA_EMBED, data: createDataAttributes(child), bailOnEmpty: true }))
      ?.join("");
    return createHtmlTag({ tag: "nav", data, children });
  },
});

export const linkBlockListPlugin = createPlugin({
  name: LINK_BLOCK_LIST_PLUGIN,
  type: LINK_BLOCK_LIST_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (isLinkBlockListElement(node)) {
      return defaultNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
