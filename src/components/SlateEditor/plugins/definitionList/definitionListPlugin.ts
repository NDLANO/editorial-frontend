/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createHtmlTag, createPlugin, createSerializer, defaultNormalizer, NormalizerConfig } from "@ndla/editor";
import { isKeyHotkey } from "is-hotkey";
import { Editor, Node, Path, Range, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_LIST_PLUGIN,
  DEFINITION_TERM_ELEMENT_TYPE,
  DefinitionListType,
} from "./definitionListTypes";
import { onTab } from "./handlers/onTab";
import {
  isDefinitionDescriptionElement,
  isDefinitionListElement,
  isDefinitionTermElement,
} from "./queries/definitionListQueries";

const normalizerConfig: NormalizerConfig = {
  firstNode: {
    allowed: [DEFINITION_TERM_ELEMENT_TYPE],
    defaultType: DEFINITION_TERM_ELEMENT_TYPE,
  },
  nodes: {
    allowed: [DEFINITION_TERM_ELEMENT_TYPE, DEFINITION_DESCRIPTION_ELEMENT_TYPE],
    defaultType: DEFINITION_TERM_ELEMENT_TYPE,
  },
};
export const definitionListSerializer = createSerializer({
  deserialize(el, children) {
    const tag = el.tagName.toLowerCase();
    if (tag !== "dl") return;
    return slatejsx("element", { type: DEFINITION_LIST_ELEMENT_TYPE }, children);
  },
  serialize(node, children) {
    if (!isDefinitionListElement(node)) return;
    return createHtmlTag({ tag: "dl", children });
  },
});

export const definitionListPlugin = createPlugin<DefinitionListType>({
  name: DEFINITION_LIST_PLUGIN,
  type: DEFINITION_LIST_ELEMENT_TYPE,
  shortcuts: {
    dentList: { keyCondition: isKeyHotkey("shift?+tab"), handler: onTab },
  },
  normalize: (editor, node, path, logger) => {
    if (!isDefinitionListElement(node)) return false;
    if (Path.hasPrevious(path)) {
      const previousPath = Path.previous(path);
      if (Editor.hasPath(editor, previousPath)) {
        const [prevNode] = Editor.node(editor, previousPath);
        if (isDefinitionListElement(prevNode)) {
          logger.log("Current node and previous node is definition list, merging.");
          Transforms.mergeNodes(editor, { at: path });
          return true;
        }
      }
    }
    return defaultNormalizer(editor, node, path, normalizerConfig, logger);
  },
  transform: (editor, logger) => {
    const { insertBreak } = editor;

    editor.insertBreak = () => {
      if (!editor.selection || Range.isExpanded(editor.selection)) return insertBreak();
      const [parentNode, parentPath] = editor.parent(editor.selection);

      if (!isDefinitionTermElement(parentNode) && !isDefinitionDescriptionElement(parentNode)) return insertBreak();
      if (Node.string(parentNode) !== "" || editor.hasVoids(parentNode)) return insertBreak();

      if (parentNode.type === DEFINITION_DESCRIPTION_ELEMENT_TYPE) {
        logger.log("Tried to enter on empty definition description, converting it to term.");
        Transforms.setNodes(editor, { type: DEFINITION_TERM_ELEMENT_TYPE }, { at: parentPath });
      } else {
        logger.log("Tried to enter on empty definition term, splitting list and inserting paragraph");
        editor.withoutNormalizing(() => {
          Transforms.unwrapNodes(editor, { at: parentPath });
          Transforms.liftNodes(editor, { at: parentPath });
        });
      }
    };
    return editor;
  },
});
