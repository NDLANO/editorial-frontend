/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { ContactBlockEmbedData } from '@ndla/types-embed';
import { createEmbedTag, reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import { TYPE_NDLA_EMBED } from '../embed/types';
import { TYPE_CONTACT_BLOCK } from './types';
import SlateContactBlock from './SlateContactBlock';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/types';

export interface ContactBlockElement {
  type: 'contact-block';
  data?: ContactBlockEmbedData;
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

export const contactBlockSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== TYPE_CONTACT_BLOCK) return;
    return slatejsx(
      'element',
      { type: TYPE_CONTACT_BLOCK, data: { ...embedAttributes }, isFirstEdit: false },
      [{ text: '' }],
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_CONTACT_BLOCK || !node.data) return;
    const props = {
      resource: 'contact-block',
    };
    return createEmbedTag(props);
  },
};

export const contactBlockPlugin = (editor: Editor) => {
  const {
    renderElement: nextRenderElement,
    normalizeNode: nextNormalizeNode,
    isVoid: nextIsVoid,
  } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_CONTACT_BLOCK) {
      return (
        <SlateContactBlock editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateContactBlock>
      );
    }
    return nextRenderElement?.({ attributes, children, element });
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_CONTACT_BLOCK) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element) => {
    if (Element.isElement(element) && element.type === TYPE_CONTACT_BLOCK) {
      return true;
    }
    return nextIsVoid(element);
  };
  return editor;
};
