/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmbedData, KeyNumberEmbedData } from '@ndla/types-embed';
import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { createEmbedTagV2, reduceElementDataAttributesV2 } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_NDLA_EMBED } from '../embed/types';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_KEY_NUMBER } from './types';
import SlateKeyNumber from './SlateKeyNumber';

export interface KeyNumberElement {
  type: 'key-number';
  data: KeyNumberEmbedData;
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

export const keyNumberSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(
      Array.from(embed.attributes),
    ) as EmbedData;
    if (embedAttributes.resource !== 'key-number') return;
    return slatejsx('element', { type: TYPE_KEY_NUMBER, data: embedAttributes });
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_KEY_NUMBER) return;
    return createEmbedTagV2(node.data);
  },
};

export const keyNumberPlugin = (editor: Editor) => {
  const { renderElement, isVoid, normalizeNode } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_KEY_NUMBER) {
      return (
        <SlateKeyNumber element={element} editor={editor} attributes={attributes}>
          {children}
        </SlateKeyNumber>
      );
    }
    return renderElement?.(props);
  };

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_KEY_NUMBER) {
      return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_KEY_NUMBER) {
      if (!defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return normalizeNode(entry);
      }
    } else {
      normalizeNode(entry);
    }

    return editor;
  };
  return editor;
};
