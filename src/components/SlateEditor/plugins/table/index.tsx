/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

import React from 'react';
import { Descendant, Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { jsx } from 'slate-hyperscript';
import { SlateSerializer } from '../../interfaces';
import { reduceElementDataAttributes } from '../../../../util/embedTagHelpers';
import SlateTable from './SlateTable';

export const TYPE_TABLE = 'table';
export const TYPE_TABLE_ROW = 'table-row';
export const TYPE_TABLE_CELL = 'table-cell';

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
    isHeader: boolean;
    rowspan: number;
    colspan: number;
  };
  children: Descendant[];
}

export const TABLE_TAGS: { [key: string]: string } = {
  table: 'table',
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

    const tableTag = TABLE_TAGS[tagName];
    if (!tableTag) return;
    let data = {
      isHeader: tagName === 'th',
    };
    if (tagName === 'th' || tagName === 'td') {
      const filter = [
        'rowspan',
        'colspan',
        'align',
        'data-align',
        'valign',
        'data-valign',
        'class',
        'data-class',
      ];
      const attrs = reduceElementDataAttributes(el, filter);
      data = {
        isHeader: tagName === 'th',
        ...attrs,
      };
    }
    return jsx('element', { type: tableTag, data }, children);
  },
  serialize(node: Descendant, children: string) {},
};

export const tablePlugin = (editor: Editor) => {
  const { renderElement } = editor;

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
      default:
        return renderElement && renderElement({ attributes, children, element });
    }
  };

  return editor;
};

// import { schema, renderBlock, normalizeNode } from './schema';

// export default function createTablePlugin() {
//   return {
//     schema,
//     renderBlock,
//     normalizeNode,
//   };
// }
