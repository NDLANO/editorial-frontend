/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx as slatejsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import MathEditor from './MathEditor';
import { TYPE_MATHML } from './types';
import { KEY_ARROW_DOWN, KEY_ARROW_UP } from '../../utils/keys';
import { onArrowDown, onArrowUp } from './utils';

export interface MathmlElement {
  type: 'mathml';
  data: { [key: string]: string };
  children: Descendant[];
}

export const mathmlSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'math') return;
    return slatejsx(
      'element',
      { type: TYPE_MATHML, data: { ...reduceElementDataAttributes(el), innerHTML: el.innerHTML } },
      [{ text: el.textContent }],
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== 'mathml') return;
    const { innerHTML, ...mathAttributes } = node.data;

    return (
      // @ts-ignore math does not exist in JSX, but this hack works by setting innerHTML manually.
      <math
        {...mathAttributes}
        dangerouslySetInnerHTML={{
          __html: innerHTML,
        }}
      />
    );
  },
};

export const mathmlPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    isInline: nextIsInline,
    isVoid: nextIsVoid,
    onKeyDown,
  } = editor;

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

  editor.onKeyDown = e => {
    if (e.key === KEY_ARROW_UP) {
      onArrowUp(e, editor, onKeyDown);
    } else if (e.key === KEY_ARROW_DOWN) {
      onArrowDown(e, editor, onKeyDown);
    } else if (onKeyDown) {
      onKeyDown(e);
    }
  };

  return editor;
};
