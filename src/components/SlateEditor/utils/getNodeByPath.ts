/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Node, Path } from "slate";

const getNodeByPath = (node: Node | Descendant[], path: Path): Descendant[] | Node | null => {
  const pathCopy = [...path];
  if (path.length === 0) return node;
  const index = pathCopy.shift();

  if (typeof index !== "number") {
    return null;
  }
  if ("children" in node && index < node.children.length) return getNodeByPath(node.children[index], pathCopy);
  if (Array.isArray(node) && index < node.length) return getNodeByPath(node[index], pathCopy);

  return null;
};

export default getNodeByPath;
