/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Element, Path } from "slate";
import { TYPE_LIST } from "../types";

export const getListItemType = (editor: Editor, path: Path) => {
  const [parentNode] = Editor.node(editor, Path.parent(path));

  if (Element.isElement(parentNode) && parentNode.type === TYPE_LIST) {
    return parentNode.listType;
  }
  return "numbered-list";
};
