/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { TYPE_FRAMED_CONTENT } from "./types";
import { createTag, reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import {
  afterOrBeforeTextBlockElement,
  firstTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from "../../utils/normalizationHelpers";
import { TYPE_COPYRIGHT } from "../copyright/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface FramedContentElement {
  type: "framed-content";
  children: Descendant[];
  data?: {
    variant: "neutral" | "colored";
  };
}

const normalizerConfig: NormalizerConfig = {
  nodes: {
    allowed: textBlockElements.concat(TYPE_COPYRIGHT),
    defaultType: TYPE_PARAGRAPH,
  },
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  firstNode: {
    allowed: firstTextBlockElement.concat(TYPE_COPYRIGHT),
    defaultType: TYPE_PARAGRAPH,
  },
  lastNode: {
    allowed: lastTextBlockElement.concat(TYPE_COPYRIGHT),
    defaultType: TYPE_PARAGRAPH,
  },
};

export const framedContentSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== "div") return;
    if (el.className === "c-bodybox" || el.attributes.getNamedItem("data-type")?.value === "framed-content") {
      const { type: _, class: __, ...embedAttributes } = reduceElementDataAttributesV2(Array.from(el.attributes));
      return slatejsx(
        "element",
        { type: TYPE_FRAMED_CONTENT, data: Object.keys(embedAttributes).length ? embedAttributes : undefined },
        children,
      );
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node) || node.type !== TYPE_FRAMED_CONTENT) return;
    return createTag(
      "div",
      { ...node.data, type: TYPE_FRAMED_CONTENT },
      children,
      { bailOnEmptyData: false },
      undefined,
    );
  },
};

export const framedContentPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_FRAMED_CONTENT) {
      if (!defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return nextNormalizeNode(entry);
      }
    } else {
      nextNormalizeNode(entry);
    }
  };

  return editor;
};
