/*
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import {
  createEmbedTagV2,
  reduceElementDataAttributesV2,
} from '../../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../../interfaces';
import { defaultBlockNormalizer, NormalizerConfig } from '../../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../../utils/normalizationHelpers';
import { TYPE_NDLA_EMBED } from '../../embed/types';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import BlockWrapper from './BlockWrapper';
import { TYPE_CONCEPT_BLOCK, TYPE_GLOSS_BLOCK } from './types';

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

export const blockConceptSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
    if (embedAttributes.resource === 'concept' && embedAttributes.type === 'block') {
      return slatejsx(
        'element',
        {
          type: embedAttributes.conceptType === 'concept' ? TYPE_CONCEPT_BLOCK : TYPE_GLOSS_BLOCK,
          data: embedAttributes,
        },
        { text: '' },
      );
    }
  },
  serialize(node: Descendant) {
    if (
      !Element.isElement(node) ||
      (node.type !== TYPE_CONCEPT_BLOCK && node.type !== TYPE_GLOSS_BLOCK)
    )
      return;
    return createEmbedTagV2(node.data);
  },
};

export const blockConceptPlugin = (locale: string) => (editor: Editor) => {
  const { renderElement, isVoid, normalizeNode } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_CONCEPT_BLOCK || element.type === TYPE_GLOSS_BLOCK) {
      return (
        <BlockWrapper attributes={attributes} element={element} editor={editor} locale={locale}>
          {children}
        </BlockWrapper>
      );
    }
    return renderElement?.(props);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (
      Element.isElement(node) &&
      (node.type === TYPE_CONCEPT_BLOCK || node.type === TYPE_GLOSS_BLOCK)
    ) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    normalizeNode(entry);
  };

  editor.isVoid = (element) => {
    if (element.type === TYPE_CONCEPT_BLOCK || element.type === TYPE_GLOSS_BLOCK) {
      return true;
    }
    return isVoid(element);
  };

  return editor;
};
