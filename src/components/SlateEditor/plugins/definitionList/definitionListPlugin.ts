/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isKeyHotkey } from "is-hotkey";
import { Editor, Descendant, Element, Path, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { createHtmlTag, createPlugin, createSerializer } from "@ndla/editor";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_LIST_PLUGIN,
  DEFINITION_TERM_ELEMENT_TYPE,
  DefinitionListType,
} from "./definitionListTypes";
import { onBackspace } from "./handlers/onBackspace";
import { onEnter } from "./handlers/onEnter";
import { onTab } from "./handlers/onTab";
import { isDefinitionList } from "./queries/definitionListQueries";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";

const normalizerDLConfig: NormalizerConfig = {
  nodes: {
    allowed: [DEFINITION_TERM_ELEMENT_TYPE, DEFINITION_DESCRIPTION_ELEMENT_TYPE],
    defaultType: DEFINITION_TERM_ELEMENT_TYPE,
  },
};
export const definitionListSerializer = createSerializer({
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === "dl") {
      return slatejsx("element", { type: DEFINITION_LIST_ELEMENT_TYPE }, children);
    }
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type === DEFINITION_LIST_ELEMENT_TYPE) {
      return createHtmlTag({ tag: "dl", children });
    }
  },
});

export const definitionListPlugin = createPlugin<DefinitionListType>({
  name: DEFINITION_LIST_PLUGIN,
  type: DEFINITION_LIST_ELEMENT_TYPE,
  shortcuts: {
    dentList: { keyCondition: isKeyHotkey("shift?+tab"), handler: onTab },
    listItemInsertion: { keyCondition: isKeyHotkey("enter"), handler: onEnter },
    listItemDeletion: { keyCondition: isKeyHotkey("backspace"), handler: onBackspace },
  },
  normalize: (editor, node, path, logger) => {
    if (isDefinitionList(node)) {
      if (Path.hasPrevious(path)) {
        const previousPath = Path.previous(path);
        if (Editor.hasPath(editor, previousPath)) {
          const [prevNode] = Editor.node(editor, previousPath);
          if (isDefinitionList(prevNode)) {
            logger.log("Current node and previous node is definition list, merging.");
            Transforms.mergeNodes(editor, {
              at: path,
            });
            return true;
          }
        }
      }

      if (defaultBlockNormalizer(editor, node, path, normalizerDLConfig)) {
        return true;
      }
    }
    return false;
  },
});
