/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Editor, Element, Descendant } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';

export const TYPE_DIV = 'div';

export interface DivElement {
  type: 'div';
  data?: {
    align?: string;
  };
  children: Descendant[];
}

export const divSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'div') return;

    return jsx(
      'element',
      {
        type: TYPE_DIV,
      },
      children,
    );
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_DIV) return;

    /**
      We insert empty p tag throughout the document to enable positioning the cursor
      between element with no spacing (i.e two images). We need to remove these element
      on seriaization.
     */

    return <div>{children}</div>;
  },
};

export const divPlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_DIV) {
      return <div {...attributes}>{children}</div>;
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  return editor;
};
