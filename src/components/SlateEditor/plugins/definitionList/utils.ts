/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Transforms, Element, Node, Path } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from './types';

export const definitionTerm = slatejsx('element', { type: TYPE_DEFINTION_TERM }, [{ text: '' }]);
export const definitionDescription = slatejsx('element', { type: TYPE_DEFINTION_DESCRIPTION }, [
  { text: '' },
]);
export const definitionList = slatejsx('element', { type: TYPE_DEFINTION_LIST }, [
  definitionTerm,
  definitionDescription,
]);

export const toggleDefinitionList = (editor: Editor) => {
  Transforms.wrapNodes(editor, definitionList);
};

export const nodeContainsText = (node: Node) =>
  Element.isElement(node) && node?.children?.length === 1 && Node.string(node.children[0]) !== '';

export const removeDefinitionPair = (editor: Editor, ...paths: Path[]) => {
  paths.forEach(path => {
    Transforms.removeNodes(editor, { at: path });
  });
};

export const moveSelectionOutOfDefinitionList = (editor: Editor, path: Path) =>
  Transforms.liftNodes(editor, { at: path });
