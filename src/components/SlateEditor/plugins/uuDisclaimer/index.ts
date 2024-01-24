/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { EmbedData } from '@ndla/types-embed';
import { TYPE_DISCLAIMER } from './types';
import { createEmbedTag, reduceElementDataAttributesV2 } from '../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../interfaces';
import { NormalizerConfig, defaultBlockNormalizer } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_NDLA_EMBED } from '../embed/types';
import { TYPE_PARAGRAPH } from '../paragraph/types';

export interface DisclaimerElement {
  type: 'disclaimer-block';
  data?: EmbedData;
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

export const disclaimerSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    if (embedAttributes.resource !== TYPE_DISCLAIMER) return;
    return slatejsx('element', { type: TYPE_DISCLAIMER, data: embedAttributes }, { text: '' });
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_DISCLAIMER || !node.data) return;
    return createEmbedTag(node.data);
  },
};

export const disclaimerPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_DISCLAIMER) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) return;
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
