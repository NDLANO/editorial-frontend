/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';
import { Descendant, Editor, Element, NodeEntry, Path, Transforms } from 'slate';
import { RenderElementProps } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { jsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import {
  reduceElementDataAttributes,
  removeEmptyElementDataAttributes,
} from '../../../../util/embedTagHelpers';
import SlateTable from './SlateTable';
import {
  defaultTableCellBlock,
  defaultTableRowBlock,
  TYPE_TABLE,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CELL,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from './utils';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { addSurroundingParagraphs } from '../../utils/normalizationHelpers';
import { defaultParagraphBlock } from '../paragraph/utils';
import { normalizeTableBodyAsMatrix } from './matrix';
import { handleTableKeydown } from './handleKeyDown';

export const KEY_ARROW_UP = 'ArrowUp';
export const KEY_ARROW_DOWN = 'ArrowDown';
export const KEY_TAB = 'Tab';
export const KEY_BACKSPACE = 'Backspace';
export const KEY_DELETE = 'Delete';

const validKeys = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_TAB, KEY_BACKSPACE, KEY_DELETE];

export interface TableElement {
  type: 'table';
  children: Descendant[];
}

export interface TableHeadElement {
  type: 'table-head';
  children: Descendant[];
}

export interface TableBodyElement {
  type: 'table-body';
  children: Descendant[];
}

export interface TableRowElement {
  type: 'table-row';
  children: Descendant[];
}

export interface TableCellElement {
  type: 'table-cell';
  data: {
    rowspan?: number;
    colspan?: number;
    align?: string;
    valign?: string;
    class?: string;
    isHeader: boolean;
  };
  children: Descendant[];
}

export const TABLE_TAGS: { [key: string]: string } = {
  th: 'table-cell',
  tr: 'table-row',
  td: 'table-cell',
};

export const tableSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    const tagName = el.tagName.toLowerCase();
    if (tagName === 'table') {
      return jsx('element', { type: TYPE_TABLE }, children);
    }
    if (tagName === 'tr') {
      return jsx('element', { type: TYPE_TABLE_ROW }, children);
    }

    if (tagName === 'thead') {
      return jsx('element', { type: TYPE_TABLE_HEAD }, children);
    }

    if (tagName === 'tbody') {
      return jsx('element', { type: TYPE_TABLE_BODY }, children);
    }

    const tableTag = TABLE_TAGS[tagName];
    if (!tableTag) return;
    let data: object = {
      isHeader: tagName === 'th',
    };
    if (tagName === 'th' || tagName === 'td') {
      const filter = ['rowspan', 'colspan', 'align', 'valign', 'class'];
      const attrs = reduceElementDataAttributes(el, filter);
      const colspan = attrs.colspan && parseInt(attrs.colspan);
      const rowspan = attrs.rowspan && parseInt(attrs.rowspan);
      data = {
        ...attrs,
        colspan: colspan > 1 ? colspan : undefined,
        rowspan: rowspan > 1 ? rowspan : undefined,
        isHeader: tagName === 'th',
      };
    }
    return jsx('element', { type: tableTag, data }, children);
  },
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (
      ![TYPE_TABLE, TYPE_TABLE_HEAD, TYPE_TABLE_BODY, TYPE_TABLE_ROW, TYPE_TABLE_CELL].includes(
        node.type,
      )
    )
      return;

    if (node.type === TYPE_TABLE_HEAD) {
      return <thead>{children}</thead>;
    }

    if (node.type === TYPE_TABLE_BODY) {
      return <tbody>{children}</tbody>;
    }

    if (node.type === TYPE_TABLE) {
      const ret = <table>{children}</table>;
      return ret;
    }
    if (node.type === TYPE_TABLE_ROW) {
      return <tr>{children}</tr>;
    }
    if (node.type === TYPE_TABLE_CELL) {
      const data = node.data;
      const props = removeEmptyElementDataAttributes({ ...data });
      delete props.isHeader;
      if (node.data.isHeader) {
        return <th {...props}>{children}</th>;
      }
      return <td {...props}>{children}</td>;
    }
  },
};

export const tablePlugin = (editor: Editor) => {
  const { renderElement, normalizeNode, onKeyDown } = editor;

  editor.renderElement = ({ attributes, children, element }: RenderElementProps) => {
    switch (element.type) {
      case TYPE_TABLE:
        return (
          <SlateTable editor={editor} element={element} attributes={attributes}>
            {children}
          </SlateTable>
        );
      case TYPE_TABLE_ROW:
        return <tr {...attributes}>{children}</tr>;
      case TYPE_TABLE_CELL:
        return (
          <td
            className={element.data.isHeader ? 'c-table__header' : ''}
            rowSpan={element.data.rowspan}
            colSpan={element.data.colspan}
            {...attributes}>
            {children}
          </td>
        );
      case TYPE_TABLE_HEAD:
        return <thead {...attributes}>{children}</thead>;
      case TYPE_TABLE_BODY:
        return <tbody {...attributes}>{children}</tbody>;
      default:
        return renderElement && renderElement({ attributes, children, element });
    }
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element.isElement(node)) {
      if (node.type === TYPE_TABLE) {
        if (addSurroundingParagraphs(editor, path)) {
          return;
        }
      }
      if (node.type === TYPE_TABLE_HEAD || node.type === TYPE_TABLE_BODY) {
        const bodyNodes = node.children;

        // If head or body contains non-row element, wrap it with row element
        for (const [index, child] of bodyNodes.entries()) {
          if (!Element.isElement(child) || child.type !== TYPE_TABLE_ROW) {
            return Transforms.wrapNodes(editor, defaultTableRowBlock(0), {
              at: [...path, index],
            });
          }
        }

        // Go to next normalizer if first child is invalid.
        const firstRow = bodyNodes[0];
        if (!Element.isElement(firstRow) || firstRow.type !== TYPE_TABLE_ROW) {
          return normalizeNode(entry);
        }

        if (normalizeTableBodyAsMatrix(editor, node, path)) {
          return;
        }
      } else if (node.type === TYPE_TABLE_CELL) {
        // Cells should only contain elements. If not, wrap content in paragraph
        if (!Element.isElementList(node.children)) {
          return Transforms.wrapNodes(editor, defaultParagraphBlock(), {
            at: path,
            match: node => !Element.isElement(node),
          });
        }
      } else if (node.type === TYPE_TABLE_ROW) {
        // Row should only contain cells. If not, wrap content in cell
        for (const [index, child] of node.children.entries()) {
          if (!Element.isElement(child) || child.type !== TYPE_TABLE_CELL) {
            return Transforms.wrapNodes(editor, defaultTableCellBlock(), { at: [...path, index] });
          }
        }

        const [parent] = Editor.node(editor, Path.parent(path));
        if (Element.isElement(parent)) {
          if (parent.type === TYPE_TABLE_HEAD || parent.type === TYPE_TABLE_BODY) {
            const isHeader = parent.type === TYPE_TABLE_HEAD;
            for (const [index, child] of node.children.entries()) {
              if (
                Element.isElement(child) &&
                child.type === TYPE_TABLE_CELL &&
                child.data.isHeader !== isHeader
              ) {
                return HistoryEditor.withoutSaving(editor, () => {
                  Transforms.setNodes(
                    editor,
                    {
                      data: {
                        ...child.data,
                        isHeader: isHeader,
                      },
                    },
                    { at: [...path, index] },
                  );
                });
              }
            }
          }
        }
      }
    }

    normalizeNode(entry);
  };

  editor.onKeyDown = event => {
    if (validKeys.includes(event.key)) {
      const [tableNode, tablePath] = getCurrentBlock(editor, TYPE_TABLE);
      if (
        tableNode &&
        editor.selection &&
        Path.isDescendant(editor.selection.anchor.path, tablePath)
      ) {
        if (tableNode) {
          return handleTableKeydown(event, editor, [tableNode, tablePath] as NodeEntry<
            TableElement
          >);
        }
      }
    }
    onKeyDown && onKeyDown(event);
  };

  return editor;
};
