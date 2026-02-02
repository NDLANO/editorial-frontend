/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { defaultParagraphBlock } from "../paragraph/utils";
import { TableElement, TableCaptionElement, TableCellElement } from "./interfaces";
import {
  TABLE_BODY_ELEMENT_TYPE,
  TABLE_CAPTION_ELEMENT_TYPE,
  TABLE_CELL_ELEMENT_TYPE,
  TABLE_CELL_HEADER_ELEMENT_TYPE,
  TABLE_ELEMENT_TYPE,
  TABLE_HEAD_ELEMENT_TYPE,
  TABLE_ROW_ELEMENT_TYPE,
} from "./types";

export const defaultTableBlock = (height: number, width: number) => {
  return slatejsx("element", { type: TABLE_ELEMENT_TYPE, colgroups: "" }, [
    defaultTableCaptionBlock(),
    defaultTableHeadBlock(width),
    defaultTableBodyBlock(height - 1, width),
  ]) as TableElement;
};

export const defaultTableCaptionBlock = () => {
  return slatejsx("element", { type: TABLE_CAPTION_ELEMENT_TYPE }, [{ text: "" }]) as TableCaptionElement;
};

export const defaultTableCellBlock = () => {
  return slatejsx(
    "element",
    {
      type: TABLE_CELL_ELEMENT_TYPE,
      data: {
        colspan: 1,
        rowspan: 1,
      },
    },
    {
      ...defaultParagraphBlock(),
      serializeAsText: true,
    },
  ) as TableCellElement;
};

export const defaultTableCellHeaderBlock = () => {
  return slatejsx(
    "element",
    {
      type: TABLE_CELL_HEADER_ELEMENT_TYPE,
      data: {
        colspan: 1,
        rowspan: 1,
      },
    },
    {
      ...defaultParagraphBlock(),
      serializeAsText: true,
    },
  ) as TableCellElement;
};

export const defaultTableRowBlock = (width: number, header = false) => {
  return slatejsx(
    "element",
    {
      type: TABLE_ROW_ELEMENT_TYPE,
    },
    [...Array(width)].map(() => (header ? defaultTableCellHeaderBlock() : defaultTableCellBlock())),
  );
};

export const defaultTableHeadBlock = (width: number) => {
  return slatejsx(
    "element",
    {
      type: TABLE_HEAD_ELEMENT_TYPE,
    },
    [defaultTableRowBlock(width, true)],
  );
};

export const defaultTableBodyBlock = (height: number, width: number) => {
  return slatejsx(
    "element",
    {
      type: TABLE_BODY_ELEMENT_TYPE,
    },
    [...Array(height)].map(() => defaultTableRowBlock(width)),
  );
};
