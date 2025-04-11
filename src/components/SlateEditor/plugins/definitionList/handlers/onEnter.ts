/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { KeyboardEvent } from "react";
import { Editor, Path, Transforms, Node, Range, Point } from "slate";
import { Logger } from "@ndla/editor";
import { defaultDefinitionTermBlock, defaultDefinitionDescriptionBlock } from "../utils";
import { isDefinitionTermElement, isDefinitionDescriptionElement } from "../queries/definitionListQueries";

export const onEnter = (editor: Editor, e: KeyboardEvent<HTMLDivElement>, logger: Logger) => {
  if (e.shiftKey || !editor.selection) return false;

  const [selectedDefinitionNode, selectedDefinitionPath] = editor.parent(editor.selection);

  if (!(isDefinitionTermElement(selectedDefinitionNode) || isDefinitionDescriptionElement(selectedDefinitionNode))) {
    return false;
  }

  e.preventDefault();

  if (Range.isExpanded(editor.selection)) {
    Editor.deleteFragment(editor);
  }

  if (Node.string(selectedDefinitionNode) === "" && selectedDefinitionNode.children.length === 1) {
    logger.log("Enter on empty definition node, unwrapping and lifting.");
    Editor.withoutNormalizing(editor, () => {
      Transforms.unwrapNodes(editor, {
        at: selectedDefinitionPath,
      });
      Transforms.liftNodes(editor, {
        at: selectedDefinitionPath,
      });
    });
    return true;
  }

  Transforms.unsetNodes(editor, "serializeAsText", {
    match: (node) => isDefinitionDescriptionElement(node) || isDefinitionTermElement(node),
    mode: "lowest",
  });

  const nextPoint = Editor.after(editor, Range.end(editor.selection));
  const listItemEnd = Editor.end(editor, selectedDefinitionPath);

  if ((nextPoint && Point.equals(listItemEnd, nextPoint)) || Point.equals(listItemEnd, editor.selection.anchor)) {
    const nextPath = Path.next(selectedDefinitionPath);
    if (isDefinitionTermElement(selectedDefinitionNode)) {
      logger.log("Enter on definition term, inserting new definition term node.");
      Transforms.insertNodes(editor, defaultDefinitionTermBlock(), { at: nextPath });
    } else if (isDefinitionDescriptionElement(selectedDefinitionNode)) {
      logger.log("Enter on definition description, inserting new definition description node.");
      Transforms.insertNodes(editor, defaultDefinitionDescriptionBlock(), { at: nextPath });
    }
    Transforms.select(editor, Editor.start(editor, nextPath));
    return true;
  }

  // Split current listItem at selection.
  logger.log("Enter inside definition node, splitting node.");
  Transforms.splitNodes(editor, {
    match: (node) => isDefinitionDescriptionElement(node) || isDefinitionTermElement(node),
    mode: "lowest",
  });
  Transforms.select(editor, editor.start(Path.next(selectedDefinitionPath)));
  return true;
};
