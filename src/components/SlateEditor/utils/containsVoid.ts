/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Node } from "slate";

const containsVoid = (editor: Editor, node: Node) => {
  const nodes = Node.elements(node);

  for (const entry of nodes) {
    const [child] = entry;
    if (!child) break;
    if (editor.isVoid(child)) {
      return true;
    }
  }
  return false;
};

export default containsVoid;
