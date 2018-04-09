/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Code heavily 'inspired' from: https://github.com/Foundry376/Mailspring/blob/master/app/src/components/composer-editor/conversion.jsx#L172
 *
 */

/* eslint-disable no-continue, no-param-reassign, no-restricted-syntax  */

import { Value } from 'slate';
import { BLOCK_TAGS } from './slateHelpers';

export function convertFromHTML(json) {
  /* Slate's default sanitization just obliterates block nodes that contain both
  inline+text children and block children. This happens very often because we
  preserve <section> nodes as blocks. Implement better coercion before theirs:

  - Find nodes with mixed children:
    + Wrap adjacent inline+text children in a new <section> block
  */
  const wrapMixedChildren = node => {
    if (!node.nodes) return;

    // visit all our children
    node.nodes.forEach(wrapMixedChildren);

    const blockChildren = node.nodes.filter(n => n.object === 'block');
    const mixed =
      blockChildren.length > 0 && blockChildren.length !== node.nodes.length;
    if (!mixed) {
      return;
    }

    const cleanNodes = [];
    let openWrapperBlock = null;
    for (const child of node.nodes) {
      if (child.object === 'block') {
        if (openWrapperBlock) {
          openWrapperBlock = null;
          // this node will close the wrapper block we've created and trigger a newline!
          // If this node is empty (was just a <br> or <p></p> to begin with) let's skip
          // it to avoid creating a double newline.
          if (
            child.type === BLOCK_TAGS.section.type &&
            child.nodes &&
            child.nodes.length === 0
          ) {
            continue;
          }
        }
        cleanNodes.push(child);
      } else {
        if (!openWrapperBlock) {
          openWrapperBlock = {
            type: BLOCK_TAGS.section.type,
            object: 'block',
            nodes: [],
            data: {},
          };
          cleanNodes.push(openWrapperBlock);
        }
        openWrapperBlock.nodes.push(child);
      }
    }

    node.nodes = cleanNodes;
  };

  wrapMixedChildren(json.document);

  /* We often end up with bogus whitespace at the bottom of complex emails, either
  because the input contained whitespace, or because there were elements present
  that we didn't convert into anything. Prune the trailing empty node(s). */
  const cleanupTrailingWhitespace = (node, isTopLevel) => {
    if (!node.nodes || node.isVoid) return;

    while (true) {
      const last = node.nodes[node.nodes.length - 1];
      if (!last) {
        break;
      }
      cleanupTrailingWhitespace(last, false);

      if (isTopLevel && node.nodes.length === 1) {
        break;
      }
      if (
        last.object === 'block' &&
        last.type === BLOCK_TAGS.section.type &&
        last.nodes.length === 0
      ) {
        node.nodes.pop();
        continue;
      }
      if (
        last.object === 'text' &&
        last.leaves.length === 1 &&
        last.leaves[0].text === ''
      ) {
        node.nodes.pop();
        continue;
      }
      break;
    }
  };
  cleanupTrailingWhitespace(json.document, true);

  /* In Slate, `text` nodes contains an array of `leaves`, each of which has `marks`.
  When we deserialize HTML we convert "Hello <b>World</b> Again" into three adjacent
  text nodes, each with a single leaf with different marks, and Slate has to (very slowly)
  normalize it by merging the nodes into one text node with three leaves.
  - Convert adjacent text nodes into a single text node with all the leaves.
  - Ensure `block` elements have an empty text node child.
  */
  const optimizeTextNodesForNormalization = node => {
    if (!node.nodes) return;
    node.nodes.forEach(optimizeTextNodesForNormalization);

    // Convert adjacent text nodes into a single text node with all the leaves
    const cleanChildren = [];
    let lastChild = null;
    for (const child of node.nodes) {
      if (child.object === 'block') {
        return; // because of wrapMixedChildren, block child means no text children
      }
      if (lastChild && lastChild.object === 'text' && child.object === 'text') {
        lastChild.leaves.push(...child.leaves);
        continue;
      }
      cleanChildren.push(child);
      lastChild = child;
    }
    node.nodes = cleanChildren;

    // Ensure `block` elements have an empty text node child
    if (node.object === 'block' && node.nodes.length === 0) {
      node.nodes = [
        {
          object: 'text',
          leaves: [
            {
              object: 'leaf',
              text: '',
              marks: [],
            },
          ],
        },
      ];
    }
  };

  optimizeTextNodesForNormalization(json.document);

  return Value.fromJSON(json);
}
