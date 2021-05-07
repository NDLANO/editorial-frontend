/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RenderElementProps } from 'new-slate-react';
import { jsx } from 'new-slate-hyperscript';
import { Descendant, Editor, Element, Text, Node, Transforms } from 'new-slate';
import { SlateSerializer } from '../../interfaces';
import Link from './Link';
import { reduceElementDataAttributes } from '../../../../util/embedTagHelpers';

export const TYPE_LINK = 'link';
export const TYPE_CONTENT_LINK = 'content-link';

export interface LinkElement {
  type: 'link';
  href: string;
  target?: string;
  title?: string;
  rel?: string;
  children: Text[];
}

// TODO: change to data: {content-type, content-id, open-in}
export interface ContentLinkElement {
  type: 'content-link';
  'content-type': string;
  'content-id': string;
  'open-in': string;
  children: Text[];
}

export const linkSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'a') {
      const a = el as HTMLLinkElement;
      return jsx(
        'element',
        {
          type: TYPE_LINK,
          href: a.href ?? '#',
          target: a.target !== '' ? a.target : undefined,
          title: a.title !== '' ? a.title : undefined,
          rel: a.rel !== '' ? a.rel : undefined,
        },
        children,
      );
    }
    if (tag === 'embed') {
      const embed = el as HTMLEmbedElement;
      const embedAttributes = reduceElementDataAttributes(embed);
      if (embedAttributes.resource !== 'content-link') return;
      return jsx(
        'element',
        {
          type: TYPE_CONTENT_LINK,
          'content-type': embedAttributes['content-type'],
          'open-in': embedAttributes['open-in'],
          'content-id': embedAttributes['content-id'],
        },
        [
          {
            text:
              embedAttributes['link-text'] === ''
                ? 'Ukjent link tekst'
                : embedAttributes['link-text'],
          },
        ],
      );
    }
    return;
  },
  serialize(node: Descendant, children: string) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_LINK) {
      return `<a href="${node.href}" target="${node.target}" title="${node.title}" rel="${node.rel}">${children}</a>`;
    }
    if (node.type === TYPE_CONTENT_LINK) {
      return `<embed
          data-content-id="${node['content-id']}"
          data-link-text="${Node.string(node)}"
          data-open-in="${node['open-in']}"
          data-resource="content-link"
          data-content-type="${node['content-type']}"
        />`;
    }
  },
};

export const linkPlugin = (language: string) => (editor: Editor) => {
  const {
    isInline: nextIsInline,
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
  } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === 'link' || element.type === 'content-link') {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.renderElement = (props: RenderElementProps) => {
    const { children, element, attributes } = props;
    if (element.type === 'link' || element.type === 'content-link') {
      return (
        <Link element={element} attributes={attributes} editor={editor} language={language}>
          {children}
        </Link>
      );
    } else if (nextRenderElement) {
      return nextRenderElement(props);
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element.isElement(node)) {
      if (node.type === 'content-link' || node.type === 'link') {
        node.children.forEach((child, index) => {
          if (!Text.isText(child)) {
            Transforms.delete(editor, { at: [...path, index] });
            return;
          }
        });
      }
      if (node.type === 'content-link') {
        node.children.forEach(child => {
          if (
            child.bold ||
            child.code ||
            child.italic ||
            child.sub ||
            child.sup ||
            child.underlined
          ) {
            Transforms.unsetNodes(editor, ['bold', 'code', 'italic', 'sub', 'sup', 'underlined'], {
              at: path,
              match: node => Text.isText(node),
            });
            return;
          }
        });
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
