/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Range, Element } from "slate";
import { firstTextBlockElement } from "../../../utils/normalizationHelpers";
import { DEFINITION_LIST_ELEMENT_TYPE } from "../definitionListTypes";
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
    Transforms.setNodes(
      editor,
      { type: DEFINITION_LIST_ELEMENT_TYPE },
      {
        match: (node) => Element.isElement(node) && firstTextBlockElement.includes(node.type),
        at: Editor.unhangRange(editor, editor.selection),
        mode: "lowest",
      },
    );
  }
};
