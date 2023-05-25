/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Transforms } from 'slate';
import { colors, spacing } from '@ndla/core';
import { RenderElementProps } from 'slate-react';
import styled from '@emotion/styled';
import { jsx as slatejsx } from 'slate-hyperscript';
import { reduceElementDataAttributesV2 } from '../../../../util/embedTagHelpers';
import { SlateGrid } from './SlateGrid';
import { defaultBlockNormalizer, NormalizerConfig } from '../../utils/defaultNormalizer';
import { SlateSerializer } from '../../interfaces';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { TYPE_PARAGRAPH } from '../paragraph/types';
import { TYPE_GRID, TYPE_GRID_CELL } from './types';
import { defaultGridCellBlock } from './utils';
import { TYPE_EMBED_IMAGE } from '../embed/types';
import { TYPE_BLOGPOST } from '../blogPost/types';

export interface GridElement {
  type: 'grid';
  data: {
    columns?: '2' | '4';
  };
  children: Descendant[];
}

export interface GridCellElement {
  type: 'grid-cell';
  children: Descendant[];
}

const StyledGridCell = styled.div`
  border: 1px solid ${colors.brand.light};
  width: 100%;
  min-width: 200px;

  > p {
    padding: 0 ${spacing.xxsmall};
  }
`;

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  nodes: {
    allowed: [TYPE_GRID_CELL],
    defaultType: TYPE_GRID_CELL,
  },
};

const normalizerConfigGridCell: NormalizerConfig = {
  nodes: {
    allowed: [TYPE_BLOGPOST, TYPE_PARAGRAPH, TYPE_EMBED_IMAGE],
    defaultType: TYPE_PARAGRAPH,
  },
};

export const gridSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    if (el.tagName.toLowerCase() !== 'div') return;
    if (el.dataset.type === TYPE_GRID) {
      const grid = el as HTMLDivElement;
      const attributes = reduceElementDataAttributesV2(Array.from(grid.attributes));

      return slatejsx(
        'element',
        {
          type: TYPE_GRID,
          data: attributes,
        },
        children
          .map((child) => slatejsx('element', { type: TYPE_GRID_CELL }, child))
          .concat(Array(4 - children.length).fill(defaultGridCellBlock()))
          .slice(0, 4),
      );
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (Element.isElement(node) && node.type === TYPE_GRID) {
      return (
        <div data-type={TYPE_GRID} data-columns={node.data.columns}>
          {children}
        </div>
      );
    } else if (Element.isElement(node) && node.type === TYPE_GRID_CELL) {
      return <>{children}</>;
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
    } else if (element.type === TYPE_GRID_CELL) {
      return <StyledGridCell {...attributes}>{children}</StyledGridCell>;
    }
    return nextRenderElement?.({ attributes, children, element });
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;
    if (Element.isElement(node) && node.type === TYPE_GRID) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    } else if (Element.isElement(node) && node.type === TYPE_GRID_CELL) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfigGridCell)) {
        return;
      }
    }

    nextNormalizeNode(entry);
  };

  return editor;
};
