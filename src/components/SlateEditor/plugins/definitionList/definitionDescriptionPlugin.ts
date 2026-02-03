/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createHtmlTag, createPlugin, createSerializer, defaultNormalizer, NormalizerConfig } from "@ndla/editor";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_DESCRIPTION_PLUGIN,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
  DefinitionDescriptionType,
} from "./definitionListTypes";
import { isDefinitionDescriptionElement } from "./queries/definitionListQueries";

const normalizerConfig: NormalizerConfig = {
  parent: {
    allowed: [DEFINITION_LIST_ELEMENT_TYPE],
  },
  previous: {
    allowed: [DEFINITION_TERM_ELEMENT_TYPE, DEFINITION_DESCRIPTION_ELEMENT_TYPE],
    defaultType: DEFINITION_TERM_ELEMENT_TYPE,
  },
};

export const definitionDescriptionSerializer = createSerializer({
  deserialize(el, children) {
    const tag = el.tagName.toLowerCase();
    if (tag !== "dd") return;
    return slatejsx("element", { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE }, children);
  },
  serialize(node, children) {
    if (!isDefinitionDescriptionElement(node)) return;
    return createHtmlTag({ tag: "dd", children });
  },
});

export const definitionDescriptionPlugin = createPlugin<DefinitionDescriptionType>({
  name: DEFINITION_DESCRIPTION_PLUGIN,
  type: DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  normalize: (editor, node, path, logger) => {
    if (!isDefinitionDescriptionElement(node)) return false;
    return defaultNormalizer(editor, node, path, normalizerConfig, logger);
  },
});
