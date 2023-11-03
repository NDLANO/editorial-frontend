/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { TYPE_PARAGRAPH } from '../paragraph/types';
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
    if (embedAttributes.resource !== TYPE_BLOGPOST) return;
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
    if (!Element.isElement(node) || node.type !== TYPE_BLOGPOST || !node.data) return;
    return createEmbedTagV2(node.data);
  },
};

export const blogPostPlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, isVoid: nextIsVoid } = editor;

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_BLOGPOST) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  editor.isVoid = (element) => (element.type === TYPE_BLOGPOST ? true : nextIsVoid(element));

  return editor;
};
