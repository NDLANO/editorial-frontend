/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element } from 'slate';
import { jsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { defaultTextBlockNormalizer } from '../../utils/normalizationHelpers';
import { SlateSerializer } from '../../interfaces';
import SlateBodybox from './SlateBodybox';

export const TYPE_BODYBOX = 'bodybox';

export interface BodyboxElement {
  type: 'bodybox';
  children: Descendant[];
}

export const bodyboxSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== 'div') return;
    if (el.className === 'c-bodybox') {
      return jsx('element', { type: TYPE_BODYBOX }, children);
    }
  },
  serialize(node: Descendant, children: (JSX.Element | null)[]) {
    if (!Element.isElement(node) || node.type !== TYPE_BODYBOX) return;
    return <div className="c-bodybox">{children}</div>;
  },
};

export const bodyboxPlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_BODYBOX) {
      return (
        <SlateBodybox editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateBodybox>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_BODYBOX) {
      defaultTextBlockNormalizer(editor, entry, nextNormalizeNode);
    } else {
      nextNormalizeNode(entry);
    }
  };

  return editor;
};
