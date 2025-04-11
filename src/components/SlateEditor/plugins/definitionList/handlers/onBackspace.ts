/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { KeyboardEvent } from "react";
import { Editor, Transforms, Range, Point } from "slate";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import { Logger } from "@ndla/editor";
import { DEFINITION_LIST_ELEMENT_TYPE } from "../definitionListTypes";
import { isDefinitionDescriptionElement, isDefinitionTermElement } from "../queries/definitionListQueries";

export const onBackspace = (editor: Editor, e: KeyboardEvent<HTMLDivElement>, logger: Logger) => {
  if (
    !editor.selection ||
    !Range.isCollapsed(editor.selection) ||
    !hasNodeOfType(editor, DEFINITION_LIST_ELEMENT_TYPE)
  ) {
    return false;
  }

  const [selectedDefinitionNode, selectedDefinitionPath] = Editor.parent(editor, editor.selection.anchor.path);
  if (isDefinitionTermElement(selectedDefinitionNode) || isDefinitionDescriptionElement(selectedDefinitionNode)) {
    if (Range.isCollapsed(editor.selection)) {
      const [, firstItemNodePath] = Editor.node(editor, [...selectedDefinitionPath, 0]);
      if (Point.equals(Range.start(editor.selection), Editor.start(editor, firstItemNodePath))) {
        e.preventDefault();
        logger.log("Backspace at the start of node, lift node out of list.");
        Transforms.liftNodes(editor, {
          at: selectedDefinitionPath,
        });
        return true;
      }
    }
  }

  return false;
};
