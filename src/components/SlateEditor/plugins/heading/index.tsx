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
import { Descendant, Editor, Element } from 'new-slate';
import { SlateSerializer } from '../../interfaces';
import { hasNodeOfType, isBlockActive } from '../../utils';
const KEY_ENTER = 'Enter';
export const TYPE_HEADING = 'heading';

export interface HeadingElement {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: Descendant[];
}

export const headingSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'h1') {
      return jsx('element', { type: TYPE_HEADING, level: 1 }, children);
    }
    if (tag === 'h2') {
      return jsx('element', { type: TYPE_HEADING, level: 2 }, children);
    }
    if (tag === 'h3') {
      return jsx('element', { type: TYPE_HEADING, level: 3 }, children);
    }
    if (tag === 'h4') {
      return jsx('element', { type: TYPE_HEADING, level: 4 }, children);
    }
    if (tag === 'h5') {
      return jsx('element', { type: TYPE_HEADING, level: 5 }, children);
    }
    if (tag === 'h6') {
      return jsx('element', { type: TYPE_HEADING, level: 6 }, children);
    }
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_HEADING) {
      return `<h${node.level}>${children}</h${node.level}>`;
    }
  },
};

const onEnter = (
  e: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  nextOnKeyDown?: KeyboardEventHandler<HTMLDivElement>,
) => {
  e.preventDefault();
  if (hasNodeOfType(editor, { type: TYPE_HEADING })) {
    return;
  }
};

export const headingPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_HEADING) {
      switch (element.level) {
        case 1:
          return <h1 {...attributes}>{children}</h1>;
        case 2:
          return <h2 {...attributes}>{children}</h2>;
        case 3:
          return <h3 {...attributes}>{children}</h3>;
        case 4:
          return <h4 {...attributes}>{children}</h4>;
        case 5:
          return <h5 {...attributes}>{children}</h5>;
        case 6:
          return <h6 {...attributes}>{children}</h6>;
        default:
          return nextRenderElement && nextRenderElement(props);
      }
    }
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
