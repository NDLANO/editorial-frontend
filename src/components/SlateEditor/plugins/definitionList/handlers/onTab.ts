/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Transforms } from "slate";
import { ShortcutHandler } from "@ndla/editor";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionListTypes";
import { isDefinitionTermElement, isDefinitionDescriptionElement } from "../queries/definitionListQueries";

export const onTab: ShortcutHandler = (editor, event, logger) => {
  if (!editor.selection || !hasNodeOfType(editor, DEFINITION_LIST_ELEMENT_TYPE)) return false;

  const [parentNode, parentPath] = editor.parent(editor.selection);

  if (event.shiftKey && isDefinitionDescriptionElement(parentNode)) {
    event.preventDefault();
    logger.log("Shift + Tab event on DESCRIPTION, setting type to TERM.");
    Transforms.setNodes(editor, { type: DEFINITION_TERM_ELEMENT_TYPE }, { at: parentPath });
    return true;
  } else if (isDefinitionTermElement(parentNode) && !event.shiftKey) {
    event.preventDefault();
    logger.log("Tab event on TERM, setting type to DESCRIPTION.");
    Transforms.setNodes(editor, { type: DEFINITION_DESCRIPTION_ELEMENT_TYPE }, { at: parentPath });
    return true;
  }
  return false;
};
