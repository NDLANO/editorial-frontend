/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmbedData, KeyFigureEmbedData } from '@ndla/types-embed';
import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { createEmbedTagV2, reduceElementDataAttributesV2 } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_NDLA_EMBED } from '../embed/types';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_KEY_FIGURE } from './types';
import SlateKeyFigure from './SlateKeyFigure';

export interface KeyFigureElement {
  type: 'key-figure';
  data: KeyFigureEmbedData;
  isFirstEdit?: boolean;
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

export const keyFigureSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(
      Array.from(embed.attributes),
    ) as EmbedData;
    if (embedAttributes.resource !== TYPE_KEY_FIGURE) return;
    return slatejsx('element', { type: TYPE_KEY_FIGURE, data: embedAttributes });
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_KEY_FIGURE || !node.data) return;
    return createEmbedTagV2(node.data);
  },
};

export const keyFigurePlugin = (editor: Editor) => {
  const { renderElement, isVoid, normalizeNode } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_KEY_FIGURE) {
      return (
        <SlateKeyFigure element={element} editor={editor} attributes={attributes}>
          {children}
        </SlateKeyFigure>
      );
    }
    return renderElement?.(props);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_KEY_FIGURE) {
      if (!defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return normalizeNode(entry);
      }
    } else {
      normalizeNode(entry);
    }
  };
  return editor;
};
