/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Node, Path } from "slate";

const getNodeByPath = (editor: Editor, path: Path): Node | null => {
  const pathCopy = [...path];
  let index = pathCopy.shift();
  if (typeof index !== "number") return null;

  let node = editor.children[index];

  while (pathCopy.length > 0) {
    index = pathCopy.shift();
    if (typeof index !== "number") return null;
    const currentNode = node;
    if ("children" in currentNode && index < currentNode.children.length) {
      node = currentNode.children[index];
    } else if (Array.isArray(currentNode) && index < currentNode.length) {
      node = currentNode[index];
    } else {
      return null;
    }
  }

  return node;
};

export default getNodeByPath;
