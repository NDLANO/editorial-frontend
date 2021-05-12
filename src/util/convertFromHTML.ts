/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Slate does not allow a block to contain both blocks and inline nodes, so this code checks if the original
 * html violates this constraint and wraps consecutive inline nodes in a paragraph.
 *
 * Code heavily 'inspired' from: https://github.com/Foundry376/Mailspring/blob/master/app/src/components/composer-editor/conversion.jsx#L172
 *
 */

/* eslint-disable no-continue, no-param-reassign, no-restricted-syntax  */

import { Descendant, Element, Text, Node } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { ParagraphElement } from '../components/SlateEditor/plugins/paragraph';

export function convertFromHTML(root: Descendant | null) {
  const wrapMixedChildren = (node: Descendant): Descendant => {
    if (Element.isElement(node)) {
      const children = node.children;

      const blockChildren = children.filter(
        child => Element.isElement(child) && child.type !== 'link' && child.type !== 'content-link',
      );
      const mixed = blockChildren.length > 0 && blockChildren.length !== children.length;
      if (!mixed) {
        node.children = children.map(wrapMixedChildren);
        return node;
      }
      const cleanNodes = [];
      let openWrapperBlock;
      for (const child of children) {
        if (
          Text.isText(child) ||
          (Element.isElement(child) && (child.type === 'link' || child.type === 'content-link'))
        ) {
          if (Node.string(child) === '') {
            continue;
          }
          if (!openWrapperBlock) {
            openWrapperBlock = jsx('element', { type: 'paragraph' }, []) as ParagraphElement;
            cleanNodes.push(openWrapperBlock);
          }
          openWrapperBlock.children.push(child);
        } else {
          openWrapperBlock = null;
          if (child.type === 'paragraph' && child.children.length === 0) {
            continue;
          }
          cleanNodes.push(child);
        }
      }
      node.children = cleanNodes.map(wrapMixedChildren);
    }
    return node;
  };

  if (root) {
    return wrapMixedChildren(root);
  }
  return;
}
