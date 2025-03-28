/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { createPlugin, createSerializer, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { isH5pElement } from "./queries";
import { H5P_ELEMENT_TYPE, H5P_PLUGIN, H5pPluginOptions } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { NormalizerConfig, defaultBlockNormalizer } from "../../utils/defaultNormalizer";
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

export const h5pSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== H5P_ELEMENT_TYPE) return;
    return slatejsx("element", { type: H5P_ELEMENT_TYPE, data: embedAttributes }, { text: "" });
  },
  serialize(node) {
    if (!isH5pElement(node) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const h5pPlugin = createPlugin<"h5p", H5pPluginOptions>({
  name: H5P_PLUGIN,
  type: H5P_ELEMENT_TYPE,
  isVoid: true,
  options: {
    disableNormalize: false,
  },
  normalize: (editor, node, path, logger, options) => {
    if (isH5pElement(node) && !options.disableNormalize) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
