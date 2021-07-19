/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { KeyboardEvent } from 'react';
import { Descendant, Editor, Element, Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import Footnote from './Footnote';
import { reduceElementDataAttributes, createEmbedTag } from '../../../../util/embedTagHelpers';

export const TYPE_FOOTNOTE = 'footnote';
const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';

export interface FootnoteElement {
  type: 'footnote';
  data: {
    authors: string[];
    title: string;
    year: string;
    resource: string;
    edition: string;
    publisher: string;
    type?: string;
  };
  children: Descendant[];
}

export const footnoteSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'embed') return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== 'footnote') return;
    return jsx(
      'element',
      {
        type: TYPE_FOOTNOTE,
        data: {
          ...embedAttributes,
          authors: embedAttributes.authors ? embedAttributes.authors.split(';') : [],
        },
      },
      [{ text: '[#]' }],
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_FOOTNOTE) return;
    const data = {
      ...node.data,
      authors: node.data.authors ? node.data.authors.join(';') : '',
    };

    return createEmbedTag(data);
  },
};

export const footnotePlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    isInline: nextIsInline,
    isVoid: nextIsVoid,
    onKeyDown: nextOnKeyDown,
  } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_FOOTNOTE) {
      return (
        <Footnote element={element} attributes={attributes} editor={editor}>
          {children}
        </Footnote>
      );
    }
    return nextRenderElement && nextRenderElement(props);
  };

  editor.isInline = (element: Element) => {
    if (element.type === TYPE_FOOTNOTE) {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_FOOTNOTE) {
      return true;
    }
    return nextIsVoid(element);
  };

  editor.onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === KEY_BACKSPACE || e.key === KEY_DELETE) {
      if (editor.selection) {
        const [selected] = Editor.parent(editor, Editor.unhangRange(editor, editor.selection));

        if (Element.isElement(selected) && selected.type === 'footnote') {
          e.preventDefault();
          Transforms.removeNodes(editor, {
            at: Editor.unhangRange(editor, editor.selection),
            match: node => Element.isElement(node) && node.type === 'footnote',
          });
          return;
        }
      }
    }
    nextOnKeyDown && nextOnKeyDown(e);
  };

  return editor;
};
