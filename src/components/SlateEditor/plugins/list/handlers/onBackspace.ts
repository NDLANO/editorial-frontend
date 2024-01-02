/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Element, Point, Range, Transforms } from "slate";
import getCurrentBlock from "../../../utils/getCurrentBlock";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { TYPE_LIST, TYPE_LIST_ITEM } from "../types";

const onBackspace = (event: KeyboardEvent, editor: Editor, next?: (event: KeyboardEvent) => void) => {
  if (!editor.selection) return next && next(event);
  const isList = hasNodeOfType(editor, TYPE_LIST);

  if (!isList) {
    return next && next(event);
  }

  const entry = getCurrentBlock(editor, TYPE_LIST_ITEM);

  if (entry) {
    const [currentItemNode, currentItemPath] = entry;
    if (Element.isElement(currentItemNode) && currentItemNode.type === TYPE_LIST_ITEM) {
      if (Range.isCollapsed(editor.selection)) {
        // Check that cursor is not expanded.
        const [, firstItemNodePath] = Editor.node(editor, [...currentItemPath, 0]);
        // If cursor is placed at start of first item child
        if (Point.equals(Range.start(editor.selection), Editor.start(editor, firstItemNodePath))) {
          event.preventDefault();
          return Transforms.liftNodes(editor, { at: currentItemPath });
        }
      }
    }
  }
  return next && next(event);
};

export default onBackspace;
