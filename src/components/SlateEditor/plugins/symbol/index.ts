/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  createPlugin,
  defaultNormalizer,
  HEADING_ELEMENT_TYPE,
  NOOP_ELEMENT_TYPE,
  PARAGRAPH_ELEMENT_TYPE,
} from "@ndla/editor";
import { Transforms } from "slate";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionList/definitionListTypes";
import { SUMMARY_ELEMENT_TYPE } from "../details/summaryTypes";
import { SPAN_ELEMENT_TYPE } from "../span/types";
import { isSymbolElement } from "./queries";
import { SYMBOL_ELEMENT_TYPE, SYMBOL_PLUGIN, SymbolPluginOptions } from "./types";

export const symbolPlugin = createPlugin<typeof SYMBOL_ELEMENT_TYPE, SymbolPluginOptions>({
  name: SYMBOL_PLUGIN,
  type: SYMBOL_ELEMENT_TYPE,
  isInline: true,
  isVoid: true,
  options: {
    allowedParents: [
      HEADING_ELEMENT_TYPE,
      PARAGRAPH_ELEMENT_TYPE,
      SUMMARY_ELEMENT_TYPE,
      DEFINITION_DESCRIPTION_ELEMENT_TYPE,
      DEFINITION_TERM_ELEMENT_TYPE,
      SPAN_ELEMENT_TYPE,
      NOOP_ELEMENT_TYPE,
    ],
  },
  normalize(editor, node, path, logger, options) {
    if (!isSymbolElement(node)) return false;
    if (node.isFirstEdit || node.symbol)
      return defaultNormalizer(editor, node, path, { parent: { allowed: options.allowedParents } }, logger);

    logger.log("Removing empty symbol");
    Transforms.removeNodes(editor, { at: path, voids: true });
    return true;
  },
});
