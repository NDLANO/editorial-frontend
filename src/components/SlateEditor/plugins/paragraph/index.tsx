/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Editor, Node, Element, Descendant, Text } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { TYPE_BREAK } from '../break';
import { getCurrentParagraph, TYPE_PARAGRAPH } from './utils';
import containsVoid from '../../utils/containsVoid';

const KEY_ENTER = 'Enter';

export interface ParagraphElement {
  type: 'paragraph';
  data?: {
    align?: string;
  };
  children: Descendant[];
}

const onEnter = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown?: (event: KeyboardEvent) => void,
) => {
  const currentParagraph = getCurrentParagraph(editor);

  if (!currentParagraph) {
    if (nextOnKeyDown) {
      return nextOnKeyDown(e);
    }
    return;
  }
  e.preventDefault();
  /**
   If the user types enter in an empty paragraph we transform the paragraph to a <br>.
   This enables us to filter out unnecessary empty <p> tags on save. We insert empty p tags
   throughout the document to enable positioning the cursor between element with no
   spacing (i.e two images).
   */
  if (Node.string(currentParagraph) === '' && !containsVoid(editor, currentParagraph)) {
    editor.insertNode({
      type: TYPE_BREAK,
      children: [{ text: '' }],
    });

    editor.insertNode({
      type: TYPE_PARAGRAPH,
      children: [{ text: '' }],
    });
    return;
  }

  if (e.shiftKey === true) {
    return editor.insertText('\n');
  }

  return editor.insertNode({
    type: TYPE_PARAGRAPH,
    children: [{ text: '' }],
  });
};

export const paragraphSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'p') return;

    const data = reduceElementDataAttributes(el, ['align', 'data-align']);

    return jsx(
      'element',
      {
        type: TYPE_PARAGRAPH,
        ...(Object.keys(data).length > 0 ? { data } : {}),
      },
      children,
    );
  },
  serialize(node: Descendant, children: (JSX.Element | null)[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_PARAGRAPH /*&& node.type !== 'line'*/) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */

    if (Node.string(node) === '' && node.children.length === 1 && Text.isText(node.children[0]))
      return null;

    const attributes = node.data?.align ? { 'data-align': node.data.align } : {};
    return <p {...attributes}>{children}</p>;
  },
};

export const paragraphPlugin = (editor: Editor) => {
  const { onKeyDown: nextOnKeyDown, renderElement: nextRenderElement } = editor;

  editor.onKeyDown = (e: KeyboardEvent) => {
    if (e.key === KEY_ENTER) {
      onEnter(e, editor, nextOnKeyDown);
    } else if (nextOnKeyDown) {
      nextOnKeyDown(e);
    }
  };

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_PARAGRAPH) {
      return (
        <p className={element.data?.align === 'center' ? 'u-text-center' : ''} {...attributes}>
          {children}
        </p>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  return editor;
};
