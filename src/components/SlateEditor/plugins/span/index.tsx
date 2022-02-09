/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEmpty } from 'lodash';
import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { createProps, reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import Span from './Span';

export interface SpanElement {
  type: 'span';
  data: {
    lang?: string;
    'data-size'?: string;
  };
  children: Descendant[];
}

export const TYPE_SPAN = 'span';

export const spanSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'span') return;

    const attributes = reduceElementDataAttributes(el);

    if (isEmpty(attributes)) return;

    return slatejsx('element', { type: TYPE_SPAN, data: attributes }, children);
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_SPAN) return;
    if (!node.data['data-size'] && !node.data.lang) {
      return <>{children}</>;
    }

    const props = node.data ? createProps(node.data) : {};

    return <span {...props}>{children}</span>;
  },
};

export const spanPlugin = (editor: Editor) => {
  const { renderElement, isInline } = editor;

  editor.renderElement = ({ element, attributes, children }: RenderElementProps) => {
    if (element.type === TYPE_SPAN) {
      return (
        <Span element={element} attributes={attributes}>
          {children}
        </Span>
      );
    } else if (renderElement) {
      return renderElement({ element, attributes, children });
    }
    return undefined;
  };

  editor.isInline = element => {
    if (element.type === TYPE_SPAN) {
      return true;
    }
    return isInline(element);
  };

  return editor;
};
