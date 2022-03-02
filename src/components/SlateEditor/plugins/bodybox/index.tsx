/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { jsx as slatejsx } from 'slate-hyperscript';
import { RenderElementProps } from 'slate-react';
import {
  afterOrBeforeTextBlockElement,
  firstTextBlockElement,
  lastTextBlockElement,
  textBlockElements,
} from '../../utils/normalizationHelpers';
import { SlateSerializer } from '../../interfaces';
import SlateBodybox from './SlateBodybox';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_BODYBOX } from './types';

export interface BodyboxElement {
  type: 'bodybox';
  children: Descendant[];
}

const normalizerConfig: NormalizerConfig = {
  nodes: {
    allowed: textBlockElements,
    defaultType: TYPE_PARAGRAPH,
  },
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  firstNode: {
    allowed: firstTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  lastNode: {
    allowed: lastTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

export const bodyboxSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: (Descendant | null)[]) {
    if (el.tagName.toLowerCase() !== 'div') return;
    if (el.className === 'c-bodybox') {
      return slatejsx('element', { type: TYPE_BODYBOX }, children);
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node) || node.type !== TYPE_BODYBOX) return;
    return <div className="c-bodybox">{children}</div>;
  },
};

export const bodyboxPlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_BODYBOX) {
      return (
        <SlateBodybox editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateBodybox>
      );
    } else if (nextRenderElement) {
      return nextRenderElement({ attributes, children, element });
    }
    return undefined;
  };

  editor.normalizeNode = entry => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_BODYBOX) {
      if (!defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return nextNormalizeNode(entry);
      }
    } else {
      nextNormalizeNode(entry);
    }
  };

  return editor;
};
