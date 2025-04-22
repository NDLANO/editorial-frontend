/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { createHtmlTag, createPlugin, createSerializer } from "@ndla/editor";
import { DEFINITION_TERM_ELEMENT_TYPE, DEFINITION_TERM_PLUGIN } from "./definitionListTypes";
import { isDefinitionTermElement } from "./queries/definitionListQueries";

export const definitionTermSerializer = createSerializer({
  deserialize(el, children) {
    const tag = el.tagName.toLowerCase();
    if (tag !== "dt") return;
    return slatejsx("element", { type: DEFINITION_TERM_ELEMENT_TYPE }, children);
  },
  serialize(node, children) {
    if (!isDefinitionTermElement(node)) return;
    return createHtmlTag({ tag: "dt", children });
  },
});

export const definitionTermPlugin = createPlugin({
  name: DEFINITION_TERM_PLUGIN,
  type: DEFINITION_TERM_ELEMENT_TYPE,
});
