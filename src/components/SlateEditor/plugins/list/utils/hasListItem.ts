/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Element } from "slate";
import { getListItemType } from "./getListItemType";
import { isListItemPathSelected } from "./isListItemSelected";
import { TYPE_LIST_ITEM } from "../types";

const hasListItem = (editor: Editor, type?: string) => {
  // For all selected list elements
  for (const [, path] of Editor.nodes(editor, {
    match: (node) => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
  })) {
    if (type) {
      const itemListType = getListItemType(editor, path);

      if (itemListType === type && isListItemPathSelected(editor, path)) {
        return true;
      }
    } else if (isListItemPathSelected(editor, path)) {
      return true;
    }
  }
  return false;
};

export default hasListItem;
