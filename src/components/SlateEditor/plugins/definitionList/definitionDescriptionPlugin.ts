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
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_DESCRIPTION_PLUGIN,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
  DefinitionDescriptionType,
} from "./definitionListTypes";
import { isDefinitionDescription } from "./queries/definitionListQueries";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";

const normalizerDDConfig: NormalizerConfig = {
  parent: {
    allowed: [DEFINITION_LIST_ELEMENT_TYPE],
  },
  previous: {
    allowed: [DEFINITION_TERM_ELEMENT_TYPE, DEFINITION_DESCRIPTION_ELEMENT_TYPE],
    defaultType: DEFINITION_TERM_ELEMENT_TYPE,
  },
};

export const definitionDescriptionSerializer = createSerializer({
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === "dd") {
      return slatejsx("element", { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE }, children);
    }
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type === DEFINITION_DESCRIPTION_ELEMENT_TYPE) {
      return createHtmlTag({ tag: "dd", children });
    }
  },
});

export const definitionDescriptionPlugin = createPlugin<DefinitionDescriptionType>({
  name: DEFINITION_DESCRIPTION_PLUGIN,
  type: DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (isDefinitionDescription(node)) {
      if (defaultBlockNormalizer(editor, node, path, normalizerDDConfig, logger)) {
        return true;
      }
    }
    return false;
  },
});
