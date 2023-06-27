/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Element, Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { GridType } from '@ndla/ui';
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
import StyledGridCell from './SlateGridCell';
import { defaultParagraphBlock } from '../paragraph/utils';
import { TYPE_HEADING } from '../heading/types';
import { TYPE_LIST } from '../list/types';

export interface GridElement {
  type: 'grid';
  data: GridType;
  children: Descendant[];
}

export interface GridCellElement {
  type: 'grid-cell';
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
  nodes: {
    allowed: [TYPE_GRID_CELL],
    defaultType: TYPE_GRID_CELL,
  },
};

const normalizerConfigGridCell: NormalizerConfig = {
  nodes: {
    allowed: [TYPE_BLOGPOST, TYPE_PARAGRAPH, TYPE_EMBED_IMAGE, TYPE_HEADING, TYPE_LIST],
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
          data: {
            columns: attributes['columns'],
            border: attributes['border'],
            background: attributes['background'],
          },
        },
        children.map((child) => {
          const children = Element.isElement(child) ? child.children : defaultParagraphBlock();
          return slatejsx('element', { type: TYPE_GRID_CELL }, children);
        }),
      );
    }
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (Element.isElement(node) && node.type === TYPE_GRID) {
      return (
        <div
          data-type={TYPE_GRID}
          data-columns={node.data.columns}
          data-border={node.data.border}
          data-background={node.data.background}
        >
          {children.filter((child) => React.Children.count(child.props?.['children']) > 0)}
        </div>
      );
    } else if (Element.isElement(node) && node.type === TYPE_GRID_CELL) {
      return <div>{children}</div>;
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
    const [node, path] = entry;
    if (Element.isElement(node) && node.type === TYPE_GRID) {
      const columns = node.data.columns === '2x2' ? 4 : Number(node.data.columns);
      if (node.children.length < columns) {
        Transforms.insertNodes(
          editor,
          Array(columns - node.children.length)
            .fill(undefined)
            .map(() => defaultGridCellBlock()),
          { at: [...path, node.children.length] },
        );
      } else if (node.children.length > columns) {
        Editor.withoutNormalizing(editor, () => {
          Array(node.children.length - columns)
            .fill(undefined)
            .forEach((_, index) =>
              Transforms.removeNodes(editor, { at: [...path, node.children.length - 1 - index] }),
            );
        });
      }

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
