/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx as slatejsx } from 'slate-hyperscript';
import CodeBlock from './CodeBlock';
import { SlateSerializer } from '../../interfaces';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { createEmbedTag, reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { TYPE_PARAGRAPH } from '../paragraph/utils';

export const TYPE_CODEBLOCK = 'code-block';

export interface CodeblockElement {
  type: 'code-block';
  data: {
    'code-block'?: {
      code?: string;
      format?: string;
      title?: string;
    };
    'code-format': string;
    'code-content': string;
    resource: string;
    title: string;
  };
  isFirstEdit: boolean;
  children: Descendant[];
}

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

export const codeblockSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (!el.tagName.toLowerCase().startsWith('embed')) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== 'code-block') return;
    return slatejsx(
      'element',
      { type: TYPE_CODEBLOCK, data: { ...embedAttributes }, isFirstEdit: false },
      [{ text: '' }],
    );
  },
  serialize(node: Descendant) {
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
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_CODEBLOCK) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
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
