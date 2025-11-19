/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range, Element } from "slate";
import { DEFINITION_LIST_ELEMENT_TYPE, DEFINITION_TERM_ELEMENT_TYPE } from "../definitionListTypes";
import {
  isDefinitionDescriptionElement,
  isDefinitionTermElement,
  isDefinitionListElement,
} from "../queries/definitionListQueries";

const isOnlySelectionOfDefinitionList = (editor: Editor) => {
  let hasListItems = false;

  const nodes = editor.nodes({ match: (n) => isDefinitionDescriptionElement(n) || isDefinitionTermElement(n) });
  for (const [, path] of nodes) {
    const [parentNode] = Editor.parent(editor, path);
    if (isDefinitionListElement(parentNode)) {
      hasListItems = true;
      continue;
    }
    return false;
  }
  return hasListItems;
};

// TODO: This doesn't work perfectly when combined with regular lists.
export const toggleDefinitionList = (editor: Editor) => {
  if (!Range.isRange(editor.selection)) {
    return;
  }
  const isSelected = isOnlySelectionOfDefinitionList(editor);

  if (isSelected) {
    Transforms.liftNodes(editor, {
      match: (node) => isDefinitionDescriptionElement(node) || isDefinitionTermElement(node),
      mode: "all",
    });
  } else {
    const nodes = editor.nodes({
      match: (n) => Element.isElement(n) && editor.isBlock(n),
      at: editor.selection,
      mode: "lowest",
    });

    editor.withoutNormalizing(() => {
      if (!editor.selection) return;
      for (const [_, path] of nodes) {
        Transforms.wrapNodes(editor, { type: DEFINITION_TERM_ELEMENT_TYPE, children: [] }, { at: path });
      }

      Transforms.wrapNodes(
        editor,
        { type: DEFINITION_LIST_ELEMENT_TYPE, children: [] },
        { at: editor.selection, match: (n) => isDefinitionTermElement(n) },
      );
    });
  }
};
