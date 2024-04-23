/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, NodeEntry, Node, Path } from "slate";

const getCurrentBlock = (editor: Editor, type: Element["type"], path?: Path): NodeEntry<Node> | undefined => {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === type,
    mode: "lowest",
    at: path,
  });
  return match;
};

export default getCurrentBlock;
