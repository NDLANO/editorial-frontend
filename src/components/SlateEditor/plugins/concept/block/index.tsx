/**
 * Copyright (c) 2022-present, NDLA.
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
import { afterOrBeforeTextBlockElement } from "../../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../../embed/types";
import { isConceptBlockElement } from "./queries";
import { CONCEPT_BLOCK_ELEMENT_TYPE, CONCEPT_BLOCK_PLUGIN } from "./types";

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

export const blockConceptSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embedAttributes = parseElementAttributes(Array.from(el.attributes));
    if (embedAttributes.resource === "concept" && embedAttributes.type === "block") {
      return slatejsx(
        "element",
        {
          type: CONCEPT_BLOCK_ELEMENT_TYPE,
          data: embedAttributes,
        },
        { text: "" },
      );
    }
  },
  serialize(node) {
    if (!isConceptBlockElement(node)) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const blockConceptPlugin = createPlugin({
  name: CONCEPT_BLOCK_PLUGIN,
  type: CONCEPT_BLOCK_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (!isConceptBlockElement(node)) return false;
    return defaultNormalizer(editor, node, path, normalizerConfig, logger);
  },
});
