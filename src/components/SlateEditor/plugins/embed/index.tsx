/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Descendant, Element } from 'slate';
import { RenderElementProps } from 'slate-react';
import SlateFigure from './SlateFigure';
import { SlateSerializer } from '../../interfaces';
import { LocaleType, Embed } from '../../../../interfaces';
import { createEmbedTag, parseEmbedTag } from '../../../../util/embedTagHelpers';
import { defaultEmbedBlock } from './utils';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_EMBED } from './types';

export interface EmbedElement {
  type: 'embed';
  data: Embed;
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

export const embedSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_EMBED) return;
    return defaultEmbedBlock((parseEmbedTag(el.outerHTML) as unknown) as Embed);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_EMBED) return;
    return createEmbedTag(node.data);
  },
};

export const embedPlugin = (language: string, locale?: LocaleType, disableNormalize?: boolean) => (
  editor: Editor,
) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    isVoid: nextIsVoid,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_EMBED) {
      return (
        <SlateFigure
          attributes={attributes}
          editor={editor}
          element={element}
          language={language}
          locale={locale}>
          {children}
        </SlateFigure>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_EMBED) {
      if (!disableNormalize && defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_EMBED) {
      return true;
    }
    return nextIsVoid(element);
  };

  return editor;
};
