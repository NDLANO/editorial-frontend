/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent } from "react";
import { Editor, Element, Transforms, Range, Point } from "slate";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_LIST, TYPE_DEFINITION_TERM } from "../types";

const onBackspace = (
  e: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  nextOnKeyDown: ((e: KeyboardEvent<HTMLDivElement>) => void) | undefined,
) => {
  if (!editor.selection) return nextOnKeyDown?.(e);
  const isDefinition = hasNodeOfType(editor, TYPE_DEFINITION_LIST);

  if (!isDefinition) {
    return nextOnKeyDown?.(e);
  }

  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(editor, editor.selection.anchor.path);
  if (selectedDefinitionItem) {
    if (
      Element.isElement(selectedDefinitionItem) &&
      (selectedDefinitionItem.type === TYPE_DEFINITION_DESCRIPTION ||
        selectedDefinitionItem.type === TYPE_DEFINITION_TERM)
    ) {
      if (Range.isCollapsed(editor.selection)) {
        const [, firstItemNodePath] = Editor.node(editor, [...selectedDefinitionItemPath, 0]);
        if (Point.equals(Range.start(editor.selection), Editor.start(editor, firstItemNodePath))) {
          e.preventDefault();
          return Transforms.liftNodes(editor, {
            at: selectedDefinitionItemPath,
          });
        }
      }
    }
  }

  return nextOnKeyDown?.(e);
};

export default onBackspace;
