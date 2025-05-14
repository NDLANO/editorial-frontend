/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  defaultNormalizer,
  NormalizerConfig,
  parseElementAttributes,
} from "@ndla/editor";
import {
  EXTERNAL_ELEMENT_TYPE,
  EXTERNAL_PLUGIN,
  ExternalPluginOptions,
  IFRAME_ELEMENT_TYPE,
  IFRAME_PLUGIN,
  IframePluginOptions,
} from "./types";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { isExternalElement, isIframeElement } from "./queries";

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

export const externalSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const attributes = parseElementAttributes(Array.from(embed.attributes));
    if (attributes.resource !== EXTERNAL_ELEMENT_TYPE) return;
    return slatejsx("element", { type: attributes.resource, data: attributes }, { text: "" });
  },
  serialize(node) {
    if (!isExternalElement(node)) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const iframeSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const attributes = parseElementAttributes(Array.from(embed.attributes));
    if (attributes.resource !== IFRAME_ELEMENT_TYPE) return;
    return slatejsx("element", { type: attributes.resource, data: attributes }, { text: "" });
  },
  serialize(node) {
    if (!isIframeElement(node)) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const iframePlugin = createPlugin<typeof IFRAME_ELEMENT_TYPE, IframePluginOptions>({
  name: IFRAME_PLUGIN,
  type: IFRAME_ELEMENT_TYPE,
  isVoid: true,
  options: { disableNormalize: false },
  normalize: (editor, node, path, logger, opts) => {
    if (!isIframeElement(node) || opts.disableNormalize) return false;
    return defaultNormalizer(editor, node, path, normalizerConfig, logger);
  },
});

export const externalPlugin = createPlugin<typeof EXTERNAL_ELEMENT_TYPE, ExternalPluginOptions>({
  name: EXTERNAL_PLUGIN,
  type: EXTERNAL_ELEMENT_TYPE,
  isVoid: true,
  options: { disableNormalize: false },
  normalize: (editor, node, path, logger, opts) => {
    if (!isExternalElement(node) || opts.disableNormalize) return false;
    return defaultNormalizer(editor, node, path, normalizerConfig, logger);
  },
});
