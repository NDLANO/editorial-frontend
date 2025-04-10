/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { Descendant, Element } from "slate";
import { createHtmlTag, createPlugin, createSerializer } from "@ndla/editor";
import {
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
  DEFINITION_TERM_PLUGIN,
} from "./definitionListTypes";
import { isDefinitionTerm } from "./queries/definitionListQueries";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";

const normalizeDTConfig: NormalizerConfig = {
  parent: {
    allowed: [DEFINITION_LIST_ELEMENT_TYPE],
  },
};

export const definitionTermSerializer = createSerializer({
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === "dt") {
      return slatejsx("element", { type: DEFINITION_TERM_ELEMENT_TYPE }, children);
    }
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type === DEFINITION_TERM_ELEMENT_TYPE) {
      return createHtmlTag({ tag: "dt", children });
    }
  },
});

export const definitionTermPlugin = createPlugin({
  name: DEFINITION_TERM_PLUGIN,
  type: DEFINITION_TERM_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (isDefinitionTerm(node)) {
      if (defaultBlockNormalizer(editor, node, path, normalizeDTConfig, logger)) {
        return true;
      }
    }
    return false;
  },
});
