/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import SlateBlogPost from './SlateBlogPost';
import { TYPE_BLOGPOST } from './types';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { SlateSerializer } from '../../interfaces';
import { TYPE_NDLA_EMBED } from '../embed/types';
import { createEmbedTagV2, reduceElementDataAttributesV2 } from '../../../../util/embedTagHelpers';

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

export const blogPostSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    if (embedAttributes.resource !== 'blog-post') return;
    return slatejsx(
      'element',
      {
        type: TYPE_BLOGPOST,
        data: embedAttributes,
      },
      { text: '' },
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== 'blog-post' || !node.data) return;
    return createEmbedTagV2(node.data);
  },
};

export const blogPostPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    isVoid: nextIsVoid,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_BLOGPOST) {
      return (
        <SlateBlogPost editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateBlogPost>
      );
    }
    return nextRenderElement?.({ attributes, children, element });
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_BLOGPOST) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element) => {
    if (Element.isElement(element) && element.type === TYPE_BLOGPOST) {
      return true;
    } else {
      return nextIsVoid(element);
    }
  };
  return editor;
};