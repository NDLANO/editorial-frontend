/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, NodeEntry, Node } from 'slate';

const getCurrentBlock = (editor: Editor, type: Element['type']): NodeEntry<Node> | undefined => {
  const [match] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && n.type === type,
    mode: 'lowest',
  });
  return match;
};

export default getCurrentBlock;
