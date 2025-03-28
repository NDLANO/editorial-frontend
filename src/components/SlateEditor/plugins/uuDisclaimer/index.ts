/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { DISCLAIMER_ELEMENT_TYPE, DISCLAIMER_PLUGIN } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement, firstTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { createPlugin, createSerializer, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { isDisclaimerElement } from "./queries";

export const disclaimerSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== DISCLAIMER_ELEMENT_TYPE) return;
    return slatejsx("element", { type: DISCLAIMER_ELEMENT_TYPE, data: embedAttributes }, children);
  },
  serialize(node, children) {
    if (!isDisclaimerElement(node) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, children, bailOnEmpty: true });
  },
});

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  firstNode: {
    allowed: firstTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const disclaimerPlugin = createPlugin({
  name: DISCLAIMER_PLUGIN,
  type: DISCLAIMER_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (isDisclaimerElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
