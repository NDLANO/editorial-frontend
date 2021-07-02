/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';
import { Dictionary } from 'lodash';
import { Descendant, Editor, Element, NodeEntry, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { HistoryEditor } from 'slate-history';
import { jsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import {
  reduceElementDataAttributes,
  removeEmptyElementDataAttributes,
} from '../../../../util/embedTagHelpers';
import SlateTable from './SlateTable';
import {
  countCells,
  defaultTableCellBlock,
  defaultTableRowBlock,
  handleTableKeydown,
  TYPE_TABLE,
  TYPE_TABLE_CELL,
  TYPE_TABLE_ROW,
} from './utils';
import getCurrentBlock from '../../utils/getCurrentBlock';
import { afterOrBeforeTextBlockElement } from '../../utils/normalizationHelpers';
import { defaultParagraphBlock, TYPE_PARAGRAPH } from '../paragraph/utils';

export const KEY_ARROW_UP = 'ArrowUp';
export const KEY_ARROW_DOWN = 'ArrowDown';
export const KEY_TAB = 'Tab';

const validKeys = [KEY_ARROW_UP, KEY_ARROW_DOWN, KEY_TAB];

export interface TableElement {
  type: 'table';
  children: Descendant[];
}

export interface TableRowElement {
  type: 'table-row';
  children: Descendant[];
}

export interface TableCellElement {
  type: 'table-cell';
  data: {
    rowspan?: string;
    colspan?: string;
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
    if (tagName === 'thead' || tagName === 'tbody') {
      return children;
    }
    if (tagName === 'table') {
      return jsx('element', { type: TYPE_TABLE }, children);
    }
    if (tagName === 'tr') {
      return jsx('element', { type: TYPE_TABLE_ROW }, children);
    }

    const tableTag = TABLE_TAGS[tagName];
    if (!tableTag) return;
    let data = {
      isHeader: tagName === 'th',
    };
    if (tagName === 'th' || tagName === 'td') {
      const filter = ['rowspan', 'colspan', 'align', 'valign', 'class'];
      const attrs = reduceElementDataAttributes(el, filter);
      data = {
        isHeader: tagName === 'th',
        ...attrs,
      };
    }
    return jsx('element', { type: tableTag, data }, children);
  },
  serialize(node: Descendant, children: (JSX.Element | null)[]) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_TABLE && node.type !== TYPE_TABLE_ROW && node.type !== TYPE_TABLE_CELL)
      return;

    if (node.type === TYPE_TABLE) {
      const ret = (
        <table>
          <thead>{children.slice(0, 1)}</thead>
          <tbody>{children.slice(1)}</tbody>
        </table>
      );
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
            rowSpan={element.data.rowspan ? parseInt(element.data.rowspan) : 1}
            colSpan={element.data.colspan ? parseInt(element.data.colspan) : 1}
            {...attributes}>
            {children}
          </td>
        );
      default:
        return renderElement && renderElement({ attributes, children, element });
    }
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (Element.isElement(node)) {
      if (node.type === TYPE_TABLE) {
        const tableNodes = node.children;

        // Go to next normalizer if first child is invalid.
        const firstRow = tableNodes[0];
        if (!Element.isElement(firstRow) || firstRow.type !== TYPE_TABLE_ROW) {
          return normalizeNode(entry);
        }

        // Make sure all cells in first row are flagged as headers
        firstRow.children.forEach((child, index) => {
          if (Element.isElement(child) && child.type === TYPE_TABLE_CELL && !child.data.isHeader) {
            return HistoryEditor.withoutSaving(editor, () => {
              Transforms.setNodes(
                editor,
                {
                  data: {
                    isHeader: true,
                    rowspan: child.data.rowspan,
                    colspan: child.data.colspan,
                  },
                },
                { at: [...path, 0, index] },
              );
            });
          }
        });

        // If table contains non-row element, wrap it with row element
        tableNodes.forEach((row, index) => {
          if (!Element.isElement(row)) {
            return Transforms.wrapNodes(editor, defaultTableRowBlock(0), {
              at: ReactEditor.findPath(editor, row),
            });
          }
        });

        const rows = tableNodes as TableRowElement[];

        const maxCols = Math.max(...rows.map(e => countCells(e)));

        // Insert cells if row is missing some
        rows.forEach((row, index) => {
          const colCount = countCells(row);
          if (colCount < maxCols) {
            return Transforms.insertNodes(
              editor,
              [...Array(maxCols - colCount)].map(() => {
                return defaultTableCellBlock();
              }),
              { at: [...path, index, row.children.length] },
            );
          }
        });
        const nextPath = Path.next(path);

        if (Editor.hasPath(editor, nextPath)) {
          const [nextNode] = Editor.node(editor, nextPath);
          if (
            !Element.isElement(nextNode) ||
            !afterOrBeforeTextBlockElement.includes(nextNode.type)
          ) {
            Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
              at: nextPath,
            });

            return;
          }
        }

        if (Path.hasPrevious(path)) {
          const previousPath = Path.previous(path);

          if (Editor.hasPath(editor, previousPath)) {
            const [previousNode] = Editor.node(editor, previousPath);
            if (
              !Element.isElement(previousNode) ||
              !afterOrBeforeTextBlockElement.includes(previousNode.type)
            ) {
              Transforms.insertNodes(editor, jsx('element', { type: TYPE_PARAGRAPH }), {
                at: path,
              });

              return;
            }
          }
        }
      } else if (node.type === TYPE_TABLE_CELL) {
        if (!Element.isElementList(node.children)) {
          return Transforms.wrapNodes(editor, defaultParagraphBlock(), {
            at: path,
            match: node => !Element.isElement(node),
          });
        }
      } else if (node.type === TYPE_TABLE_ROW) {
        for (const [index, child] of node.children.entries()) {
          if (!Element.isElement(child) || child.type !== TYPE_TABLE_CELL) {
            return Transforms.removeNodes(editor, { at: [...path, index] });
          }
        }
      }
    }

    normalizeNode(entry);
  };

  editor.onKeyDown = event => {
    if (validKeys.includes(event.key)) {
      const currentTable = getCurrentBlock(editor, TYPE_TABLE);
      if (
        currentTable &&
        editor.selection &&
        Path.isDescendant(editor.selection.anchor.path, currentTable[1])
      ) {
        if (currentTable) {
          return handleTableKeydown(event, editor, currentTable as NodeEntry<TableElement>);
        }
      }
    }
    onKeyDown && onKeyDown(event);
  };

  return editor;
};
