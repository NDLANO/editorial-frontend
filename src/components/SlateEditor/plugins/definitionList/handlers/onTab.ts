/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { KeyboardEvent } from "react";
import { Editor, Transforms, Node, NodeEntry, Element } from "slate";
import { Logger } from "@ndla/editor";
import getCurrentBlock from "../../../utils/getCurrentBlock";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionListTypes";
import { isDefinitionTerm, isDefinitionDescription, isDefinitionList } from "../queries/definitionListQueries";

export const onTab = (editor: Editor, event: KeyboardEvent<HTMLDivElement>, logger: Logger) => {
  event.preventDefault();
  const isDefinition = hasNodeOfType(editor, DEFINITION_LIST_ELEMENT_TYPE);
  if (!isDefinition || !editor.selection) {
    return false;
  }

  const listEntry = getCurrentBlock(editor, DEFINITION_LIST_ELEMENT_TYPE);
  const listItemEntry = Editor.parent(editor, editor.selection.anchor.path);

  if (!listEntry || !listItemEntry) {
    return false;
  }

  const [currentListNode] = listEntry;
  const ancestors = Node.ancestors(editor, editor.path(editor.selection.anchor.path), { reverse: true });
  const [firstEntry, secondEntry] = Array.from(ancestors).filter(
    (entry): entry is NodeEntry<Element> => Element.isElement(entry[0]) && entry[0].type !== "section",
  );

  const selectedDefinitionEntry =
    firstEntry[0]?.type === DEFINITION_DESCRIPTION_ELEMENT_TYPE || firstEntry[0]?.type === DEFINITION_TERM_ELEMENT_TYPE
      ? firstEntry
      : secondEntry;

  if (!selectedDefinitionEntry) {
    return false;
  }

  const [selectedDefinitionNode, selectedDefinitionPath] = selectedDefinitionEntry;

  if (!isDefinitionTerm(selectedDefinitionNode) && !isDefinitionDescription(selectedDefinitionNode)) {
    return false;
  }

  if (isDefinitionList(currentListNode)) {
    Editor.withoutNormalizing(editor, () => {
      if (event.shiftKey && isDefinitionDescription(selectedDefinitionNode)) {
        Transforms.setNodes(
          editor,
          {
            type: DEFINITION_TERM_ELEMENT_TYPE,
          },
          { at: selectedDefinitionPath },
        );
        logger.log("Shift + Tab event on DESCRIPTION, setting type to TERM.");
        return true;
      } else if (isDefinitionTerm(selectedDefinitionNode)) {
        Transforms.setNodes(
          editor,
          {
            type: DEFINITION_DESCRIPTION_ELEMENT_TYPE,
          },
          { at: selectedDefinitionPath },
        );
        logger.log("Tab event on TERM, setting type to DESCRIPTION.");
        return true;
      }
    });
  }
  return false;
};
