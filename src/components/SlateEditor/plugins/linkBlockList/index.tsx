/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from 'slate-hyperscript';
import { Descendant, Editor, Element } from 'slate';
import { NormalizerConfig, defaultBlockNormalizer } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { SlateSerializer } from '../../interfaces';
import { TYPE_LINK_BLOCK_LIST } from './types';
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

export const defaultLinkBlockList = () =>
  slatejsx('element', { type: TYPE_LINK_BLOCK_LIST, data: [], isFirstEdit: true }, { text: '' });

export const linkBlockListSerializer: SlateSerializer = {
  deserialize(el) {
    if (el.tagName.toLowerCase() !== 'nav' || el.dataset.type !== TYPE_LINK_BLOCK_LIST) return;

    return slatejsx(
      'element',
      {
        type: TYPE_LINK_BLOCK_LIST,
        data: Array.from(el.children ?? []).map((el) =>
          reduceElementDataAttributesV2(Array.from(el.attributes)),
        ),
      },
      [{ text: '' }],
    );
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node) || node.type !== TYPE_LINK_BLOCK_LIST) return;
    return (
      <nav data-type={TYPE_LINK_BLOCK_LIST}>
        {node.data?.map((child) => createEmbedTagV2(child))}
      </nav>
    );
  },
};

export const linkBlockListPlugin = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element) => {
    if (element.type === TYPE_LINK_BLOCK_LIST) {
      return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_LINK_BLOCK_LIST) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    normalizeNode(entry);
  };

  return editor;
};
