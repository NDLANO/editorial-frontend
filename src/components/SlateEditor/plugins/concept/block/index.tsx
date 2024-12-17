/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_CONCEPT_BLOCK } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../../embed/types";
import { TYPE_PARAGRAPH } from "../../paragraph/types";

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

export const blockConceptSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embedAttributes = parseElementAttributes(Array.from(el.attributes));
    if (embedAttributes.resource === "concept" && embedAttributes.type === "block") {
      return slatejsx(
        "element",
        {
          type: TYPE_CONCEPT_BLOCK,
          data: embedAttributes,
        },
        { text: "" },
      );
    }
  },
  serialize(node) {
    if (!Element.isElement(node) || node.type !== TYPE_CONCEPT_BLOCK) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
};

export const blockConceptPlugin = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_CONCEPT_BLOCK) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    normalizeNode(entry);
  };

  editor.isVoid = (element) => {
    if (element.type === TYPE_CONCEPT_BLOCK) {
      return true;
    }
    return isVoid(element);
  };

  return editor;
};
