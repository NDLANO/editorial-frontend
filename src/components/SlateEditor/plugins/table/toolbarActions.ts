/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Element, Path, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ReactEditor } from "slate-react";
import { getCurrentBlock } from "@ndla/editor";
import {
  defaultTableCellBlock,
  defaultTableHeadBlock,
  defaultTableRowBlock,
  defaultTableBodyBlock,
  defaultTableCellHeaderBlock,
} from "./defaultBlocks";
import { TableElement } from "./interfaces";
import { getTableAsMatrix, getTableSectionAsMatrix } from "./matrix";
import { findCellCoordinate } from "./matrixHelpers";
import { updateCell } from "./slateActions";
import { TABLE_BODY_ELEMENT_TYPE, TABLE_HEAD_ELEMENT_TYPE, TABLE_ROW_ELEMENT_TYPE } from "./types";
import {
  isAnyTableCellElement,
  isTableBodyElement,
  isTableCellHeaderElement,
  isTableElement,
  isTableHeadElement,
  isTableRowElement,
  isTableSectionElement,
} from "./queries";
import { getTableSectionWidth } from "./slateHelpers";

export const toggleRowHeaders = (editor: Editor, path: Path) => {
  const [table] = Editor.node(editor, path);
  if (!isTableElement(table)) return;
  Transforms.setNodes(editor, { rowHeaders: !table.rowHeaders }, { at: path });
};

export const removeRow = (editor: Editor, path: Path) => {
  const [tableSectionEntry] = Editor.nodes(editor, { at: path, match: isTableSectionElement });
  if (!tableSectionEntry) {
    return;
  }

  const [tableSection, tableSectionpath] = tableSectionEntry;

  // If tableHead only contains one row. Remove it.
  if (tableSection.type === TABLE_HEAD_ELEMENT_TYPE && tableSection.children.length === 1) {
    return Transforms.removeNodes(editor, { at: tableSectionpath });
  }

  if (tableSection.type === TABLE_BODY_ELEMENT_TYPE && tableSection.children.length === 1) {
    return;
  }

  const [cellEntry] = Editor.nodes(editor, { at: path, match: isAnyTableCellElement });
  const [selectedCell, selectedCellPath] = cellEntry;

  const matrix = getTableSectionAsMatrix(editor, Path.parent(Path.parent(selectedCellPath)));

  if (!matrix) return;

  // If selected cell has same height as entire body. Do nothing.
  if (selectedCell.data.rowspan === matrix.length) {
    return;
  }

  const selectedPath = findCellCoordinate(matrix, selectedCell);
  if (!selectedPath) return;

  const selectedRowIndex = selectedPath[0];

  Editor.withoutNormalizing(editor, () => {
    // Loop all affected rows
    for (let rowIndex = 0; rowIndex < selectedCell.data.rowspan; rowIndex++) {
      const currentRowPath = [...Path.parent(Path.parent(selectedCellPath)), selectedRowIndex + rowIndex];

      // Loop all affected cells in row to check if any cells spans outside of the area to be removed.
      // We just want to evaluate each cell once, therefore point A and B.

      for (const [columnIndex, cell] of matrix[selectedRowIndex].entries()) {
        // A. If cell in previous column is the same, skip
        if (columnIndex > 0 && cell === matrix[selectedRowIndex + rowIndex][columnIndex - 1]) {
          continue;
        }

        // B. If cell in next row is the same, skip
        if (rowIndex < selectedCell.data.rowspan - 1 && cell === matrix[selectedRowIndex + rowIndex + 1][columnIndex]) {
          continue;
        }

        // C. If current cell exists above rows to be deleted => Reduce its rowspan
        if (selectedRowIndex > 0 && matrix[selectedRowIndex - 1][columnIndex] === cell && cell.data.rowspan) {
          // Find out how much of the cell height is within the rows that will be removed.
          const reductionAmount = matrix
            .slice(selectedRowIndex, selectedRowIndex + cell.data.rowspan)
            .map((e) => e[columnIndex])
            .filter((c) => c === cell).length;

          updateCell(editor, cell, {
            rowspan: cell.data.rowspan - reductionAmount,
          });

          // D. If current cell exists beneith rows to be deleted => Reduce rowspan and move cell below rows to be deleted.
        } else if (
          selectedRowIndex < matrix.length - 1 &&
          matrix[selectedRowIndex + 1][columnIndex] === cell &&
          cell.data.rowspan
        ) {
          // i. Find out how much of the cell height is within the rows that will be removed.
          const reductionAmount = matrix
            .slice(selectedRowIndex, selectedRowIndex + selectedCell.data.rowspan)
            .map((e) => e[columnIndex])
            .filter((c) => c === cell).length;

          // ii. Find the new target path below the deleted rows.
          const targetPath =
            columnIndex === 0
              ? [...Path.next(Path.parent(ReactEditor.findPath(editor, cell))), 0]
              : Path.next(ReactEditor.findPath(editor, matrix[selectedRowIndex + 1][columnIndex - 1]));

          // iii. Reduce rowspan.
          updateCell(editor, cell, {
            rowspan: cell.data.rowspan - reductionAmount,
          });

          // iv. Move below deleted rows.
          Transforms.moveNodes(editor, {
            at: ReactEditor.findPath(editor, cell),
            to: targetPath,
          });
        }
      }

      // E.  After cells with rowspan are reduced. Just remove the entire row.
      Transforms.removeNodes(editor, {
        at: currentRowPath,
      });
    }
  });
};

export const insertTableHead = (editor: Editor) => {
  const tableBodyEntry = getCurrentBlock(editor, TABLE_BODY_ELEMENT_TYPE);
  const tableRowEntry = getCurrentBlock(editor, TABLE_ROW_ELEMENT_TYPE);

  if (!tableBodyEntry || !tableRowEntry) {
    return;
  }
  const [, bodyPath] = tableBodyEntry;
  const [rowElement] = tableRowEntry;

  const children = rowElement.children.map((cell) => ({
    ...defaultTableCellHeaderBlock(),
    data: isTableCellHeaderElement(cell) ? { ...cell.data, rowspan: 1 } : { rowspan: 1, colspan: 1 },
  }));

  return Transforms.insertNodes(
    editor,
    {
      ...defaultTableHeadBlock(0),
      children: [{ ...defaultTableRowBlock(0, true), children }],
    },
    { at: bodyPath },
  );
};

export const insertRow = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [tableBodyEntry] = Editor.nodes(editor, {
    at: path,
    match: (node) => isTableHeadElement(node) || isTableRowElement(node),
  });

  if (!tableBodyEntry) {
    return;
  }

  // If tableHead contains two rows. Insert the row in tableBody instead
  const [tableHead, tableHeadPath] = tableBodyEntry;
  if (isTableHeadElement(tableHead) && tableHead.children.length === 2) {
    const tableBodyPath = Path.next(tableHeadPath);

    if (Editor.hasPath(editor, tableBodyPath)) {
      const [tableBody] = Editor.node(editor, tableBodyPath);

      if (isTableBodyElement(tableBody) && isTableRowElement(tableBody.children[0])) {
        const firstRow = tableBody.children[0];
        const children = firstRow.children.map((cell) => {
          const cellData = isAnyTableCellElement(cell) ? cell.data : {};
          const defaultCell = defaultTableCellBlock();
          return {
            ...defaultCell,
            data: {
              ...defaultCell.data,
              ...cellData,
              rowspan: 1,
            },
          };
        });

        return Transforms.insertNodes(
          editor,
          { ...defaultTableRowBlock(0), children },
          { at: tableBodyPath.concat(0) },
        );
      }
      // If tableBody does not exist. Insert it with rows matching the end of tableHead
    } else {
      const headerMatrix = getTableSectionAsMatrix(editor, tableHeadPath);
      if (!headerMatrix) return;
      const lastHeadRow = [...new Set(headerMatrix[headerMatrix.length - 1])];
      const children = [
        {
          ...defaultTableRowBlock(0),
          children: lastHeadRow.map((cell, index) => ({
            ...defaultTableCellBlock(),
            data: {
              ...cell.data,
              isHeader: index === 0 && tableElement.rowHeaders,
              rowspan: 1,
            },
          })),
        },
      ];
      return Transforms.insertNodes(
        editor,
        { ...defaultTableBodyBlock(0, 0), children },
        { at: Path.next(tableHeadPath) },
      );
    }
    return;
  }

  const [cellEntry] = Editor.nodes(editor, { at: path, match: isAnyTableCellElement });
  if (!cellEntry) return;
  const [cell, cellPath] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  if (!matrix) return;

  const selectedCoordinate = findCellCoordinate(matrix, cell);
  if (!selectedCoordinate) return;
  const selectedRowIndex =
    selectedCoordinate[0] + matrix[selectedCoordinate[0]][selectedCoordinate[1]].data.rowspan - 1;

  Editor.withoutNormalizing(editor, () => {
    let rowsInserted = 0;
    const currentRowPath = Path.parent(cellPath);
    const newRowPath = [...Path.parent(currentRowPath), currentRowPath[currentRowPath.length - 1] + cell.data.rowspan];
    // Evaluate all cells
    for (const [columnIndex, cell] of matrix[selectedRowIndex].entries()) {
      // A. If cell in previous column is the same, skip
      if (columnIndex > 0 && cell === matrix[selectedRowIndex][columnIndex - 1]) {
        continue;
      }

      // B. If next cell is identical, extend rowspan by 1.
      if (
        columnIndex + 1 < matrix[selectedRowIndex].length &&
        cell.data.rowspan &&
        matrix[selectedRowIndex + 1] &&
        matrix[selectedRowIndex + 1][columnIndex] === cell
      ) {
        updateCell(editor, cell, {
          rowspan: cell.data.rowspan + 1,
        });
        // Insert cell of same type and width
      } else {
        // C. If not row is inserted yet. Insert a new row.
        if (!rowsInserted) {
          Transforms.insertNodes(editor, slatejsx("element", { type: TABLE_ROW_ELEMENT_TYPE }), {
            at: newRowPath,
          });
        }
        const maybeTableHead = Editor.parent(editor, currentRowPath)[0];
        const isInTableHead = Element.isElement(maybeTableHead) && maybeTableHead.type === TABLE_HEAD_ELEMENT_TYPE;

        // D. Insert new cell with matching colspan.
        Transforms.insertNodes(
          editor,
          {
            ...(isInTableHead ? defaultTableCellHeaderBlock() : defaultTableCellBlock()),
            data: {
              ...cell.data,
              rowspan: 1,
            },
          },
          {
            at: [...newRowPath, rowsInserted],
          },
        );
        rowsInserted++;
      }
    }
  });
};

export const insertColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [tableBodyEntry] = Editor.nodes(editor, {
    at: path,
    match: (node) => isTableHeadElement(node) || isTableRowElement(node),
  });

  if (!tableBodyEntry) {
    return;
  }

  const [cellEntry] = Editor.nodes(editor, { at: path, match: isAnyTableCellElement });
  if (!cellEntry) return;
  const [cell] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));
  if (!matrix) return;

  const selectedPath = findCellCoordinate(matrix, cell);
  if (!selectedPath) return;

  // Select the right edge of the cell
  const selectedColumnIndex = selectedPath[1] + matrix[selectedPath[0]][selectedPath[1]].data.colspan - 1;

  Editor.withoutNormalizing(editor, () => {
    // Evaluate selected column in all rows. Only evaluate each cell once, therefore point A.
    for (const [rowIndex, row] of matrix.entries()) {
      const cell = row[selectedColumnIndex];

      // A. If previous row contains the same cell, skip.
      if (rowIndex > 0 && cell === matrix[rowIndex - 1][selectedColumnIndex]) {
        continue;
      }

      // B. If next row contains an identical cell, extend columnspan by 1.
      if (selectedColumnIndex + 1 < row.length && cell.data.colspan && row[selectedColumnIndex + 1] === cell) {
        updateCell(editor, cell, {
          colspan: cell.data.colspan + 1,
        });

        // C. Otherwise, insert column of same type and height.
      } else {
        Transforms.insertNodes(
          editor,
          {
            ...(isTableCellHeaderElement(cell) ? defaultTableCellHeaderBlock() : defaultTableCellBlock()),
            data: {
              ...cell.data,
              colspan: 1,
            },
          },
          { at: Path.next(ReactEditor.findPath(editor, cell)) },
        );
      }
    }
  });
};

export const removeColumn = (editor: Editor, tableElement: TableElement, path: Path) => {
  const [tableBodyEntry] = Editor.nodes(editor, {
    at: path,
    match: (node) => isTableHeadElement(node) || isTableRowElement(node),
  });

  if (!tableBodyEntry) {
    return;
  }

  const [cellEntry] = Editor.nodes(editor, { at: path, match: isAnyTableCellElement });
  if (!cellEntry) return;
  const [cell] = cellEntry;

  const matrix = getTableAsMatrix(editor, ReactEditor.findPath(editor, tableElement));

  if (!matrix) return;

  const firstSection = tableElement.children[0];

  if (isTableSectionElement(firstSection) && getTableSectionWidth(firstSection) === 1) {
    return;
  }

  const selectedPath = findCellCoordinate(matrix, cell);
  if (!selectedPath) return;

  const [, selectedColumnIndex] = selectedPath;

  Editor.withoutNormalizing(editor, () => {
    // Evaluate selected column in all rows. Only evaluate each cell once, therefore point A.
    for (const [rowIndex, row] of matrix.entries()) {
      const cell = row[selectedColumnIndex];

      // A. If next row contains the same cell, skip
      if (rowIndex < matrix.length - 1 && cell === matrix[rowIndex + 1][selectedColumnIndex]) {
        continue;
      }

      // B. If cell has spans over multiple columns, reduce span by 1.
      if (cell.data.colspan && cell.data.colspan > 1) {
        updateCell(editor, cell, {
          colspan: cell.data.colspan - 1,
        });

        // C. Otherwise, remove cell
      } else {
        Transforms.removeNodes(editor, {
          at: ReactEditor.findPath(editor, cell),
        });
      }
    }
  });
};
