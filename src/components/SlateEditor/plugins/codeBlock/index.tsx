/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element, Path, Transforms, Node } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import CodeBlock from './CodeBlock';
import { SlateSerializer } from '../../interfaces';
import { addSurroundingParagraphs } from '../../utils/normalizationHelpers';
import { createEmbedTag, reduceElementDataAttributes } from '../../../../util/embedTagHelpers';

export const TYPE_CODEBLOCK = 'code-block';

export interface CodeblockElement {
  type: 'code-block';
  data: {
    'code-block': {
      code?: string;
      format?: string;
      title?: string;
    };
    'code-format': string;
    'code-content': string;
    title: string;
  };
  children: Descendant[];
}

export const codeblockSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (!el.tagName.toLowerCase().startsWith('embed')) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== 'code-block') return;
    return jsx('element', { type: TYPE_CODEBLOCK, data: { ...embedAttributes } }, [{ text: '' }]);
  },
  serialize(node: Descendant, children: (JSX.Element | null)[]) {
    if (!Element.isElement(node) || node.type !== 'code-block') return;

    const { data } = node;
    const props = {
      resource: 'code-block',
      'code-content': data['code-block']?.code || data['code-content'],
      'code-format': data['code-block']?.format || data['code-format'],
      title: data['code-block']?.title || data.title,
    };

    return createEmbedTag(props);
  },
};

export const codeblockPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    isVoid: nextIsVoid,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_CODEBLOCK) {
      return (
        <CodeBlock editor={editor} element={element} attributes={attributes}>
          {children}
        </CodeBlock>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node, path] = entry;

    if (Element.isElement(node) && node.type === TYPE_CODEBLOCK) {
      for (const [child, childPath] of Node.children(editor, path)) {
        if (!Path.hasPrevious(childPath)) {
          // Unwrap element if it exists
          if (Element.isElement(child)) {
            Transforms.unwrapNodes(editor, { at: childPath });
            return;
          }
        }
      }

      if (addSurroundingParagraphs(editor, path)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = element => {
    if (Element.isElement(element) && element.type === TYPE_CODEBLOCK) {
      return true;
    } else {
      return nextIsVoid(element);
    }
  };

  return editor;
};
