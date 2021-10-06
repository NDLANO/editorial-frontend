/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEventHandler } from 'react';
import { Editor, Element, Node, Text } from 'slate';
import { ReactEditor } from 'slate-react';
import { TYPE_QUOTE } from '../blockquote';
import { TYPE_HEADING } from '../heading';
import { TYPE_LIST, TYPE_LIST_ITEM } from '../list';
import { TYPE_PARAGRAPH } from '../paragraph/utils';
import { TYPE_SECTION } from '../section';
import onDrop from './onDrop';
import { getTopNode } from './utils';

const onDragOver = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.preventDefault();
};

const onDragStart = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.dataTransfer.effectAllowed = 'copy';

  const node = ReactEditor.toSlateNode(editor, event.target as globalThis.Node);
  const path = ReactEditor.findPath(editor, node);
  const topNode = getTopNode(editor, path);
  if (!Text.isText(node) && topNode && Element.isElement(topNode[0])) {
    event.dataTransfer.setData('application/slate-node-path', JSON.stringify(topNode[1]));
  }
};

const dndPlugin = (editor: Editor) => {
  const { getFragment } = editor;
  editor.getFragment = () => {
    var selection = editor.selection;

    if (selection) {
      const fragment = Node.fragment(editor, selection);
      const section = fragment[0];

      if (Element.isElement(section) && section.type === TYPE_SECTION) {
        const lowestCommonAncestor = [...Node.nodes(section)].find(([element]) => {
          return (
            Element.isElement(element) &&
            (element.children.length > 1 ||
              [TYPE_HEADING, TYPE_PARAGRAPH, TYPE_QUOTE].includes(element.type))
          );
        })?.[0];
        if (Element.isElement(lowestCommonAncestor)) {
          if (lowestCommonAncestor.type === TYPE_HEADING) {
            return [lowestCommonAncestor];
          }
          if (lowestCommonAncestor.type === TYPE_LIST) {
            return [lowestCommonAncestor];
          }
          if (lowestCommonAncestor.type === TYPE_LIST_ITEM) {
            const lowestCommonList = [...Node.nodes(section)].find(([element]) => {
              return Element.isElement(element) && element.children.includes(lowestCommonAncestor);
            })?.[0];
            if (Element.isElement(lowestCommonList)) {
              return [lowestCommonList];
            }
          }
          return lowestCommonAncestor.children;
        }
      }
    }

    return getFragment();
  };

  return editor;
};

export { onDragOver, onDragStart, onDrop, dndPlugin };
