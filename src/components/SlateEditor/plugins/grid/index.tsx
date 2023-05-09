/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from 'slate';
import { SlateSerializer } from '../../interfaces';
import { jsx as slatejsx } from 'slate-hyperscript';
import { reduceElementDataAttributesV2 } from '../../../../util/embedTagHelpers';
import { RenderElementProps } from 'slate-react';
import { SlateGrid } from './SlateGrid';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_GRID } from './types';

export interface GridElement {
  type: 'grid';
  isFirstEdit: boolean;
  data: {
    columns?: 2 | 4;
    size?: 'small' | 'medium' | 'large';
  };
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
export const gridSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() === 'div') {
      const grid = el as HTMLDivElement;
      const attributes = reduceElementDataAttributesV2(Array.from(grid.attributes));
      return slatejsx(
        'element',
        {
          type: TYPE_GRID,
          data: attributes,
        },
        children,
      );
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (Element.isElement(node) && node.type === TYPE_GRID) {
      return (
        <div data-type={TYPE_GRID} data-size={node.data.size} data-columns={node.data.columns}>
          {children}
        </div>
      );
    }
  },
};

export const gridPlugin = (editor: Editor) => {
  const { renderElement: nextRenderElement, normalizeNode: nextNormalizeNode } = editor;
  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    if (element.type === TYPE_GRID) {
      return (
        <SlateGrid editor={editor} element={element} attributes={attributes}>
          {children}
        </SlateGrid>
      );
    }
    return nextRenderElement?.({ attributes, children, element });
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_GRID) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
