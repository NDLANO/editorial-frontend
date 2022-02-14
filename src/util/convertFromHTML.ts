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

import { Descendant, Element, Text, Node } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { blocks, inlines } from '../components/SlateEditor/helpers';
import { ParagraphElement } from '../components/SlateEditor/plugins/paragraph';
import { defaultParagraphBlock } from '../components/SlateEditor/plugins/paragraph/utils';

const addEmptyTextNodes = (node: Element) => {
  const { children } = node;

  node.children = children.reduce((acc, cur, index) => {
    if (!Text.isText(cur)) {
      if (index === 0) {
        acc.push({ text: '' });
      } else if (!Text.isText(acc[acc.length - 1])) {
        acc.push({ text: '' });
      }
    }

    acc.push(cur);
    return acc;
  }, [] as Descendant[]);
  if (!Text.isText(node.children[node.children.length - 1])) {
    node.children.push({ text: '' });
  }
};

const addEmptyParagraphs = (node: Element) => {
  const { children } = node;

  node.children = children.reduce((acc, cur, index) => {
    if (Element.isElement(cur)) {
      if (blocks.includes(cur.type)) {
        if (index === 0) {
          acc.push(defaultParagraphBlock());
        } else {
          const lastNode = acc[acc.length - 1];
          if (Element.isElement(lastNode) && blocks.includes(lastNode.type)) {
            acc.push(defaultParagraphBlock());
          }
        }
      }
    }

    acc.push(cur);
    return acc;
  }, [] as Descendant[]);
  const lastNode = node.children[node.children.length - 1];
  if (Element.isElement(lastNode) && blocks.includes(lastNode.type)) {
    node.children.push(defaultParagraphBlock());
  }
};

export function convertFromHTML(root: Descendant | null) {
  const wrapMixedChildren = (node: Descendant): Descendant => {
    if (Element.isElement(node)) {
      const children = node.children;

      const blockChildren = children.filter(
        child => Element.isElement(child) && !inlines.includes(child.type),
      );
      const mixed = blockChildren.length > 0 && blockChildren.length !== children.length;
      if (!mixed) {
        node.children = children.map(wrapMixedChildren);
        if (blockChildren.length === 0 && children.length > 0) {
          addEmptyTextNodes(node);
        } else {
          addEmptyParagraphs(node);
        }
        return node;
      }
      const cleanNodes = [];
      let openWrapperBlock;
      for (const child of children) {
        if (Text.isText(child) || (Element.isElement(child) && inlines.includes(child.type))) {
          if (Node.string(child) === '' || Node.string(child) === ' ') {
            continue;
          }
          if (!openWrapperBlock) {
            openWrapperBlock = slatejsx('element', { type: 'paragraph' }, []) as ParagraphElement;
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
      addEmptyParagraphs(node);

      node.children = cleanNodes.map(wrapMixedChildren);
    }
    return node;
  };

  if (root) {
    return wrapMixedChildren(root);
  }
  return;
}
