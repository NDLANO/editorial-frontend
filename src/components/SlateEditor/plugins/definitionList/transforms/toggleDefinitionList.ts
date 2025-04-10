/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range, Element } from "slate";
import { firstTextBlockElement } from "../../../utils/normalizationHelpers";
import { isDefinitionDescription, isDefinitionList, isDefinitionTerm } from "../queries/definitionListQueries";
import { DEFINITION_LIST_ELEMENT_TYPE } from "../definitionListTypes";

const isOnlySelectionOfDefinitionList = (editor: Editor) => {
  let hasListItems = false;

  for (const [, path] of Editor.nodes(editor, {
    match: (node) => isDefinitionDescription(node) || isDefinitionTerm(node),
  })) {
    const [parentNode] = Editor.parent(editor, path);
    if (isDefinitionList(parentNode)) {
      hasListItems = true;
      continue;
    }
    return false;
  }
  return hasListItems;
};

export const toggleDefinitionList = (editor: Editor) => {
  if (!Range.isRange(editor.selection)) {
    return;
  }
  const isSelected = isOnlySelectionOfDefinitionList(editor);

  if (isSelected) {
    return Transforms.liftNodes(editor, {
      match: (node) => isDefinitionDescription(node) || isDefinitionTerm(node),
      mode: "all",
    });
  } else {
    Editor.withoutNormalizing(editor, () => {
      // The withoutNormalizing function is within its own scope and the selection check above does then not follow
      if (!Range.isRange(editor.selection)) {
        return;
      }

      Transforms.setNodes(
        editor,
        { type: DEFINITION_LIST_ELEMENT_TYPE },
        {
          match: (node) => Element.isElement(node) && firstTextBlockElement.includes(node.type),
          at: Editor.unhangRange(editor, editor.selection),
          mode: "lowest",
        },
      );
    });
  }
};
