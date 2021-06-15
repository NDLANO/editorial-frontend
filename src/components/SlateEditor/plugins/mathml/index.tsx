/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import isObject from 'lodash/fp/isObject';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import MathEditor from './MathEditor';

export const TYPE_MATHML = 'mathml';

export interface MathmlElement {
  type: 'mathml';
  data: { [key: string]: string };
  children: Descendant[];
}

export const mathmlSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'math') return;
    return jsx(
      'element',
      { type: TYPE_MATHML, data: { ...reduceElementDataAttributes(el), innerHTML: el.innerHTML } },
      [{ text: el.textContent }],
    );
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type !== 'mathml') return;
    const { innerHTML, ...mathAttributes } = node.data;

    const math = document.createElement('math');
    Object.keys(mathAttributes)
      .filter(key => mathAttributes[key] !== undefined && !isObject(mathAttributes[key]))
      .forEach(key => math.setAttribute(`data-${key}`, mathAttributes[key]));

    math.innerHTML = innerHTML;
    return math.outerHTML;
  },
};

export const mathmlPlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, isInline: nextIsInline, isVoid: nextIsVoid } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_MATHML) {
      return (
        <MathEditor element={element} attributes={attributes} editor={editor}>
          {children}
        </MathEditor>
      );
    }
    return nextRenderElement && nextRenderElement(props);
  };

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_MATHML) {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_MATHML) {
      return true;
    }
    return nextIsVoid(element);
  };

  return editor;
};
