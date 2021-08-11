import { Editor, Element, NodeEntry, Path, Transforms } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';
import {
  TableCellElement,
  TableElement,
  TableRowElement,
  KEY_ARROW_DOWN,
  KEY_ARROW_UP,
  KEY_TAB,
} from '.';
import { defaultParagraphBlock } from '../paragraph/utils';
import { getTableAsMatrix } from './matrix';

export const TYPE_TABLE = 'table';
export const TYPE_TABLE_HEAD = 'table-head';
export const TYPE_TABLE_BODY = 'table-body';
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

export const defaultTableBlock = (height: number, width: number) => {
  return jsx(
    'element',
    { type: TYPE_TABLE },
    [...Array(1)].map(() => defaultTableHeadBlock(width)),
    [...Array(height - 1)].map(() => defaultTableBodyBlock(width)),
  );
};

export const defaultTableCellBlock = () => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_CELL,
      data: {
        isHeader: false,
      },
    },
    defaultParagraphBlock(),
  );
};

export const defaultTableRowBlock = (width: number) => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_ROW,
    },
    [...Array(width)].map(() => defaultTableCellBlock()),
  );
};

export const defaultTableHeadBlock = (width: number) => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_HEAD,
    },
    [...Array(width)].map(() => defaultTableRowBlock(width)),
  );
};

export const defaultTableBodyBlock = (width: number) => {
  return jsx(
    'element',
    {
      type: TYPE_TABLE_BODY,
    },
    [...Array(width)].map(() => defaultTableRowBlock(width)),
  );
};

export const getTableWidth = (element: TableElement) => {
  const firstRow = element.children[0];
  if (Element.isElement(firstRow) && firstRow.type === TYPE_TABLE_ROW) {
    return countCells(firstRow);
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
  Transforms.insertNodes(editor, defaultTableRowBlock(1), { at: Path.next(rowPath) });

  const [columnEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const columnPath = columnEntry && columnEntry[1];
  Transforms.select(editor, {
    anchor: Editor.point(editor, columnPath, { edge: 'start' }),
    focus: Editor.point(editor, columnPath, { edge: 'start' }),
  });
};

export const insertColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [columnEntry] = Editor.nodes(editor, {
    at: path,
    match: node => Element.isElement(node) && node.type === TYPE_TABLE_CELL,
  });
  const columnPath = columnEntry && columnEntry[1];
  const targetColumn = columnPath[columnPath.length - 1] + 1;

  // TEMPORARY
  getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  Editor.withoutNormalizing(editor, () => {
    tableElement.children.forEach((row, index) => {
      Transforms.insertNodes(editor, defaultTableCellBlock(), {
        at: [...ReactEditor.findPath(editor, tableElement), index, targetColumn],
      });
    });
    Transforms.select(editor, {
      anchor: Editor.point(editor, columnPath, { edge: 'start' }),
      focus: Editor.point(editor, columnPath, { edge: 'start' }),
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
  event: KeyboardEvent,
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
      case KEY_TAB:
        if (event.shiftKey) {
          return moveLeft(
            editor,
            tableEntry,
            rowEntry as NodeEntry<TableRowElement>,
            cellEntry as NodeEntry<TableCellElement>,
          );
        }
        return moveRight(
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

const moveLeft = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const tablePath = tableEntry[1];
  const [row, rowPath] = rowEntry;
  const cellPath = cellEntry[1];
  if (Path.hasPrevious(cellPath)) {
    const previousPath = Path.previous(cellPath);

    if (Editor.hasPath(editor, previousPath)) {
      return Transforms.select(editor, previousPath);
    }
  }
  if (Path.hasPrevious(rowPath)) {
    const previousPath = Path.previous(rowPath);
    if (Editor.hasPath(editor, previousPath)) {
      const targetCellPath = [...previousPath, row.children.length - 1];
      if (Editor.hasPath(editor, targetCellPath)) {
        return Transforms.select(editor, targetCellPath);
      }
    }
  }
  if (Path.equals([...tablePath, 0, 0], cellPath)) {
    const targetPath = [...tablePath, 0];
    Transforms.insertNodes(editor, defaultTableRowBlock(1), { at: targetPath });
    Transforms.select(editor, {
      anchor: Editor.point(editor, targetPath, { edge: 'start' }),
      focus: Editor.point(editor, targetPath, { edge: 'start' }),
    });
  }
};

const moveRight = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const tablePath = tableEntry[1];
  const [row, rowPath] = rowEntry;
  const cellPath = cellEntry[1];
  const nextPath = Path.next(cellPath);

  if (Editor.hasPath(editor, nextPath)) {
    return Transforms.select(editor, nextPath);
  }

  const nextRowPath = Path.next(rowPath);
  if (Editor.hasPath(editor, nextRowPath)) {
    const targetCellPath = [...nextRowPath, 0];
    if (Editor.hasPath(editor, targetCellPath)) {
      return Transforms.select(editor, targetCellPath);
    }
  }
  const TableEndPoint = Editor.point(editor, tablePath, { edge: 'end' });
  if (Path.isDescendant(TableEndPoint.path, cellPath)) {
    const targetPath = [...tablePath, row.children.length];
    Transforms.insertNodes(editor, defaultTableRowBlock(1), { at: targetPath });
    Transforms.select(editor, {
      anchor: Editor.point(editor, tablePath, { edge: 'end' }),
      focus: Editor.point(editor, tablePath, { edge: 'end' }),
    });
  }
};

const moveDown = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
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
};

const moveUp = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
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
};
