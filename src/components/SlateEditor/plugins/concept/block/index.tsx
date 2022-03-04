/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import { createEmbedTag, reduceElementDataAttributes } from '../../../../../util/embedTagHelpers';
import { SlateSerializer } from '../../../interfaces';
import { defaultBlockNormalizer, NormalizerConfig } from '../../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../../paragraph/types';
import BlockConcept from './BlockConcept';
import { TYPE_CONCEPT_BLOCK } from './types';

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
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'embed') return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributes(embed);
    if (embedAttributes.resource !== 'concept' || embedAttributes.type !== 'block') return;
    return slatejsx(
      'element',
      {
        type: TYPE_CONCEPT_BLOCK,
        data: embedAttributes,
      },
      { text: '' },
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_CONCEPT_BLOCK) return;

    const data = {
      ...node.data,
    };

    return createEmbedTag(data);
  },
};

export const blockConceptPlugin = (locale: string) => (editor: Editor) => {
  const { renderElement, isVoid, normalizeNode } = editor;

  editor.renderElement = (props: RenderElementProps) => {
    const { element, attributes, children } = props;
    if (element.type === TYPE_CONCEPT_BLOCK) {
      return (
        <BlockConcept attributes={attributes} element={element} editor={editor} locale={locale}>
          {children}
        </BlockConcept>
      );
    }
    return renderElement && renderElement(props);
  };

  editor.normalizeNode = entry => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_CONCEPT_BLOCK) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    normalizeNode(entry);
  };

  editor.isVoid = element => {
    if (element.type === TYPE_CONCEPT_BLOCK) {
      return true;
    }
    return isVoid(element);
  };

  return editor;
};
