/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { toUnicode } from "punycode";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  PARAGRAPH_ELEMENT_TYPE,
  parseElementAttributes,
} from "@ndla/editor";
import { isRelatedElement } from "./queries";
import { RELATED_ELEMENT_TYPE, RELATED_PLUGIN } from "./types";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";

export const defaultRelatedBlock = () => slatejsx("element", { type: RELATED_ELEMENT_TYPE, data: [] }, [{ text: "" }]);

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

export const relatedSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== "div") return;
    const { type } = el.dataset;
    if (type !== "related-content") return;

    return slatejsx(
      "element",
      {
        type: RELATED_ELEMENT_TYPE,
        data: Array.from(el.children ?? []).map((el) => {
          const attributes = parseElementAttributes(Array.from(el.attributes));
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
  serialize(node) {
    if (!isRelatedElement(node)) return;

    const children = node.data
      .map((child) => {
        const data = createDataAttributes(child);
        return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
      })
      .filter((n) => !!n)
      .join("");

    return createHtmlTag({ tag: "div", data: { "data-type": "related-content" }, children, bailOnEmpty: false });
  },
});

export const relatedPlugin = createPlugin({
  name: RELATED_PLUGIN,
  type: RELATED_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (isRelatedElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
