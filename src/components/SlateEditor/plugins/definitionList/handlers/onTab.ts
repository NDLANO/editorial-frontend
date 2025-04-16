/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { KeyboardEvent } from "react";
import { Editor, Transforms } from "slate";
import { Logger } from "@ndla/editor";
import hasNodeOfType from "../../../utils/hasNodeOfType";
import {
  DEFINITION_DESCRIPTION_ELEMENT_TYPE,
  DEFINITION_LIST_ELEMENT_TYPE,
  DEFINITION_TERM_ELEMENT_TYPE,
} from "../definitionListTypes";
import { isDefinitionTermElement, isDefinitionDescriptionElement } from "../queries/definitionListQueries";

export const onTab = (editor: Editor, event: KeyboardEvent<HTMLDivElement>, logger: Logger) => {
  if (!editor.selection || !hasNodeOfType(editor, DEFINITION_LIST_ELEMENT_TYPE)) return false;

  event.preventDefault();

  const [selectedDefinitionNode, selectedDefinitionPath] = editor.parent(editor.selection);

  if (event.shiftKey && isDefinitionDescriptionElement(selectedDefinitionNode)) {
    logger.log("Shift + Tab event on DESCRIPTION, setting type to TERM.");
    Transforms.setNodes(
      editor,
      {
        type: DEFINITION_TERM_ELEMENT_TYPE,
      },
      { at: selectedDefinitionPath },
    );
    return true;
  } else if (isDefinitionTermElement(selectedDefinitionNode)) {
    logger.log("Tab event on TERM, setting type to DESCRIPTION.");
    Transforms.setNodes(
      editor,
      {
        type: DEFINITION_DESCRIPTION_ELEMENT_TYPE,
      },
      { at: selectedDefinitionPath },
    );
    return true;
  }
  return false;
};
