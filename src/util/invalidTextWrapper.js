/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import jsdom from 'jsdom';
import { BLOCK_TAGS, TABLE_TAGS } from './slateHelpers';
// import config from '../config';

// const dom = new jsdom.JSDOM(`<!DOCTYPE html></html>`);

// const doc = !config.checkArticleScript ? document : dom.window.document;

/* const nodefilter = !config.checkArticleScript
  ? NodeFilter
  : dom.window.NodeFilter; */

export const textWrapper = serializer => inputHtml => {
  const DefaultParse = serializer.parseHtml;
  const tree = DefaultParse.apply(serializer, [inputHtml]);

  // ensure that no DIVs, SECTIONs or ASIDEs contain both element children and text node children. This is
  // not allowed by Slate's core schema: blocks must contain inlines and text OR blocks.
  // https://docs.slatejs.org/guides/data-model#documents-and-nodes
  const BLOCKS_TO_CHECK = ['aside', 'div', 'em', 'section'];
  const ALL_BLOCKS = Object.keys(BLOCK_TAGS)
    .concat(BLOCKS_TO_CHECK)
    .concat(Object.keys(TABLE_TAGS))
    .concat(['embed', 'p', 'ol', 'li', 'ul']);
  const treeWalker = document.createTreeWalker(tree, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node =>
      node.nodeName && BLOCKS_TO_CHECK.includes(node.nodeName.toLowerCase())
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_SKIP,
  });

  const needWrapping = [];
  while (treeWalker.nextNode()) {
    const div = treeWalker.currentNode;
    const hasBlockChild = Array.from(div.childNodes).find(n =>
      ALL_BLOCKS.includes(n.nodeName.toLowerCase()),
    );
    if (hasBlockChild) {
      const textOrInlineChildren = Array.from(div.childNodes).filter(
        n => !ALL_BLOCKS.includes(n.nodeName.toLowerCase()),
      );
      needWrapping.push(...textOrInlineChildren);
    }
  }

  needWrapping.forEach(tn => {
    const wrapped = document.createElement('p');
    tn.parentNode.replaceChild(wrapped, tn);
    wrapped.appendChild(tn);
  });

  return tree;
};
