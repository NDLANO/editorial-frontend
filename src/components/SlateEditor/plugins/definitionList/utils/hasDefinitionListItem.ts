/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element } from "slate";
import { isDefinitionListItem } from "./isDefinitionListItem";
import { TYPE_DEFINITION_DESCRIPTION, TYPE_DEFINITION_TERM } from "../types";

const hasDefinitionListItem = (editor: Editor) => {
  // For all selected list elements
  for (const [, path] of Editor.nodes(editor, {
    match: (node) =>
      Element.isElement(node) && (node.type === TYPE_DEFINITION_DESCRIPTION || node.type === TYPE_DEFINITION_TERM),
  })) {
    if (isDefinitionListItem(editor, path)) {
      return true;
    }

    return false;
  }
  return false;
};

export default hasDefinitionListItem;
