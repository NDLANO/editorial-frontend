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

export function convertFromHTML(json) {
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
      // dont wrap whitespace
      if (child.text === ' ') continue;

      if (child.object === 'block') {
        if (openWrapperBlock) {
          openWrapperBlock = null;
          // this node will close the wrapper block we've created and trigger a newline!
          // If this node is empty (was just a <br> or <p></p> to begin with) let's skip
          // it to avoid creating a double newline.
          if (
            child.type === 'paragraph' &&
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
            type: 'paragraph',
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
  return Value.fromJSON(json);
}
