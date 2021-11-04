/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Editor, Element, Descendant } from 'slate';
import { jsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { SlateSerializer } from '../../interfaces';
export const TYPE_BREAK = 'br';

export interface BreakElement {
  type: 'br';
  children: Descendant[];
}

const allowedBreakContainers = [
  'section',
  'div',
  'aside',
  'li',
  'blockquote',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'summary',
  'pre',
];

export const breakSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_BREAK) return;

    if (el.parentElement && el.parentElement.tagName) {
      const tagName = el.parentElement.tagName.toLowerCase();
      if (allowedBreakContainers.includes(tagName)) {
        return jsx('element', { type: TYPE_BREAK }, [{ text: '' }]);
      }
    }
    return jsx('text', { text: '\n' });
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== 'br') return;

    return <br />;
  },
};

export const breakPlugin = (editor: Editor) => {
  const { renderElement: nextRenderELement, isVoid: nextIsVoid } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_BREAK) {
      return (
        <div {...attributes} contentEditable={false}>
          <br />
          {children}
        </div>
      );
    } else if (nextRenderELement) {
      return nextRenderELement({ attributes, children, element });
    }
    return undefined;
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_BREAK) {
      return true;
    }
    return nextIsVoid(element);
  };
  return editor;
};
