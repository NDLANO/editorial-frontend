/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import RelatedArticleBox from './RelatedArticleBox';
import { SlateSerializer } from '../../interfaces';
import { createEmbedTag, reduceChildElements } from '../../../../util/embedTagHelpers';
import { addSurroundingParagraphs } from '../../utils/normalizationHelpers';

export const TYPE_RELATED = 'related';

export const defaultRelatedBlock = () => {
  return jsx('element', { type: TYPE_RELATED, data: {} }, { text: '' });
};

interface RelatedInternalArticle {
  resource: string;
  'article-id': string;
}

interface RelatedExternalArticle {
  resource: string;
  url: string;
  title: string;
}

export interface RelatedElement {
  type: 'related';
  data: {
    nodes?: (RelatedInternalArticle | RelatedExternalArticle)[];
  };
  children: Descendant[];
}

export const relatedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== 'div') return;
    const { type } = el.dataset;
    if (type !== 'related-content') return;

    return jsx(
      'element',
      {
        type: TYPE_RELATED,
        data: reduceChildElements(el, type),
      },
      { text: '' },
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_RELATED) return;

    return (
      <div data-type="related-content">
        {node.data.nodes &&
          node.data.nodes.map(child => {
            return createEmbedTag(child);
          })}
      </div>
    );
  },
};

export const relatedPlugin = (editor: Editor) => {
  const { renderElement, isVoid, normalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === 'related') {
      return (
        <RelatedArticleBox
          attributes={attributes}
          element={element}
          editor={editor}
          onRemoveClick={(e: Event) => {
            e.stopPropagation();
            e.preventDefault();
            const path = ReactEditor.findPath(editor, element);
            ReactEditor.focus(editor);
            Transforms.select(editor, path);
            Transforms.removeNodes(editor, { at: path });
          }}>
          {children}
        </RelatedArticleBox>
      );
    }
    return renderElement && renderElement({ attributes, children, element });
  };

  editor.isVoid = element => {
    if (element.type === 'related') {
      return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_RELATED) {
      if (addSurroundingParagraphs(editor, path)) {
        return;
      }
    }
    normalizeNode(entry);
  };

  return editor;
};
