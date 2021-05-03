/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RenderElementProps } from 'new-slate-react';
import { jsx } from 'new-slate-hyperscript';
import { Descendant, Editor, Element, Text, Node, Transforms } from 'new-slate';
import { SlateSerializer } from '../../interfaces';

export const TYPE_QUOTE = 'quote';

export interface BlockQuoteElement {
  type: 'quote';
}

export const blockQuoteSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'blockquote') {
      return jsx('element', { type: TYPE_QUOTE }, children);
    }
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_QUOTE) {
      return `<blockquote>${children}</blockquote>`;
    }
  },
};

export const blockQuotePlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === 'quote') {
      return <blockquote {...attributes}>{children}</blockquote>;
    } else if (nextRenderElement) {
      return nextRenderElement(props);
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    nextNormalizeNode(entry);
  };

  return editor;
};
