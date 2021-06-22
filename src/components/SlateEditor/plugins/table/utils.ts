import React from 'react';
import { Editor, Element, NodeEntry, Path, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import { TableCellElement, TableElement, TableRowElement, KEY_ARROW_DOWN, KEY_ARROW_UP } from '.';
import { defaultParagraphBlock } from '../paragraph/utils';

export const TYPE_TABLE = 'table';
export const TYPE_TABLE_ROW = 'table-row';
export const TYPE_TABLE_CELL = 'table-cell';

export const countCells = (row: TableRowElement, stop?: number) => {
  return row.children
    .map(child => {
      if (!Element.isElement(child) || child.type !== TYPE_TABLE_CELL) {
        return 0;
      }
      return child.data.colspan ? parseInt(child.data.colspan) : 1;
    })
    .slice(0, stop)
    .reduce((a, b) => a + b);
};

export const defaultTableCellBlock = () => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_CELL,
      data: {},
    },
    defaultParagraphBlock(),
  );
};

export const defaultTableRowBlock = () => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_ROW,
    },
    defaultTableCellBlock(),
  );
};

export const getTableWidth = (element: TableElement) => {
  const firstRow = element.children[0];
  if (Element.isElement(firstRow) && firstRow.type === TYPE_TABLE_ROW) {
    return firstRow.children.length;
  }
  return null;
};

export const getTableHeight = (element: TableElement) => {
  return element.children.length;
};

export const removeRow = (editor: Editor, path: Path) => {
  const [rowEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_ROW,
  });
  const rowPath = rowEntry && rowEntry[1];
  Transforms.removeNodes(editor, {
    at: rowPath,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_ROW,
  });
};

export const insertRow = (editor: Editor, path: Path) => {
  const [rowEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_ROW,
  });
  const rowPath = rowEntry && rowEntry[1];
  Transforms.insertNodes(editor, defaultTableRowBlock(), { at: Path.next(rowPath) });

  const [columnEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const columnPath = columnEntry && columnEntry[1];
  Transforms.select(editor, {
    anchor: { offset: 0, path: [...Path.next(rowPath), columnPath[columnPath.length - 1], 0, 0] },
    focus: { offset: 0, path: [...Path.next(rowPath), columnPath[columnPath.length - 1], 0, 0] },
  });
};

export const insertColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [columnEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const columnPath = columnEntry && columnEntry[1];
  const targetColumn = columnPath[columnPath.length - 1] + 1;

  Editor.withoutNormalizing(editor, () => {
    tableElement.children.forEach((row, index) => {
      Transforms.insertNodes(editor, defaultTableCellBlock(), {
        at: [...ReactEditor.findPath(editor, tableElement), index, targetColumn],
      });
    });
    Transforms.select(editor, {
      anchor: { offset: 0, path: [...Path.next(columnPath), 0, 0] },
      focus: { offset: 0, path: [...Path.next(columnPath), 0, 0] },
    });
  });
};

export const removeColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const firstRow = tableElement.children[0];

  if (
    !Element.isElement(firstRow) ||
    firstRow.type !== TYPE_TABLE_ROW ||
    firstRow.children.length < 2
  ) {
    return;
  }
  const [columnEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const columnPath = columnEntry && columnEntry[1];
  const targetColumn = columnPath[columnPath.length - 1];

  Editor.withoutNormalizing(editor, () => {
    tableElement.children.forEach((row, index) => {
      Transforms.removeNodes(editor, {
        at: [...ReactEditor.findPath(editor, tableElement), index, targetColumn],
        match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
      });
    });
  });
};

export const removeTable = (editor: Editor, path: Path) => {
  Transforms.removeNodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE,
  });
};

export const handleTableKeydown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
) => {
  event.preventDefault();
  if (editor.selection) {
    const [cellEntry] = Editor.nodes(editor, {
      at: editor.selection.anchor.path,
      match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
    });
    if (!cellEntry) {
      return;
    }
    const [rowEntry] = Editor.nodes(editor, {
      at: editor.selection.anchor.path,
      match: node => Element.isElement(node) && node.type === TYPE_TABLE_ROW,
    });
    if (!rowEntry) {
      return;
    }

    switch (event.key) {
      case KEY_ARROW_DOWN:
        return moveDown(
          editor,
          tableEntry,
          rowEntry as NodeEntry<TableRowElement>,
          cellEntry as NodeEntry<TableCellElement>,
        );
      case KEY_ARROW_UP:
        return moveUp(
          editor,
          tableEntry,
          rowEntry as NodeEntry<TableRowElement>,
          cellEntry as NodeEntry<TableCellElement>,
        );
      default:
        return;
    }
  }
};

const moveDown = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  if (editor.selection) {
    const tablePath = tableEntry[1];

    const rowPath = rowEntry[1];

    const cellPath = cellEntry[1];
    const columnIndex = cellPath[cellPath.length - 1];

    const nextPath = [...Path.next(rowPath), columnIndex];

    if (Editor.hasPath(editor, nextPath)) {
      Transforms.select(editor, {
        anchor: Editor.point(editor, nextPath, { edge: 'start' }),
        focus: Editor.point(editor, nextPath, { edge: 'start' }),
      });
    } else if (
      Editor.hasPath(editor, Path.next(tablePath)) &&
      !Editor.hasPath(editor, Path.next(rowPath))
    ) {
      Transforms.select(editor, {
        anchor: Editor.point(editor, Path.next(tablePath), { edge: 'start' }),
        focus: Editor.point(editor, Path.next(tablePath), { edge: 'start' }),
      });
    }
  }
};

const moveUp = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  if (editor.selection) {
    const tablePath = tableEntry[1];

    const rowPath = rowEntry[1];

    const cellPath = cellEntry[1];
    const columnIndex = cellPath[cellPath.length - 1];

    if (Path.hasPrevious(rowPath)) {
      const previousPath = [...Path.previous(rowPath), columnIndex];
      if (Editor.hasPath(editor, previousPath)) {
        Transforms.select(editor, {
          anchor: Editor.point(editor, previousPath, { edge: 'start' }),
          focus: Editor.point(editor, previousPath, { edge: 'start' }),
        });
      }
    } else if (Path.hasPrevious(tablePath)) {
      const previousPath = Path.previous(tablePath);
      if (Editor.hasPath(editor, previousPath)) {
        Transforms.select(editor, {
          anchor: Editor.point(editor, previousPath, { edge: 'start' }),
          focus: Editor.point(editor, previousPath, { edge: 'start' }),
        });
      }
    }
  }
};
