/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, NodeEntry, Transforms } from "slate";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_TERM } from "../types";

const onTab = (event: KeyboardEvent, editor: Editor, entry: NodeEntry) => {
  if (!editor.selection) {
    return false;
  }
  event.preventDefault();

  const [selectedDefinitionItem, selectedDefinitionItemPath] = entry;

  if (
    Element.isElement(selectedDefinitionItem) &&
    (selectedDefinitionItem.type === TYPE_DEFINITION_DESCRIPTION ||
      selectedDefinitionItem.type === TYPE_DEFINITION_TERM)
  ) {
    Editor.withoutNormalizing(editor, () => {
      if (event.shiftKey && selectedDefinitionItem.type === TYPE_DEFINITION_DESCRIPTION) {
        Transforms.setNodes(
          editor,
          {
            type: TYPE_DEFINITION_TERM,
            children: selectedDefinitionItem.children,
          },
          { at: selectedDefinitionItemPath },
        );
      } else if (selectedDefinitionItem.type === TYPE_DEFINITION_TERM) {
        Transforms.setNodes(
          editor,
          {
            type: TYPE_DEFINITION_DESCRIPTION,
            children: selectedDefinitionItem.children,
          },
          { at: selectedDefinitionItemPath },
        );
      }
    });
    return true;
  }
  return false;
};

export default onTab;
