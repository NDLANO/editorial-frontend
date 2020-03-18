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

import { Element, Node } from 'slate';

export function convertFromHTML(json: any) {
  const wrapMixedChildren = (node: Node): Element | void => {
    if (node.children.length === 0) return;

    // visit all our children
    node.children.forEach(wrapMixedChildren);

    const blockChildren = node.children.filter((n: Node) => n.object === 'block');
    const mixed =
      blockChildren.length > 0 && blockChildren.length !== node.nodes.length;
    if (!mixed) {
      return;
    }

    const cleanNodes = [];
    let openWrapperBlock: Element = { children: [] };
    for (const child of node.nodes) {
      // dont wrap whitespace
      if (child.text === ' ') continue;

      if (child.object === 'block') {
        if (openWrapperBlock) {
          openWrapperBlock = { children: [] };
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
        if (openWrapperBlock.children.length === 0) {
          openWrapperBlock = {
            type: 'paragraph',
            object: 'block',
            children: [],
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
  return json;
}
