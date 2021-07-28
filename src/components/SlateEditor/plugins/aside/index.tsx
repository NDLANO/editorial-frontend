/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { defaultTextBlockNormalizer } from '../../utils/normalizationHelpers';
import { SlateSerializer } from '../../interfaces';
import SlateAside from './SlateAside';
import { getAsideType } from './utils';

export const TYPE_ASIDE = 'aside';

export interface AsideElement {
  type: 'aside';
  data: {
    type: string;
  };
  children: Descendant[];
}

export const asideSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'aside') return;
    return jsx('element', { type: TYPE_ASIDE, data: getAsideType(el) }, children);
  },
  serialize(node: Descendant, children: (JSX.Element | null)[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== 'aside') return;
    return <aside data-type={node.data.type || ''}>{children}</aside>;
  },
};

export const asidePlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_ASIDE) {
      return (
        <SlateAside editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateAside>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_ASIDE) {
      defaultTextBlockNormalizer(editor, entry, nextNormalizeNode);
    } else {
      nextNormalizeNode(entry);
    }
  };

  return editor;
};
