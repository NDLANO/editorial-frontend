/**
 * Copyright (c) 2020-present, NDLA.
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
  parseElementAttributes,
} from "@ndla/editor";
import { CODE_BLOCK_ELEMENT_TYPE, CODE_BLOCK_PLUGIN } from "./types";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";
import { isCodeBlockElement } from "./queries/codeBlockQueries";

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

export const codeblockSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== "code-block") return;
    return slatejsx("element", { type: CODE_BLOCK_ELEMENT_TYPE, data: embedAttributes, isFirstEdit: false }, [
      { text: "" },
    ]);
  },
  serialize(node) {
    if (!isCodeBlockElement(node)) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true });
  },
});

export const codeblockPlugin = createPlugin({
  name: CODE_BLOCK_PLUGIN,
  type: CODE_BLOCK_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (isCodeBlockElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
