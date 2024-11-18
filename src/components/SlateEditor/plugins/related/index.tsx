/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toUnicode } from "punycode";
import { Descendant, Editor, Element } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { RelatedContentEmbedData } from "@ndla/types-embed";
import { TYPE_RELATED } from "./types";
import { reduceElementDataAttributesV2, createEmbedTagV2 } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export const defaultRelatedBlock = () => slatejsx("element", { type: TYPE_RELATED, data: [] }, [{ text: "" }]);

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

export interface RelatedElement {
  type: "related";
  data: RelatedContentEmbedData[];
  children: Descendant[];
}

export const relatedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== "div") return;
    const { type } = el.dataset;
    if (type !== "related-content") return;

    return slatejsx(
      "element",
      {
        type: TYPE_RELATED,
        data: Array.from(el.children ?? []).map((el) => {
          const attributes = reduceElementDataAttributesV2(Array.from(el.attributes));
          if (attributes["url"]) {
            return {
              ...attributes,
              urlDomain: toUnicode(new URL(attributes["url"]).hostname),
            };
          }
          return attributes;
        }),
      },
      [{ text: "" }],
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_RELATED) return;

    return <div data-type="related-content">{node.data.map((child) => createEmbedTagV2(child))}</div>;
  },
};

export const relatedPlugin = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (element.type === "related") {
      return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_RELATED) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    normalizeNode(entry);
  };

  return editor;
};
