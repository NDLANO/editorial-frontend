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

export const breakSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_BREAK) return;
    return jsx('element', { type: TYPE_BREAK }, [{ text: '' }]);
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
      // Children of br tag is not rendered.
      return <br {...attributes} contentEditable={false} />;
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
