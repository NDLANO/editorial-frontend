/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Transforms, Node, Range } from "slate";
import { ShortcutHandler } from "@ndla/editor";
import { isDefinitionTermElement, isDefinitionDescriptionElement } from "../queries/definitionListQueries";
import { DEFINITION_DESCRIPTION_ELEMENT_TYPE, DEFINITION_TERM_ELEMENT_TYPE } from "../definitionListTypes";

export const onEnter: ShortcutHandler = (editor, event, logger) => {
  if (!editor.selection || Range.isExpanded(editor.selection)) return false;
  const [parentNode, parentPath] = editor.parent(editor.selection);
  if (!isDefinitionTermElement(parentNode) && !isDefinitionDescriptionElement(parentNode)) return false;
  if (Node.string(parentNode) !== "" || editor.hasVoids(parentNode)) return false;

  event.preventDefault();

  if (parentNode.type === DEFINITION_DESCRIPTION_ELEMENT_TYPE) {
    logger.log("Tried to enter on empty definition description, converting it to term.");
    Transforms.setNodes(editor, { type: DEFINITION_TERM_ELEMENT_TYPE }, { at: parentPath });
  } else {
    logger.log("Tried to enter on empty definition term, splitting list and inserting paragraph");
    editor.withoutNormalizing(() => {
      Transforms.unwrapNodes(editor, { at: parentPath });
      Transforms.liftNodes(editor, { at: parentPath });
    });
  }
  return true;
};
