/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { KeyboardEvent } from "react";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import getCurrentBlock from "../../../utils/getCurrentBlock";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { getEditorAncestors } from "../../toolbar/toolbarState";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from "../types";

const onTab = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  next?: (event: KeyboardEvent<HTMLDivElement>) => void,
) => {
  event.preventDefault();
  const isDefinition = hasNodeOfType(editor, TYPE_DEFINITION_LIST);
  if (!isDefinition || !editor.selection) {
    return next?.(event);
  }

  const listEntry = getCurrentBlock(editor, TYPE_DEFINITION_LIST);
  const listItemEntry = Editor.parent(editor, editor.selection.anchor.path);

  if (!listEntry || !listItemEntry) {
    return next?.(event);
  }

  const [currentListNode] = listEntry;
  const [firstChild, secondChild] = getEditorAncestors(editor, true);

  const selectedDefinitionItem =
    firstChild.type === TYPE_DEFINITION_DESCRIPTION || firstChild.type === TYPE_DEFINITION_TERM
      ? firstChild
      : secondChild;

  const selectedDefinitionItemPath = ReactEditor.findPath(editor, selectedDefinitionItem);

  if (Element.isElement(currentListNode) && currentListNode.type === TYPE_DEFINITION_LIST) {
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
  }
};

export default onTab;
