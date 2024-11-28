/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Element, NodeEntry, Point, Range, Transforms } from "slate";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { TYPE_LIST, TYPE_LIST_ITEM } from "../types";

const onBackspace = (event: KeyboardEvent, editor: Editor, entry: NodeEntry) => {
  if (!editor.selection) return false;
  const isList = hasNodeOfType(editor, TYPE_LIST);

  if (!isList) {
    return false;
  }

  const [selectedDefinitionItem, selectedDefinitionItemPath] = entry;

  if (selectedDefinitionItem) {
    if (Element.isElement(selectedDefinitionItem) && selectedDefinitionItem.type === TYPE_LIST_ITEM) {
      if (Range.isCollapsed(editor.selection)) {
        // Check that cursor is not expanded.
        const [, firstItemNodePath] = Editor.node(editor, [...selectedDefinitionItemPath, 0]);
        // If cursor is placed at start of first item child
        if (Point.equals(Range.start(editor.selection), Editor.start(editor, firstItemNodePath))) {
          event.preventDefault();
          Transforms.liftNodes(editor, { at: selectedDefinitionItemPath });
          return true;
        }
      }
    }
  }
  return false;
};

export default onBackspace;
