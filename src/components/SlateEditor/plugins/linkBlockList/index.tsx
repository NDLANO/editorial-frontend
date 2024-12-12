/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_LINK_BLOCK_LIST } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
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

export const defaultLinkBlockList = () =>
  slatejsx("element", { type: TYPE_LINK_BLOCK_LIST, data: [], isFirstEdit: true }, { text: "" });

export const linkBlockListSerializer: SlateSerializer = {
  deserialize(el) {
    if (el.tagName.toLowerCase() !== "nav" || el.dataset.type !== TYPE_LINK_BLOCK_LIST) return;

    return slatejsx(
      "element",
      {
        type: TYPE_LINK_BLOCK_LIST,
        data: Array.from(el.children ?? []).map((el) => parseElementAttributes(Array.from(el.attributes))),
      },
      [{ text: "" }],
    );
  },
  serialize(node) {
    if (!Element.isElement(node) || node.type !== TYPE_LINK_BLOCK_LIST) return;
    const data = createDataAttributes({ type: TYPE_LINK_BLOCK_LIST });
    const children = node.data
      ?.map((child) => createHtmlTag({ tag: TYPE_NDLA_EMBED, data: createDataAttributes(child), bailOnEmpty: true }))
      ?.join("");
    return createHtmlTag({ tag: "nav", data, children });
  },
};

export const linkBlockListPlugin = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (element.type === TYPE_LINK_BLOCK_LIST) {
      return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_LINK_BLOCK_LIST) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    normalizeNode(entry);
  };

  return editor;
};
