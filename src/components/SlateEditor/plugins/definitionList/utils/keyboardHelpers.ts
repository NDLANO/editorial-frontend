/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Element, Node, Path } from 'slate';

export const nodeContainsText = (node: Node) =>
  Element.isElement(node) && node?.children?.length === 1 && Node.string(node.children[0]) !== '';

export const removeDefinitionPair = (editor: Editor, ...paths: Path[]) => {
  paths.forEach(path => {
    Transforms.removeNodes(editor, { at: path });
  });
};

export const moveSelectionOutOfDefinitionList = (editor: Editor, path: Path) =>
  Transforms.liftNodes(editor, { at: path });
