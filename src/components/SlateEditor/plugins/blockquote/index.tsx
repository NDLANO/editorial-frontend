/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { KeyboardEvent, KeyboardEventHandler } from 'react';
import { RenderElementProps } from 'new-slate-react';
import { jsx } from 'new-slate-hyperscript';
import { Descendant, Editor, Element, Transforms } from 'new-slate';
import { SlateSerializer } from '../../interfaces';
import { getCurrentQuote } from './utils';
import { TYPE_PARAGRAPH } from '../paragraph';

const KEY_ENTER = 'Enter';
export const TYPE_QUOTE = 'quote';

export interface BlockQuoteElement {
  type: 'quote';
  children: Descendant[];
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

const onEnter = (
  e: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  nextOnKeyDown?: KeyboardEventHandler<HTMLDivElement>,
) => {
  const [quoteNode, quotePath] = getCurrentQuote(editor) || [];

  if (!quoteNode || !(editor.selection && editor.selection)) {
    if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
    return;
  }

  e.preventDefault();

  if (e.shiftKey === true) {
    return editor.insertText('\n');
  }

  if (Editor.string(editor, editor.selection.anchor.path) === '') {
    const quoteChildPath = editor.selection.anchor.path.slice(0, quotePath.length + 1);

    return Transforms.liftNodes(editor, {
      at: quoteChildPath,
    });
  }

  return editor.insertNode(jsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]));
};

export const blockQuotePlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_QUOTE) {
      return <blockquote {...attributes}>{children}</blockquote>;
    } else if (nextRenderElement) {
      return nextRenderElement(props);
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    nextNormalizeNode(entry);
  };

  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  return editor;
};
