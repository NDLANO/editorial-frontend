/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RenderElementProps } from 'slate-react';
import { jsx as slatejsx } from 'slate-hyperscript';
import { Descendant, Editor, Element, Text, Node, Transforms } from 'slate';
import { SlateSerializer } from '../../interfaces';
import Link from './Link';
import { reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { TYPE_CONTENT_LINK, TYPE_LINK } from './types';

export interface LinkElement {
  type: 'link';
  href: string;
  target?: string;
  title?: string;
  rel?: string;
  children: Descendant[];
}

export interface ContentLinkElement {
  type: 'content-link';
  'content-type': string;
  'content-id': string;
  'open-in': string;
  children: Descendant[];
}

export const linkSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === 'a') {
      const a = el as HTMLLinkElement;
      return slatejsx(
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
    if (tag === 'ndlaembed') {
      const embed = el as HTMLEmbedElement;
      const embedAttributes = reduceElementDataAttributes(embed);
      if (embedAttributes.resource !== 'content-link') return;
      return slatejsx(
        'element',
        {
          type: TYPE_CONTENT_LINK,
          'content-type': embedAttributes['content-type'],
          'open-in': embedAttributes['open-in'],
          'content-id': embedAttributes['content-id'],
        },
        children,
      );
    }
    return;
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_LINK) {
      return (
        <a href={node.href} target={node.target} title={node.title} rel={node.rel}>
          {children}
        </a>
      );
    }
    if (node.type === TYPE_CONTENT_LINK) {
      return (
        <ndlaembed
          data-content-id={node['content-id']}
          data-open-in={node['open-in']}
          data-resource="content-link"
          data-content-type={node['content-type']}>
          {children}
        </ndlaembed>
      );
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
        for (const [index, child] of node.children.entries()) {
          if (!Text.isText(child)) {
            return Transforms.unwrapNodes(editor, { at: [...path, index] });
          }
        }
        if (Node.string(node) === '') {
          return Transforms.removeNodes(editor, { at: path });
        }
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
