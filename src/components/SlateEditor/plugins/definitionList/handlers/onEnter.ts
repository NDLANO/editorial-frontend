/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { KeyboardEvent } from "react";
import { Editor, Element, Path, Transforms, Node, Range, Point, NodeEntry } from "slate";
import { Logger } from "@ndla/editor";
import { isDefinitionTerm, isDefinitionDescription } from "../queries/definitionListQueries";
import { defaultDefinitionTermBlock, defaultDefinitionDescriptionBlock } from "../utils";
import { DEFINITION_DESCRIPTION_ELEMENT_TYPE, DEFINITION_TERM_ELEMENT_TYPE } from "../definitionListTypes";

export const onEnter = (editor: Editor, e: KeyboardEvent<HTMLDivElement>, logger: Logger) => {
  if (e.shiftKey || !editor.selection) {
    return false;
  }
  const ancestors = Node.ancestors(editor, editor.path(editor.selection.anchor.path), { reverse: true });
  const [firstEntry, secondEntry] = Array.from(ancestors).filter(
    (entry): entry is NodeEntry<Element> => Element.isElement(entry[0]) && entry[0].type !== "section",
  );

  const selectedDefinitionEntry =
    firstEntry[0]?.type === DEFINITION_DESCRIPTION_ELEMENT_TYPE || firstEntry[0]?.type === DEFINITION_TERM_ELEMENT_TYPE
      ? firstEntry
      : secondEntry;

  const [selectedDefinitionNode, selectedDefinitionPath] = selectedDefinitionEntry;

  if (!(isDefinitionTerm(selectedDefinitionNode) || isDefinitionDescription(selectedDefinitionNode))) {
    return false;
  }

  e.preventDefault();

  if (Range.isExpanded(editor.selection)) {
    Editor.deleteFragment(editor);
  }

  if (Node.string(selectedDefinitionNode) === "" && selectedDefinitionNode.children.length === 1) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.unwrapNodes(editor, {
        at: selectedDefinitionPath,
      });
      Transforms.liftNodes(editor, {
        at: selectedDefinitionPath,
      });
    });
    logger.log("Enter on empty definition node, unwrapping and lifting.");
    return true;
  }

  Transforms.unsetNodes(editor, "serializeAsText", {
    match: (node) => isDefinitionDescription(node) || isDefinitionTerm(node),
    mode: "lowest",
  });

  const nextPoint = Editor.after(editor, Range.end(editor.selection));
  const listItemEnd = Editor.end(editor, selectedDefinitionPath);

  if ((nextPoint && Point.equals(listItemEnd, nextPoint)) || Point.equals(listItemEnd, editor.selection.anchor)) {
    const nextPath = Path.next(selectedDefinitionPath);
    if (isDefinitionTerm(selectedDefinitionNode)) {
      Transforms.insertNodes(editor, defaultDefinitionTermBlock(), { at: nextPath });
      logger.log("Enter on definition term, inserting new definition term node.");
    } else if (isDefinitionDescription(selectedDefinitionNode)) {
      Transforms.insertNodes(editor, defaultDefinitionDescriptionBlock(), { at: nextPath });
      logger.log("Enter on definition description, inserting new definition description node.");
    }
    Transforms.select(editor, Editor.start(editor, nextPath));
    return true;
  }

  // Split current listItem at selection.
  Transforms.splitNodes(editor, {
    match: (node) => isDefinitionDescription(node) || isDefinitionTerm(node),
    mode: "lowest",
  });
  logger.log("Enter inside definition node, splitting node.");
  return true;
};
