/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  afterTextBlockElement,
  firstTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from '../../utils/normalizationHelpers';
import React from 'react';
import { Descendant, Editor, Element, Node, Path, Text, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { SlateSerializer } from '../../interfaces';
import SlateAside from './SlateAside';
import { getAsideType } from './utils';
import { TYPE_PARAGRAPH } from '../paragraph';

export const TYPE_ASIDE = 'aside';

export interface AsideElement {
  type: 'aside';
  data: {
    type: string;
  };
  children: Descendant[];
}

export const asideSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== 'aside') return;
    return jsx('element', { type: TYPE_ASIDE, data: getAsideType(el) }, children);
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type !== 'aside') return;
    return `<aside data-type="${node.data.type || ''}">${children}</aside>`;
  },
};

export const asidePlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_ASIDE) {
      return (
        <SlateAside editor={editor} element={element}>
          {children}
        </SlateAside>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_ASIDE) {
      if (node.children.length === 0) {
        Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]), {
          at: [...path, 0],
        });
        return;
      }

      const firstChild = node.children[0];
      if (Element.isElement(firstChild)) {
        if (!firstTextBlockElement.includes(firstChild.type)) {
          Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]), {
            at: [...path, 0],
          });
          return;
        }
      }

      const lastChild = node.children[node.children.length - 1];
      if (Element.isElement(lastChild)) {
        if (!lastTextBlockElement.includes(lastChild.type)) {
          Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }, [{ text: '' }]), {
            at: [...path, node.children.length],
          });
          return;
        }
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        if (Text.isText(child)) {
          Transforms.wrapNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), { at: childPath });
          return;
        }
        if (Element.isElement(child) && !textBlockElements.includes(child.type)) {
          Transforms.unwrapNodes(editor, {
            at: childPath,
          });
          return;
        }
      }

      const next = Editor.next(editor, { at: path });
      if (next) {
        const [nextNode, nextPath] = next;
        if (!Element.isElement(nextNode) || !afterTextBlockElement.includes(nextNode.type)) {
          Transforms.wrapNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), { at: nextPath });
          return;
        }
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
