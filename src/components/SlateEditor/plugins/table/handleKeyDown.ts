import { Editor, Element, NodeEntry, Path, Point, Range, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  KEY_ARROW_DOWN,
  KEY_ARROW_UP,
  KEY_BACKSPACE,
  KEY_DELETE,
  KEY_TAB,
  TableBodyElement,
  TableCellElement,
  TableElement,
  TableHeadElement,
  TableRowElement,
} from '.';
import { findCellInMatrix, getTableAsMatrix } from './matrix';
import {
  createIdenticalRow,
  defaultTableRowBlock,
  TYPE_TABLE_BODY,
  TYPE_TABLE_CELL,
  TYPE_TABLE_HEAD,
  TYPE_TABLE_ROW,
} from './utils';

export const handleTableKeydown = (
  event: KeyboardEvent,
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
) => {
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
    const [bodyEntry] = Editor.nodes(editor, {
      at: editor.selection.anchor.path,
      match: node =>
        Element.isElement(node) && (node.type === TYPE_TABLE_HEAD || node.type === TYPE_TABLE_BODY),
    });
    if (!bodyEntry) {
      return;
    }

    switch (event.key) {
      case KEY_ARROW_DOWN:
        event.preventDefault();
        return moveDown(editor, tableEntry, cellEntry as NodeEntry<TableCellElement>);
      case KEY_ARROW_UP:
        event.preventDefault();
        return moveUp(editor, tableEntry, cellEntry as NodeEntry<TableCellElement>);
      case KEY_TAB:
        event.preventDefault();
        if (event.shiftKey) {
          return moveLeft(
            editor,
            tableEntry,
            bodyEntry as NodeEntry<TableHeadElement | TableBodyElement>,
            rowEntry as NodeEntry<TableRowElement>,
            cellEntry as NodeEntry<TableCellElement>,
          );
        }
        return moveRight(
          editor,
          tableEntry,
          bodyEntry as NodeEntry<TableHeadElement | TableBodyElement>,
          rowEntry as NodeEntry<TableRowElement>,
          cellEntry as NodeEntry<TableCellElement>,
        );
      case KEY_BACKSPACE:
        return handleBackspaceClick(event, editor, cellEntry as NodeEntry<TableCellElement>);
      case KEY_DELETE:
        return handleDeleteClick(event, editor, cellEntry as NodeEntry<TableCellElement>);

      default:
        return;
    }
  }
};

const handleBackspaceClick = (
  event: KeyboardEvent,
  editor: Editor,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const firstCellPoint = Editor.point(editor, cellEntry[1], { edge: 'start' });
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    if (Point.equals(editor.selection.anchor, firstCellPoint)) {
      event.preventDefault();
    }
  }
};
const handleDeleteClick = (
  event: KeyboardEvent,
  editor: Editor,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const lastCellPoint = Editor.point(editor, cellEntry[1], { edge: 'end' });
  if (editor.selection && Range.isCollapsed(editor.selection)) {
    if (Point.equals(editor.selection.anchor, lastCellPoint)) {
      event.preventDefault();
    }
  }
};

const moveLeft = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  bodyEntry: NodeEntry<TableBodyElement | TableHeadElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const tablePath = tableEntry[1];
  const bodyPath = bodyEntry[1];
  const [row, rowPath] = rowEntry;
  const cellPath = cellEntry[1];
  if (
    (Path.hasPrevious(cellPath) || Path.hasPrevious(rowPath) || Path.hasPrevious(bodyPath)) &&
    editor.selection
  ) {
    Transforms.select(editor, Editor.start(editor, cellEntry[1]));
    Transforms.move(editor, { reverse: true });
    Transforms.select(editor, Editor.range(editor, editor.selection.anchor.path));
    return;
  }

  if (Path.equals([...tablePath, 0, 0, 0], cellPath)) {
    const targetPath = [...tablePath, 0, 0];
    Transforms.insertNodes(editor, createIdenticalRow(row), { at: targetPath });
    Transforms.select(editor, {
      anchor: Editor.point(editor, targetPath, { edge: 'start' }),
      focus: Editor.point(editor, targetPath, { edge: 'start' }),
    });
  }
};

const moveRight = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  bodyEntry: NodeEntry<TableBodyElement | TableHeadElement>,
  rowEntry: NodeEntry<TableRowElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const tablePath = tableEntry[1];
  const bodyPath = bodyEntry[1];
  const [row, rowPath] = rowEntry;
  const cellPath = cellEntry[1];
  const nextPath = Path.next(cellPath);
  const nextRowPath = Path.next(rowPath);
  const nextBodyPath = Path.next(bodyPath);

  if (
    (Editor.hasPath(editor, nextPath) ||
      Editor.hasPath(editor, nextRowPath) ||
      Editor.hasPath(editor, nextBodyPath)) &&
    editor.selection
  ) {
    Transforms.select(editor, Editor.end(editor, cellEntry[1]));
    Transforms.move(editor);
    Transforms.select(editor, Editor.range(editor, editor.selection.anchor.path));
    return;
  }

  const TableEndPoint = Editor.point(editor, tablePath, { edge: 'end' });
  if (Path.isDescendant(TableEndPoint.path, cellPath)) {
    const targetPath = [...bodyPath, row.children.length];
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
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const tablePath = tableEntry[1];

  const [cell, cellPath] = cellEntry;

  const matrix = getTableAsMatrix(editor, tablePath);

  if (matrix) {
    const matrixPath = findCellInMatrix(matrix, cell);
    if (matrixPath) {
      const nextCell = matrix[matrixPath[0] + cell.data.rowspan]?.[matrixPath[1]];

      if (nextCell) {
        const nextCellPath = ReactEditor.findPath(editor, nextCell);
        const nextCellPoint = Editor.point(editor, nextCellPath, { edge: 'start' });
        return Transforms.select(editor, {
          anchor: nextCellPoint,
          focus: nextCellPoint,
        });
      } else if (Editor.hasPath(editor, Path.next(cellPath))) {
        const nextCellPoint = Editor.point(editor, Path.next(cellPath), { edge: 'start' });
        return Transforms.select(editor, {
          anchor: nextCellPoint,
          focus: nextCellPoint,
        });
      } else {
        const nextPoint = Editor.point(editor, Path.next(tablePath), { edge: 'end' });
        return Transforms.select(editor, {
          anchor: nextPoint,
          focus: nextPoint,
        });
      }
    }
  }
};

const moveUp = (
  editor: Editor,
  tableEntry: NodeEntry<TableElement>,
  cellEntry: NodeEntry<TableCellElement>,
) => {
  const tablePath = tableEntry[1];

  const [cell, cellPath] = cellEntry;

  const matrix = getTableAsMatrix(editor, tablePath);

  if (matrix) {
    const matrixPath = findCellInMatrix(matrix, cell);
    if (matrixPath) {
      if (matrixPath[0] > 0) {
        const previousCell = matrix[matrixPath[0] - 1]?.[matrixPath[1]];
        const previousCellPath = ReactEditor.findPath(editor, previousCell);
        const previousCellPoint = Editor.point(editor, previousCellPath, { edge: 'start' });
        return Transforms.select(editor, {
          anchor: previousCellPoint,
          focus: previousCellPoint,
        });
      } else if (Path.hasPrevious(cellPath) && Editor.hasPath(editor, Path.previous(cellPath))) {
        const previousCellPoint = Editor.point(editor, Path.previous(cellPath), { edge: 'start' });
        return Transforms.select(editor, {
          anchor: previousCellPoint,
          focus: previousCellPoint,
        });
      } else if (Path.hasPrevious(tablePath)) {
        const previousPoint = Editor.point(editor, Path.previous(tablePath), { edge: 'end' });
        return Transforms.select(editor, {
          anchor: previousPoint,
          focus: previousPoint,
        });
      }
    }
  }
};
